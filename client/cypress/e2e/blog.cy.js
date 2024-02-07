describe('Blog app', function(){
  beforeEach(function(){
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name:'Kien Nguyen',
      username:'kien',
      password:'password'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`,user)
    cy.visit('')
  })

  it('Login form is shown', function(){
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function (){
    it('Success with right credentials', function(){
      cy.get('#username').type('kien')
      cy.get('#password').type('password')
      cy.get('button').click()

      cy.get('html').should('contain','Kien Nguyen logged in')
    })

    it('Fails with wrong credentials', function(){
      cy.get('#username').type('kien')
      cy.get('#password').type('wrong password')
      cy.get('button').click()

      cy.get('html').should('not.contain','Kien Nguyen logged in')
                    .should('contain','Wrong Username or Password')
    })
  })

  describe.only('When logged in', function(){
    beforeEach(function(){
      cy.login({username:'kien',password:'password'})
    })
    it('A blog can be created', function(){
      cy.get('#createButton').click()
      cy.get('#title-field').type('first test blog')
      cy.get('#author-field').type('Kien')
      cy.get('#url-field').type('nskien.xyz')
      cy.get('.post-button').click()

      cy.get('html').should('contain','Added: first test blog')
                    .should('contain','first test blog - Kien')
    })
    describe.only('A several blogs are created', function(){
      beforeEach(function(){
        cy.createBlog({title:'first blog',author:'first author',url:'first.url'})
        cy.createBlog({title:'second blog',author:'second author',url:'second.url'})
        cy.createBlog({title:'third blog',author:'third author',url:'third.url'})
      })

      it('User can like a blog', function(){
        cy.contains('second blog').contains('view').click()
        cy.get(".view-open[style='']").contains('like').click()
        cy.get(".view-open[style='']").should('contain','1')
      })

      it('Blog created by a user can be deleted by them', function(){
        cy.contains('second blog').contains('view').click()
        cy.get(".view-open[style='']").contains('remove').click()
        cy.get('html').should('not.contain','second blog')
      })

      it('Anyone besides creator cannot see the delete button', function(){
        cy.contains('log out').click()
        cy.request('POST',`${Cypress.env('BACKEND')}/users`,{
          name:'Second User',
          username:'seconduser',
          password:'anotherpass'
        })
        cy.login({username:'seconduser',password:'anotherpass'})
      })

      it.only('Blogs are ordered by number of likes', function(){
        cy.contains('third blog').contains('view').click()
        cy.get(".view-open[style='']").contains('like').click().wait(1000)
        cy.get(".view-open[style='']").contains('like').click().wait(1000)

        cy.contains('second blog').contains('view').click()
        cy.get(".view-open[style='']").contains('second blog').contains('like').click().wait(1000)

        cy.get('.blog').eq([0]).should('contain','third blog')
        cy.get('.blog').eq([1]).should('contain','second blog')
        cy.get('.blog').eq([2]).should('contain','first blog')
      })
    })
  })
})