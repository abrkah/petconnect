describe("Provider journey", () => {
  before(() => cy.assertApiReachable());

  beforeEach(() => cy.loginProvider());

  it("shows dashboard metrics", () => {
    cy.contains("Provider dashboard").should("be.visible");
    cy.contains("Pets managed").should("exist");
    cy.contains("Bookings (all)").should("exist");
  });

  it("navigates to bookings and messages", () => {
    cy.get("aside").contains("a", /bookings/i).click();
    cy.location("pathname").should("include", "/provider/bookings");

    cy.get("aside").contains("a", /messages/i).click();
    cy.location("pathname").should("include", "/provider/messages");
    cy.get('[aria-label="Messages"]').should("exist");
  });

  it("opens profile", () => {
    cy.get("aside").contains("a", /profile/i).click();
    cy.location("pathname").should("include", "/provider/profile");
  });
});
