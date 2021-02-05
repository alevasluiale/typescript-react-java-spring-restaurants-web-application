const { cyan } = require("@material-ui/core/colors")

describe('Registerr',() => {
  before(() => {
    cy.visit('http://localhost:3000');
  });
  it('enters register page',()=>{
    cy.contains('Sign Up').click()
  })

  it('enter data into the fields', () => {
    cy.get('input[name="email"]').type("cypress@gmail.com");
    cy.get('input[name="password"]').type("123456");
    cy.get('input[name="username"]').type("cypress");
  });

  it('submit the form', () => {
    cy.get('button').contains('Register').click();
  });
})