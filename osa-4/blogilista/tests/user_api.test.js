const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('when the database has been initialized with an user (fake hash)', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await User.create(helper.testUserHash)
    })

    test('user with too short username is not created', async () => {
        invalidUsernameUser = {
            username: 'ei',
            name: 'Jyrki',
            password: 'pikkukakkonen'
        }

        const result = await api
            .post('/api/users')
            .send(invalidUsernameUser)
            .expect(400)
        
        expect(result.body.error).toContain('must be at least 3 characters long')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(1)
    })

    test('user with too short password is not created', async () => {
        invalidPasswordUser = {
            username: 'jykä',
            name: 'Jyrki',
            password: 'pk'
        }

        const result = await api
            .post('/api/users')
            .send(invalidPasswordUser)
            .expect(400)
        
        expect(result.body.error).toContain('must be at least 3 characters long')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(1)
    })

    test('user with taken username is not created', async () => {
        takenNameUser = {
            username: 'tepa',
            name: 'Jyrki',
            password: 'pikkukakkonen'
        }

        const result = await api
            .post('/api/users')
            .send(takenNameUser)
            .expect(400)
        
        expect(result.body.error).toContain('expected `username` to be unique')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(1)
    })
})

describe('creating an user with a real hash', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    test('user is saved with hash', async () => {
        const savedUser = await api
            .post('/api/users')
            .send(helper.testUserPassword)
            .expect(201)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(1)
        expect(usersAtEnd.map(user => user.id)).toContain(savedUser.body.id)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})