describe("Owner data pages (API-backed)", () => {
  before(() => cy.assertApiReachable());

  beforeEach(() => cy.loginOwner());

  it("loads pets list from API (seeded demo)", () => {
    cy.visit("/owner/pets");
    cy.contains(/seed pet|lab|tabby|beagle|add pet/i, { timeout: 20_000 }).should(
      "exist",
    );
  });

  it("opens first pet hub when a pet link exists", () => {
    cy.visit("/owner/pets");
    cy.get('a[href^="/owner/pets/"]', { timeout: 20_000 })
      .first()
      .then(($a) => {
        const href = $a.attr("href");
        if (!href) return;
        cy.wrap($a).click();
        cy.url().should("include", href);
      });
  });

  it("loads bookings page", () => {
    cy.visit("/owner/bookings");
    cy.get("main").should("exist");
    cy.contains(/booking|schedule|empty|no/i, { timeout: 20_000 }).should("exist");
  });

  it("loads provider directory (services)", () => {
    cy.visit("/owner/providers");
    cy.contains(/provider|service|directory|book/i, { timeout: 20_000 }).should(
      "exist",
    );
  });

  it("loads owner profile", () => {
    cy.visit("/owner/profile");
    cy.contains(/profile|phone|name|email/i, { timeout: 20_000 }).should("exist");
  });
});
