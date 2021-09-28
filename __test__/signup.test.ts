
const request = require('supertest');
import app from '../src/app'

import dbHandler from "../Memory_server/memoryServer";

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());


describe('testing user;s Signup routes', () => {
    it('response with status of 201 for an account already in existence', async () => {
        const result = await request(app).post('/user').send({          
            "fullName": "Dilichukwu Isintume",
            "email": "isintumejenny@gmail.com",
            "password": "1234"
        })
        expect(result.statusCode).toBe(201)
    })
})