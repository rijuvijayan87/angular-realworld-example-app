/// <reference types="cypress" />

describe("api testing", () => {
  beforeEach("login to the application", () => {
    cy.loginToApplication();
    cy.intercept({ method: "GET", path: "tags" }, { fixture: "tags.json" }).as(
      "tags"
    );
  });
  it("delete feed", () => {
    const articleBody = {
      article: {
        tagList: [],
        title: "test automations",
        description: "article on test automations",
        body:
          "this is regarding how to perform test automations in a corporate environment",
      },
    };
    cy.get("@token").then((token) => {
      cy.request({
        url: Cypress.env("apiUrl") + "articles/",
        headers: { Authorization: "Token " + token },
        method: "POST",
        body: articleBody,
      }).then((res) => {
        expect(res.status).to.equal(200);
        cy.contains("Global Feed").click();
        cy.get(".article-preview").contains("test automations").click();
        cy.contains("Delete Article").click();

        cy.request({
          url: Cypress.env("apiUrl") + "articles?limit=10&offset=0",
          headers: { Authorization: "Token " + token },
          method: "GET",
        })
          .its("body")
          .then((body) => {
            expect(body.articles[0].title).to.be.not.equal("test automations");
          });
      });
    });
  });
});
