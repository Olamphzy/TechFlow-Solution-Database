-- ============================================================================
-- QUESTION 6: Cohort Analysis
-- ============================================================================
-- Customer cohort analysis by first order quarter
-- Expected columns: cohort_quarter, order_quarter, quarters_since_first, cohort_revenue, customer_count
-- ============================================================================

/* 
YOUR APPROACH:
Find each customer's first completed-order quarter, join that cohort to all
completed order quarters, and calculate revenue after discounts. The quarter
offset is the difference in year and quarter numbers.
*/

WITH first_orders AS (
    SELECT
        customer_id,
        MIN(order_date) AS first_order_date
    FROM orders
    WHERE status = 'completed'
    GROUP BY customer_id
),
order_revenue AS (
    SELECT
        o.customer_id,
        o.order_id,
        o.order_date,
        SUM(oi.quantity * oi.unit_price * (1 - o.discount_percent / 100)) AS order_revenue
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.order_id
    WHERE o.status = 'completed'
    GROUP BY o.customer_id, o.order_id, o.order_date, o.discount_percent
),
cohort_orders AS (
    SELECT
        first_orders.customer_id,
        CONCAT('Q', QUARTER(first_orders.first_order_date), ' ', YEAR(first_orders.first_order_date)) AS cohort_quarter,
        CONCAT('Q', QUARTER(order_revenue.order_date), ' ', YEAR(order_revenue.order_date)) AS order_quarter,
        (YEAR(order_revenue.order_date) - YEAR(first_orders.first_order_date)) * 4
            + (QUARTER(order_revenue.order_date) - QUARTER(first_orders.first_order_date)) AS quarters_since_first,
        order_revenue.order_revenue
    FROM first_orders
    JOIN order_revenue ON order_revenue.customer_id = first_orders.customer_id
)
SELECT
    cohort_quarter,
    order_quarter,
    quarters_since_first,
    ROUND(SUM(order_revenue), 2) AS cohort_revenue,
    COUNT(DISTINCT customer_id) AS customer_count
FROM cohort_orders
GROUP BY cohort_quarter, order_quarter, quarters_since_first
ORDER BY cohort_quarter, quarters_since_first;

