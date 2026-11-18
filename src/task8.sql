-- ============================================================================
-- QUESTION 8: Advanced Analytics - Customer Lifetime Value
-- ============================================================================
-- Calculate CLV metrics for each customer
-- Expected columns: customer_name, total_revenue, order_count, avg_days_between_orders, 
--                   tenure_days, clv_segment
-- ============================================================================

/* 
YOUR APPROACH:
Aggregate completed order revenue per customer, calculate order-to-order gaps
with LAG, and calculate tenure from the first to last completed order. NTILE(10)
segments revenue: buckets 1-2 are High, buckets 3-5 are Medium, and the rest
are Low.
*/

WITH order_totals AS (
    SELECT
        o.customer_id,
        o.order_id,
        o.order_date,
        ROUND(SUM(oi.quantity * oi.unit_price * (1 - o.discount_percent / 100)), 2) AS order_revenue
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.order_id
    WHERE o.status = 'completed'
    GROUP BY o.customer_id, o.order_id, o.order_date, o.discount_percent
),
order_gaps AS (
    SELECT
        customer_id,
        order_id,
        order_date,
        order_revenue,
        DATEDIFF(order_date, LAG(order_date) OVER (
            PARTITION BY customer_id ORDER BY order_date, order_id
        )) AS days_between
    FROM order_totals
),
customer_metrics AS (
    SELECT
        customer_id,
        ROUND(SUM(order_revenue), 2) AS total_revenue,
        COUNT(*) AS order_count,
        ROUND(AVG(days_between), 2) AS avg_days_between_orders,
        DATEDIFF(MAX(order_date), MIN(order_date)) AS tenure_days
    FROM order_gaps
    GROUP BY customer_id
),
segmented AS (
    SELECT
        customer_metrics.*,
        NTILE(10) OVER (ORDER BY total_revenue DESC) AS revenue_decile
    FROM customer_metrics
)
SELECT
    customer.company_name AS customer_name,
    segmented.total_revenue,
    segmented.order_count,
    COALESCE(segmented.avg_days_between_orders, 0) AS avg_days_between_orders,
    segmented.tenure_days,
    CASE
        WHEN segmented.revenue_decile <= 2 THEN 'High'
        WHEN segmented.revenue_decile <= 5 THEN 'Medium'
        ELSE 'Low'
    END AS clv_segment
FROM segmented
JOIN customers customer ON customer.customer_id = segmented.customer_id
ORDER BY segmented.total_revenue DESC, customer_name;

