/// <reference types="cypress" />

function uiLogin(email: string, password: string, role: "OWNER" | "PROVIDER") {
  cy.visit("/login");
  cy.get('input[placeholder="you@example.com"]', { timeout: 20_000 })
    .should("be.visible")
    .clear()
    .type(email);
  cy.get(".ant-input-password input")
    .first()
    .clear({ force: true })
    .type(password, { log: false });
  cy.contains("button", "Continue").should("be.visible").click();
}

declare global {
  namespace Cypress {
    interface Chainable {
      loginOwner(): Chainable<void>;
      loginProvider(): Chainable<void>;
      loginAs(email: string, password: string, role: "OWNER" | "PROVIDER"): Chainable<void>;
      assertApiReachable(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("assertApiReachable", () => {
  const api = Cypress.env("apiUrl") as string;
  cy.request({ url: `${api}/`, failOnStatusCode: false }).then((res) => {
    expect(res.status, "API root responds").to.be.lessThan(500);
  });
});

Cypress.Commands.add("loginAs", (email, password, role) => {
  uiLogin(email, password, role);
  const path = role === "OWNER" ? "/owner" : "/provider";
  cy.location("pathname", { timeout: 25_000 }).should("include", path);
});

Cypress.Commands.add("loginOwner", () => {
  cy.loginAs(
    Cypress.env("ownerEmail") as string,
    Cypress.env("ownerPassword") as string,
    "OWNER",
  );
});

Cypress.Commands.add("loginProvider", () => {
  cy.loginAs(
    Cypress.env("providerEmail") as string,
    Cypress.env("providerPassword") as string,
    "PROVIDER",
  );
});

export {};
