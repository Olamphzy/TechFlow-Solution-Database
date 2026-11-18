-- ============================================================================
-- QUESTION 3: Employee Hierarchy & Performance
-- ============================================================================
-- For each Sales manager: direct reports, avg performance, team revenue
-- Expected columns: manager_name, direct_reports_count, avg_team_performance, team_total_revenue
-- ============================================================================

/* 
YOUR APPROACH:
Select Sales managers who have direct reports, then aggregate their reports'
performance rows for 2024. Direct report count uses COUNT(DISTINCT), while
average score and total revenue cover all available direct-report reviews.
*/

SELECT
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name,
    COUNT(DISTINCT report.employee_id) AS direct_reports_count,
    ROUND(AVG(performance.performance_score), 2) AS avg_team_performance,
    ROUND(SUM(performance.revenue_generated), 2) AS team_total_revenue
FROM employees manager
JOIN departments department
    ON department.department_id = manager.department_id
JOIN employees report
    ON report.manager_id = manager.employee_id
JOIN employee_performance performance
    ON performance.employee_id = report.employee_id
WHERE department.department_name = 'Sales'
  AND manager.is_active = TRUE
  AND performance.review_year = 2024
GROUP BY manager.employee_id, manager.first_name, manager.last_name
HAVING COUNT(DISTINCT report.employee_id) > 0
ORDER BY manager_name;
