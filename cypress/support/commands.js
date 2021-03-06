// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add("loginToApplication", () => {
  //   cy.visit("/");
  //   cy.get('[routerlink="/login"]').click();
  //   cy.get('[placeholder="Email"]').type("rijuvijayan@gmail.com");
  //   cy.get('[type="password"]').type("testautomation");
  //   cy.get('[type="submit"]').click();

  const loginPayload = {
    user: { email: "rijuvijayan@gmail.com", password: "testautomation" },
  };

  cy.request({
    url: Cypress.env("apiUrl") + "users/login",
    method: "POST",
    body: loginPayload,
  })
    .its("body")
    .then((body) => {
      const token = body.user.token;
      cy.wrap(token).as("token");
      cy.visit("/", {
        onBeforeLoad(win) {
          win.localStorage.setItem("jwtToken", token);
        },
      });
    });
});
