-- ============================================================================
-- QUESTION 4: Window Functions - Running Totals & Rankings
-- ============================================================================
-- Monthly revenue with running total and rank for 2024
-- Expected columns: month, monthly_revenue, running_total, revenue_rank
-- ============================================================================

/* 
YOUR APPROACH:
Aggregate completed order revenue by calendar month, then apply window
functions over month order: SUM for the running total and RANK for descending
monthly revenue.
*/

WITH monthly_revenue AS (
    SELECT
        DATE_FORMAT(o.order_date, '%Y-%m') AS month,
        ROUND(SUM(oi.quantity * oi.unit_price * (1 - o.discount_percent / 100)), 2) AS monthly_revenue
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.order_id
    WHERE o.status = 'completed'
      AND o.order_date >= '2024-01-01'
      AND o.order_date < '2025-01-01'
    GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
)
SELECT
    month,
    monthly_revenue,
    SUM(monthly_revenue) OVER (
        ORDER BY month
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total,
    RANK() OVER (ORDER BY monthly_revenue DESC) AS revenue_rank
FROM monthly_revenue
ORDER BY month;

