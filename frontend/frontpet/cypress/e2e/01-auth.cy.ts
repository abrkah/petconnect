describe("Authentication", () => {
  before(() => {
    cy.assertApiReachable();
  });

  it("logs in as seeded pet owner and lands on dashboard", () => {
    cy.loginOwner();
    cy.contains(/good morning|good afternoon|good evening/i).should("exist");
    cy.contains(/overview|workspace|pet parents/i).should("exist");
  });

  it("logs in as seeded provider and lands on provider dashboard", () => {
    cy.loginProvider();
    cy.contains("Provider dashboard").should("be.visible");
    cy.contains("Pending hire requests").should("exist");
  });

  it("shows an error for invalid credentials", () => {
    cy.visit("/login");
    cy.get('input[placeholder="you@example.com"]').clear().type("wrong@example.com");
    cy.get(".ant-input-password input").first().type("WrongPass!", { log: false });
    cy.contains("button", "Continue").click();
    cy.location("pathname", { timeout: 20_000 }).should("include", "/login");
    cy.get(".ant-message", { timeout: 15_000 }).should("exist");
  });
});
