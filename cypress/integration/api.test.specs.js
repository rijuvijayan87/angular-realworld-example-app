/// <reference types="cypress" />

describe("api testing", () => {
  beforeEach("login to the application", () => {
    cy.loginToApplication();
    cy.intercept({ method: "GET", path: "tags" }, { fixture: "tags.json" }).as(
      "tags"
    );
  });

  it("Create and validate article", () => {
    cy.intercept("POST", "**/articles").as("postArticles");
    cy.wait("@tags");
    cy.get('[href="/editor"]').click();
    cy.get('[placeholder="Article Title"]').type("Test article");
    cy.get('[placeholder="What\'s this article about?"]').type(
      "test whats the article about"
    );
    cy.get('[placeholder="Write your article (in markdown)"]').type(
      "Writing the article. testing"
    );
    cy.get('[placeholder="Enter tags"]').type("general");
    cy.get("button").click();

    cy.wait("@postArticles");
    cy.get("@postArticles").then((xhr) => {
      console.log(xhr);
      expect(xhr.status).to.equal(200);
    });
  });

  it.only("Intecepting and modifying", () => {
    // cy.intercept("POST", "**/articles", (req) => {
    //   req.body.article.description =
    //     "test whats the article about updated through interception";
    // }).as("postArticles");

    cy.intercept({ method: "POST", path: "articles" }, (req) => {
      req.reply((res) => {
        expect(res.body.article.description).to.equal(
          "test whats the article about"
        );
        res.body.article.description =
          "test whats the articles about updated through interception";
      });
    }).as("postArticles");
    cy.wait("@tags");
    cy.get('[href="/editor"]').click();
    cy.get('[placeholder="Article Title"]').type("Test article");
    cy.get('[placeholder="What\'s this article about?"]').type(
      "test whats the article about"
    );
    cy.get('[placeholder="Write your article (in markdown)"]').type(
      "Writing the article. testing"
    );
    cy.get('[placeholder="Enter tags"]').type("general");
    cy.get("button").click();

    cy.wait("@postArticles").its("response.statusCode").should("eq", 200);
    // cy.get("@postArticles").then((xhr) => {
    //   console.log(xhr);
    //   //expect(xhr.response.statusCode).to.equal(200);

    // });
  });

  it("show your feed", () => {
    cy.intercept("GET", "**/articles/feed*", { fixture: "myArticles.json" }).as(
      "myArticles"
    );
    cy.wait("@myArticles");
    cy.fixture("likeArticle").then((file) => {
      const a = file.article.slug;
      cy.intercept("POST", "**/articles/" + a + "/favorite", file);
    });

    cy.intercept("GET", "**/articles*", { fixture: "articles.json" }).as(
      "articles"
    );
    cy.contains("Global Feed").click();
    cy.wait("@articles");
  });
});
