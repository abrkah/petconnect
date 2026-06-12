describe("Registration → login redirect", () => {
  before(() => cy.assertApiReachable());

  it("creates a new owner account and redirects to login", () => {
    const email = `e2e.owner.${Date.now()}@example.com`;
    const password = "CypressTest123!";

    cy.visit("/register?role=OWNER");
    cy.contains("Create account").should("be.visible");

    cy.get('input[type="email"]').clear().type(email);
    cy.get('input[type="password"]').eq(0).clear().type(password);
    cy.get('input[type="password"]').eq(1).clear().type(password);
    cy.contains("button", "Register").click();

    cy.location("pathname", { timeout: 20_000 }).should("include", "/login");
    cy.contains(/sign in|welcome back/i).should("exist");

    cy.get('input[placeholder="you@example.com"]').clear().type(email);
    cy.get(".ant-input-password input").first().type(password, { log: false });
    cy.contains("button", "Continue").click();

    cy.location("pathname", { timeout: 25_000 }).should((path) => {
      expect(
        path.includes("/owner") || path.includes("/onboarding/owner"),
        path,
      ).to.be.true;
    });
  });
});
