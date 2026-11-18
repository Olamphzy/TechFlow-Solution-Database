-- ============================================================================
-- QUESTION 7: Gap Analysis - Missing Data Detection
-- ============================================================================
-- Find active sales employees missing performance reviews in 2024
-- Expected columns: employee_name, missing_quarters
-- ============================================================================

/* 
YOUR APPROACH:
Create the required 2024 quarter set and cross join it with active Sales
employees hired before July 2024. Left join performance reviews for matching
quarters, retain unmatched rows, and concatenate the missing quarter labels.
*/

WITH missing AS (
    SELECT
        employee.employee_id,
        CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name,
        quarter.quarter
    FROM employees employee
    JOIN departments department
        ON department.department_id = employee.department_id
    CROSS JOIN (
        SELECT 'Q1' AS quarter UNION ALL
        SELECT 'Q2' UNION ALL
        SELECT 'Q3'
    ) quarter
    LEFT JOIN employee_performance performance
        ON performance.employee_id = employee.employee_id
       AND performance.review_year = 2024
       AND performance.review_quarter = quarter.quarter
    WHERE department.department_name = 'Sales'
      AND employee.is_active = TRUE
      AND employee.hire_date < '2024-07-01'
      AND performance.performance_id IS NULL
)
SELECT
    employee_name,
    GROUP_CONCAT(quarter ORDER BY FIELD(quarter, 'Q1', 'Q2', 'Q3') SEPARATOR ', ') AS missing_quarters
FROM missing
GROUP BY employee_id, employee_name
ORDER BY employee_name;

