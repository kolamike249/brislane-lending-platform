import { test, expect } from "../../fixtures/auth.fixture";

/**
 * Critical API path using the authorised environment's synthetic test account.
 * Registration and notifications are not exposed by the current API contract;
 * see docs/reports/accessibility-audit-report.md for release gaps.
 */
test("critical loan journey: authenticated customer → application → submit → payments", async ({ authenticatedRequest }) => {
  // The worker-scoped auth fixture has already completed POST /auth/login.
  const customersResponse = await authenticatedRequest.get("/customers");
  expect(customersResponse.status()).toBe(200);
  const customers = await customersResponse.json();
  expect(Array.isArray(customers)).toBe(true);
  expect(customers.length).toBeGreaterThan(0);
  const customerId = customers[0].id;
  expect(customerId).toBeTruthy();

  const applicationResponse = await authenticatedRequest.post("/loans/applications", {
    data: { customer_id: customerId, loan_amount: 5000, loan_term_months: 24, purpose: "home_improvement" },
  });
  expect(applicationResponse.status()).toBe(201);
  const application = await applicationResponse.json();
  expect(application.id).toBeTruthy();
  expect(application.status).toBe("draft");
  expect(application.customer_id).toBe(customerId);

  const submitResponse = await authenticatedRequest.put("/loans/submit", {
    data: { application_id: application.id, declaration_accepted: true },
  });
  expect(submitResponse.status()).toBe(200);
  const submitted = await submitResponse.json();
  expect(submitted.status).toBe("submitted");
  expect(submitted.application_id).toBe(application.id);
  expect(submitted.reference).toBeTruthy();

  const paymentsResponse = await authenticatedRequest.get("/payments");
  expect(paymentsResponse.status()).toBe(200);
  const payments = await paymentsResponse.json();
  expect(Array.isArray(payments)).toBe(true);
  for (const payment of payments) {
    expect(payment).toHaveProperty("id");
    expect(payment).toHaveProperty("amount");
    expect(payment).toHaveProperty("status");
  }
});
