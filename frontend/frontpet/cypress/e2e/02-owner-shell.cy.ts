describe("Owner app shell & navigation", () => {
  before(() => {
    cy.assertApiReachable();
  });

  beforeEach(() => {
    cy.loginOwner();
  });

  const nav = (label: RegExp | string, pathPart: string) => {
    cy.get("aside").contains("a", label).click();
    cy.location("pathname", { timeout: 15_000 }).should("include", pathPart);
  };

  it("navigates via sidebar: pets, bookings, services, messages, profile", () => {
    nav(/my pets/i, "/owner/pets");
    cy.contains(/pet|add pet|my pets/i).should("exist");

    nav(/bookings/i, "/owner/bookings");

    nav(/services/i, "/owner/providers");

    nav(/messages/i, "/owner/messages");
    cy.get('[aria-label="Messages"]').should("exist");

    nav(/profile/i, "/owner/profile");
  });

  it("shows notification bell and marketing link in header", () => {
    cy.contains("a", "Marketing site").should("be.visible");
    cy.get('button[aria-label*="otification"]').should("exist");
  });

  it("returns to dashboard from sidebar Home", () => {
    cy.get("aside").contains("a", /dashboard/i).click();
    cy.location("pathname").should("match", /\/owner\/?$/);
  });
});
