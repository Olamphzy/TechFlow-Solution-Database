-- ============================================================================
-- QUESTION 1: Basic Aggregation & Filtering (Warmup)
-- ============================================================================
-- Find total revenue from completed orders for each product category
-- Expected columns: category_name, total_revenue
-- ============================================================================

/* 
YOUR APPROACH:
Join completed orders to their line items and product categories. Calculate
revenue as quantity times unit price, after applying the order discount, and
aggregate it by the leaf category name.
*/

SELECT
    pc.category_name,
    ROUND(SUM(oi.quantity * oi.unit_price * (1 - o.discount_percent / 100)), 2) AS total_revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p ON p.product_id = oi.product_id
JOIN product_categories pc ON pc.category_id = p.category_id
WHERE o.status = 'completed'
GROUP BY pc.category_name
ORDER BY total_revenue DESC;

