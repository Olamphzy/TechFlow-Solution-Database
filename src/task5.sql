-- ============================================================================
-- QUESTION 5: Complex Join - Product Category Hierarchy
-- ============================================================================
-- Full category path for each product (e.g., "Software > Business Tools > CRM")
-- Expected columns: product_name, category_path, base_price
-- ============================================================================

/* 
YOUR APPROACH:
The hierarchy is three levels deep: leaf category -> parent category -> root.
Self-joins connect each level, and CONCAT builds the display path from root to
leaf.
*/

SELECT
    p.product_name,
    CONCAT(root.category_name, ' > ', parent.category_name, ' > ', leaf.category_name) AS category_path,
    p.base_price
FROM products p
JOIN product_categories leaf ON leaf.category_id = p.category_id
JOIN product_categories parent ON parent.category_id = leaf.parent_category_id
JOIN product_categories root ON root.category_id = parent.parent_category_id
ORDER BY category_path, p.product_name;

