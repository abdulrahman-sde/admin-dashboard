describe("app", () => {
  it("loads", () => {
    cy.visit("/");
    cy.get("body").should("be.visible");
    cy.get("body").should("not.be.empty");
  });
});
