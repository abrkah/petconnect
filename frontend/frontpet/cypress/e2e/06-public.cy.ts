describe("Public marketing routes", () => {
  it("loads home page", () => {
    cy.visit("/");
    cy.get("body").should("be.visible");
    cy.contains(/pet|calmer|care/i).should("exist");
  });

  it("reaches login from home CTA", () => {
    cy.visit("/");
    cy.contains("a", "I'm a pet owner").click();
    cy.location("pathname", { timeout: 15_000 }).should("include", "/login");
  });
});
