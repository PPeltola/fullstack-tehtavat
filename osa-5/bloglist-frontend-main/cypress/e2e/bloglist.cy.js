let user

describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
        user = {
            username: 'hondakuski69',
            name: 'kimmo',
            password: 'maantiekunkku'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.visit('')
    })

    it('displays the login screen by default', function() {
        cy.contains('log in to application')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type(user.username)
            cy.get('#password').type(user.password)
            cy.get('#login-button').click()
            cy.contains(`${user.name} logged in`)
        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type(user.username)
            cy.get('#password').type('banaani123')
            cy.get('#login-button').click()
            cy.contains('invalid credentials')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: user.username, password: user.password })
        })

        it('a blog can be created', function() {
            cy.contains('new blog').click()
            cy.get('#new-blog-title').type('Hondan takapenkillä')
            cy.get('#new-blog-author').type('Kimmo K')
            cy.get('#new-blog-url').type('www.pilipali.io')
            cy.get('#new-blog-submit').click()

            cy.contains('Hondan takapenkillä')
            cy.contains('Kimmo K')
        })

        describe('and a blog has been created', function() {
            beforeEach(function() {
                cy.createBlog({
                    title: 'Hondan takapenkillä',
                    author: 'Kimmo K',
                    url: 'www.pilipali.io'
                })
            })

            it('the blog can be liked', function() {
                cy.contains('Hondan takapenkillä').contains('view').click()
                cy.contains('Hondan takapenkillä').contains('like').click()
                cy.contains('Hondan takapenkillä').contains('likes 1')
            })

            it('the blog can be deleted', function() {
                cy.contains('Hondan takapenkillä').contains('view').click()
                cy.contains('Hondan takapenkillä').contains('delete').click()
                cy.contains('Hondan takapenkillä').should('not.exist')
            })

            it('the blog can\'t be deleted by other users', function() {
                const secondUser = {
                    username: 'teppo',
                    name: 'Tepeteus Toinen',
                    password: 'poistanblogisi'
                }
                cy.request('POST', `${Cypress.env('BACKEND')}/users`, secondUser)

                cy.contains('logout').click()
                cy.login({ username: secondUser.username, password: secondUser.password })
                cy.contains('Hondan takapenkillä').contains('view').click()
                cy.contains('Hondan takapenkillä').contains('delete').should('not.exist')
            })
        })

        describe('and many blogs have been created', function() {
            beforeEach(function() {
                cy.createBlog({
                    title: 'Hondan takapenkillä',
                    author: 'Kimmo K',
                    url: 'www.pilipali.io',
                    likes: 5
                })

                cy.createBlog({
                    title: 'Hondan takapenkillä 2: kylmää kyytiä',
                    author: 'Kimmo K',
                    url: 'www.pilipali.eu',
                    likes: 9
                })

                cy.createBlog({
                    title: 'Hondan takapenkillä 3: penkinlämmittimen paahde',
                    author: 'Tepeteus T',
                    url: 'www.pilipali.biz',
                    likes: 2
                })
            })

            it('the blogs are ordered by amount of likes', function() {
                cy.contains('Hondan takapenkillä Kimmo K').contains('view').click()
                cy.contains('Hondan takapenkillä 2: kylmää kyytiä').contains('view').click()
                cy.contains('Hondan takapenkillä 3: penkinlämmittimen paahde').contains('view').click()

                cy.get('.blog').eq(0).should('contain', 'Hondan takapenkillä 2: kylmää kyytiä')
                cy.get('.blog').eq(1).should('contain', 'Hondan takapenkillä Kimmo K')
                cy.get('.blog').eq(2).should('contain', 'Hondan takapenkillä 3: penkinlämmittimen paahde')
            })
        })
    })
})