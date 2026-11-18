-- ============================================================================
-- QUESTION 2: Customer Referral Chain
-- ============================================================================
-- Find customers at "depth 2" in the referral chain
-- Expected columns: customer_name, referred_by, originally_referred_by
-- ============================================================================

/* 
YOUR APPROACH:
Use two customer self-joins: the customer is referred by a direct referrer,
and that referrer is in turn referred by the original customer. Filtering out
rows with no original referrer leaves customers at depth 2.
*/

SELECT
    customer.company_name AS customer_name,
    direct_referrer.company_name AS referred_by,
    original_referrer.company_name AS originally_referred_by
FROM customers customer
JOIN customers direct_referrer
    ON direct_referrer.customer_id = customer.referred_by_customer_id
JOIN customers original_referrer
    ON original_referrer.customer_id = direct_referrer.referred_by_customer_id
ORDER BY customer.company_name;

