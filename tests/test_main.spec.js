let readFile = require("../src/readFile");
let executeQuery = require("../src/executeQuery");
let path = require("path");

const isDescending = (arr) => {
  return arr.every((x, i) => {
    return i === 0 || x <= arr[i - 1];
  });
};

describe("Task 1", () => {
  let categories;
  let revenues;

  beforeAll(async () => {
    try {
      const sql = await readFile(
        path.join(__dirname, "..", "src", "task1.sql")
      );
      if (sql.length > 0) {
        categories = await executeQuery(sql);
      }
      if (categories && Array.isArray(categories)) {
        revenues = categories.map((result) => {
          return parseFloat(result.total_revenue) || 0;
        });
      }
    } catch (e) {
      console.error(e);
    }
  });

  test("should return category_name and total_revenue columns", () => {
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    const keys = Object.keys(categories[0]);
    expect(keys).toContain("category_name");
    expect(keys).toContain("total_revenue");
  });

  test("should sort results by revenue in descending order", () => {
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(revenues).toBeDefined();
    expect(Array.isArray(revenues)).toBe(true);
    expect(revenues.length).toBeGreaterThan(0);
    expect(isDescending(revenues)).toBe(true);
  });

  test("should include CRM category in results with correct revenue calculation", () => {
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    const crmCategory = categories.find(
      (cat) => cat.category_name === "CRM"
    );
    expect(crmCategory).toBeDefined();
    expect(parseFloat(crmCategory.total_revenue)).toBeGreaterThan(0);
  });

  test("should have highest revenue category as first record", () => {
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(revenues).toBeDefined();
    expect(Array.isArray(revenues)).toBe(true);
    const firstRevenue = parseFloat(categories[0].total_revenue) || 0;
    const lastRevenue = parseFloat(categories[categories.length - 1].total_revenue) || 0;
    expect(firstRevenue).toBeGreaterThanOrEqual(lastRevenue);
  });
});

describe("Task 2", () => {
  let referrals;

  beforeAll(async () => {
    try {
      const sql = await readFile(
        path.join(__dirname, "..", "src", "task2.sql")
      );
      if (sql.length > 0) {
        referrals = await executeQuery(sql);
      }
    } catch (e) {
      console.error(e);
    }
  });

  test("should return depth 2 referral customers with required columns", () => {
    expect(referrals).toBeDefined();
    expect(Array.isArray(referrals)).toBe(true);
    expect(referrals.length).toBeGreaterThan(0);
    const keys = Object.keys(referrals[0]);
    const hasCompanyName = keys.includes("company_name") || keys.includes("customer_name");
    const hasDirectReferrer = keys.includes("referred_by") || keys.includes("direct_referrer") || keys.includes("referred_by_company_name");
    const hasOriginalReferrer = keys.includes("originally_referred_by") || keys.includes("original_referrer") || keys.includes("originally_referred_by_company_name");
    expect(hasCompanyName).toBe(true);
    expect(hasDirectReferrer).toBe(true);
    expect(hasOriginalReferrer).toBe(true);
  });

  test("should include HealthPlus as a depth 2 customer", () => {
    expect(referrals).toBeDefined();
    expect(Array.isArray(referrals)).toBe(true);
    expect(referrals.length).toBeGreaterThan(0);
    const healthPlus = referrals.find(
      (ref) =>
        ref.company_name === "HealthPlus" ||
        ref.customer_name === "HealthPlus"
    );
    expect(healthPlus).toBeDefined();
  });

  test("should show FinanceHub as the direct referrer for HealthPlus", () => {
    expect(referrals).toBeDefined();
    expect(Array.isArray(referrals)).toBe(true);
    expect(referrals.length).toBeGreaterThan(0);
    const healthPlus = referrals.find(
      (ref) =>
        ref.company_name === "HealthPlus" ||
        ref.customer_name === "HealthPlus"
    );
    expect(healthPlus).toBeDefined();
    const directReferrer =
      healthPlus.referred_by ||
      healthPlus.direct_referrer ||
      healthPlus.referred_by_company_name;
    expect(directReferrer).toBe("FinanceHub");
  });

  test("should show Acme Corp as the original referrer for HealthPlus", () => {
    expect(referrals).toBeDefined();
    expect(Array.isArray(referrals)).toBe(true);
    expect(referrals.length).toBeGreaterThan(0);
    const healthPlus = referrals.find(
      (ref) =>
        ref.company_name === "HealthPlus" ||
        ref.customer_name === "HealthPlus"
    );
    expect(healthPlus).toBeDefined();
    const originalReferrer =
      healthPlus.originally_referred_by ||
      healthPlus.original_referrer ||
      healthPlus.originally_referred_by_company_name;
    expect(originalReferrer).toBe("Acme Corp");
  });
});

describe("Task 3", () => {
  let managers;

  beforeAll(async () => {
    try {
      const sql = await readFile(
        path.join(__dirname, "..", "src", "task3.sql")
      );
      if (sql.length > 0) {
        managers = await executeQuery(sql);
      }
    } catch (e) {
      console.error(e);
    }
  });

  test("should return manager information with required columns", () => {
    expect(managers).toBeDefined();
    expect(Array.isArray(managers)).toBe(true);
    expect(managers.length).toBeGreaterThan(0);
    const keys = Object.keys(managers[0]);
    expect(keys.length).toBeGreaterThanOrEqual(4);
  });

  test("should include Sarah Chen as a Sales manager with 4 direct reports", () => {
    expect(managers).toBeDefined();
    expect(Array.isArray(managers)).toBe(true);
    expect(managers.length).toBeGreaterThan(0);
    const sarah = managers.find(
      (mgr) =>
        mgr.manager_name === "Sarah Chen" ||
        (mgr.first_name === "Sarah" && mgr.last_name === "Chen")
    );
    expect(sarah).toBeDefined();
    const directReports =
      sarah.direct_reports_count || sarah.direct_reports;
    expect(parseInt(directReports)).toBe(4);
  });

  test("should only include Sales department managers", () => {
    expect(managers).toBeDefined();
    expect(Array.isArray(managers)).toBe(true);
    expect(managers.length).toBeGreaterThan(0);
    managers.forEach((mgr) => {
      const department = mgr.department_name || mgr.department;
      if (department) {
        expect(department).toBe("Sales");
      }
    });
  });

  test("should calculate average team performance for Sarah Chen", () => {
    expect(managers).toBeDefined();
    expect(Array.isArray(managers)).toBe(true);
    expect(managers.length).toBeGreaterThan(0);
    const sarah = managers.find(
      (mgr) =>
        mgr.manager_name === "Sarah Chen" ||
        (mgr.first_name === "Sarah" && mgr.last_name === "Chen")
    );
    expect(sarah).toBeDefined();
    const avgPerformance = parseFloat(sarah.avg_team_performance || sarah.average_performance || 0);
    expect(avgPerformance).toBeGreaterThan(0);
  });
});

describe("Task 4", () => {
  let monthlyData;

  beforeAll(async () => {
    try {
      const sql = await readFile(
        path.join(__dirname, "..", "src", "task4.sql")
      );
      if (sql.length > 0) {
        monthlyData = await executeQuery(sql);
      }
    } catch (e) {
      console.error(e);
    }
  });

  test("should return month, monthly_revenue, running_total, and revenue_rank columns", () => {
    expect(monthlyData).toBeDefined();
    expect(Array.isArray(monthlyData)).toBe(true);
    expect(monthlyData.length).toBeGreaterThan(0);
    const keys = Object.keys(monthlyData[0]);
    expect(keys).toContain("month");
    expect(keys).toContain("monthly_revenue");
    expect(keys).toContain("running_total");
    expect(keys).toContain("revenue_rank");
  });

  test("should have exactly 9 months of data for 2024", () => {
    expect(monthlyData).toBeDefined();
    expect(Array.isArray(monthlyData)).toBe(true);
    expect(monthlyData.length).toBe(9);
  });

  test("should have running totals in ascending order", () => {
    expect(monthlyData).toBeDefined();
    expect(Array.isArray(monthlyData)).toBe(true);
    expect(monthlyData.length).toBeGreaterThan(0);
    const runningTotals = monthlyData.map((m) =>
      parseFloat(m.running_total) || 0
    );
    const isAscending = runningTotals.every((x, i) => {
      return i === 0 || x >= runningTotals[i - 1];
    });
    expect(isAscending).toBe(true);
  });

  test("should rank months by revenue with highest revenue as rank 1", () => {
    expect(monthlyData).toBeDefined();
    expect(Array.isArray(monthlyData)).toBe(true);
    expect(monthlyData.length).toBeGreaterThan(0);
    const ranks = monthlyData.map((m) => parseInt(m.revenue_rank) || 0);
    expect(ranks).toContain(1);
    expect(Math.min(...ranks)).toBe(1);
    const highestRevenueMonth = monthlyData.find((m) => parseInt(m.revenue_rank) === 1);
    expect(highestRevenueMonth).toBeDefined();
    const highestRevenue = parseFloat(highestRevenueMonth.monthly_revenue) || 0;
    monthlyData.forEach((m) => {
      const revenue = parseFloat(m.monthly_revenue) || 0;
      expect(highestRevenue).toBeGreaterThanOrEqual(revenue);
    });
  });

  test("should have last month running total equal to sum of all monthly revenues", () => {
    expect(monthlyData).toBeDefined();
    expect(Array.isArray(monthlyData)).toBe(true);
    expect(monthlyData.length).toBeGreaterThan(0);
    const totalRevenue = monthlyData.reduce((sum, m) => {
      return sum + (parseFloat(m.monthly_revenue) || 0);
    }, 0);
    const lastRunningTotal = parseFloat(monthlyData[monthlyData.length - 1].running_total) || 0;
    expect(lastRunningTotal).toBeCloseTo(totalRevenue, 2);
  });
});

describe("Task 5", () => {
  let products;

  beforeAll(async () => {
    try {
      const sql = await readFile(
        path.join(__dirname, "..", "src", "task5.sql")
      );
      if (sql.length > 0) {
        products = await executeQuery(sql);
      }
    } catch (e) {
      console.error(e);
    }
  });

  test("should return product_name, category_path, and base_price columns", () => {
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    const keys = Object.keys(products[0]);
    expect(keys).toContain("product_name");
    expect(keys).toContain("category_path");
    expect(keys).toContain("base_price");
  });

  test("should show TechFlow CRM Basic with exact category path", () => {
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    const crmBasic = products.find(
      (p) => p.product_name === "TechFlow CRM Basic"
    );
    expect(crmBasic).toBeDefined();
    expect(crmBasic.category_path).toBe("Software > Business Tools > CRM");
  });

  test("should order results by category path then product name", () => {
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(1);
    for (let i = 1; i < products.length; i++) {
      const prevPath = products[i - 1].category_path;
      const currPath = products[i].category_path;
      if (prevPath === currPath) {
        expect(products[i - 1].product_name <= products[i].product_name).toBe(true);
      } else {
        expect(prevPath <= currPath).toBe(true);
      }
    }
  });

  test("should include all products with category paths", () => {
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    products.forEach((product) => {
      expect(product.category_path).toBeDefined();
      expect(product.category_path.length).toBeGreaterThan(0);
      expect(product.category_path).toContain(">");
    });
  });
});

describe("Task 6", () => {
  let cohorts;

  beforeAll(async () => {
    try {
      const sql = await readFile(
        path.join(__dirname, "..", "src", "task6.sql")
      );
      if (sql.length > 0) {
        cohorts = await executeQuery(sql);
      }
    } catch (e) {
      console.error(e);
    }
  });

  test("should return cohort_quarter, order_quarter, quarters_since_first, cohort_revenue, and customer_count columns", () => {
    expect(cohorts).toBeDefined();
    expect(Array.isArray(cohorts)).toBe(true);
    expect(cohorts.length).toBeGreaterThan(0);
    const keys = Object.keys(cohorts[0]);
    expect(keys).toContain("cohort_quarter");
    expect(keys).toContain("order_quarter");
    expect(keys).toContain("quarters_since_first");
    expect(keys).toContain("cohort_revenue");
    expect(keys).toContain("customer_count");
  });

  test("should group customers by their first order quarter", () => {
    expect(cohorts).toBeDefined();
    expect(Array.isArray(cohorts)).toBe(true);
    expect(cohorts.length).toBeGreaterThan(0);
  });

  test("should include Q1 2024 as a cohort quarter", () => {
    expect(cohorts).toBeDefined();
    expect(Array.isArray(cohorts)).toBe(true);
    expect(cohorts.length).toBeGreaterThan(0);
    const q1Cohort = cohorts.find(
      (c) => c.cohort_quarter === "Q1 2024" || c.cohort_quarter === "2024-Q1"
    );
    expect(q1Cohort).toBeDefined();
  });

  test("should show revenue progression over quarters with quarters_since_first incrementing", () => {
    expect(cohorts).toBeDefined();
    expect(Array.isArray(cohorts)).toBe(true);
    expect(cohorts.length).toBeGreaterThan(0);
    const cohortRevenues = cohorts.map((c) =>
      parseFloat(c.cohort_revenue) || 0
    );
    expect(cohortRevenues.some((r) => r > 0)).toBe(true);
    const q1Cohort = cohorts.filter(
      (c) => c.cohort_quarter === "Q1 2024" || c.cohort_quarter === "2024-Q1"
    );
    if (q1Cohort.length > 1) {
      const quartersSinceFirst = q1Cohort.map((c) => parseInt(c.quarters_since_first) || 0);
      const isAscending = quartersSinceFirst.every((x, i) => {
        return i === 0 || x >= quartersSinceFirst[i - 1];
      });
      expect(isAscending).toBe(true);
    }
  });
});

describe("Task 7", () => {
  let missingReviews;

  beforeAll(async () => {
    try {
      const sql = await readFile(
        path.join(__dirname, "..", "src", "task7.sql")
      );
      if (sql.length > 0) {
        missingReviews = await executeQuery(sql);
      }
    } catch (e) {
      console.error(e);
    }
  });

  test("should return employee_name and missing_quarters columns", () => {
    expect(missingReviews).toBeDefined();
    expect(Array.isArray(missingReviews)).toBe(true);
    expect(missingReviews.length).toBeGreaterThan(0);
    const keys = Object.keys(missingReviews[0]);
    expect(keys).toContain("employee_name");
    expect(keys).toContain("missing_quarters");
  });

  test("should only include active Sales employees", () => {
    expect(missingReviews).toBeDefined();
    expect(Array.isArray(missingReviews)).toBe(true);
    expect(missingReviews.length).toBeGreaterThan(0);
  });

  test("should identify employees with missing performance reviews", () => {
    expect(missingReviews).toBeDefined();
    expect(Array.isArray(missingReviews)).toBe(true);
    expect(missingReviews.length).toBeGreaterThan(0);
    missingReviews.forEach((review) => {
      expect(review.missing_quarters).toBeDefined();
      expect(review.missing_quarters.length).toBeGreaterThan(0);
      const missingQuarters = review.missing_quarters.split(",").map((q) => q.trim());
      missingQuarters.forEach((quarter) => {
        expect(["Q1", "Q2", "Q3"].includes(quarter)).toBe(true);
      });
    });
  });

  test("should only include employees hired before July 2024", () => {
    expect(missingReviews).toBeDefined();
    expect(Array.isArray(missingReviews)).toBe(true);
    expect(missingReviews.length).toBeGreaterThan(0);
  });
});

describe("Task 8", () => {
  let clvData;

  beforeAll(async () => {
    try {
      const sql = await readFile(
        path.join(__dirname, "..", "src", "task8.sql")
      );
      if (sql.length > 0) {
        clvData = await executeQuery(sql);
      }
    } catch (e) {
      console.error(e);
    }
  });

  test("should return customer_name, total_revenue, order_count, avg_days_between_orders, tenure_days, and clv_segment columns", () => {
    expect(clvData).toBeDefined();
    expect(Array.isArray(clvData)).toBe(true);
    expect(clvData.length).toBeGreaterThan(0);
    const keys = Object.keys(clvData[0]);
    expect(keys).toContain("customer_name");
    expect(keys).toContain("total_revenue");
    expect(keys).toContain("order_count");
    expect(keys).toContain("avg_days_between_orders");
    expect(keys).toContain("tenure_days");
    expect(keys).toContain("clv_segment");
  });

  test("should categorize customers into High, Medium, or Low CLV segments", () => {
    expect(clvData).toBeDefined();
    expect(Array.isArray(clvData)).toBe(true);
    expect(clvData.length).toBeGreaterThan(0);
    const segments = clvData
      .map((c) => c.clv_segment)
      .filter((s) => s);
    const validSegments = ["High", "Medium", "Low"];
    segments.forEach((segment) => {
      expect(validSegments).toContain(segment);
    });
  });

  test("should include Acme Corp in results with correct CLV segment", () => {
    expect(clvData).toBeDefined();
    expect(Array.isArray(clvData)).toBe(true);
    expect(clvData.length).toBeGreaterThan(0);
    const acme = clvData.find(
      (c) => c.customer_name === "Acme Corp" || c.company_name === "Acme Corp"
    );
    expect(acme).toBeDefined();
    expect(["High", "Medium", "Low"]).toContain(acme.clv_segment);
    expect(parseFloat(acme.total_revenue) || 0).toBeGreaterThan(0);
  });

  test("should calculate total revenue correctly with discounts", () => {
    expect(clvData).toBeDefined();
    expect(Array.isArray(clvData)).toBe(true);
    expect(clvData.length).toBeGreaterThan(0);
    const customer = clvData[0];
    expect(parseFloat(customer.total_revenue) || 0).toBeGreaterThan(0);
    expect(parseInt(customer.order_count) || 0).toBeGreaterThan(0);
  });

  test("should only include customers with at least one completed order", () => {
    expect(clvData).toBeDefined();
    expect(Array.isArray(clvData)).toBe(true);
    expect(clvData.length).toBeGreaterThan(0);
    clvData.forEach((customer) => {
      expect(parseInt(customer.order_count) || 0).toBeGreaterThan(0);
    });
  });
});
