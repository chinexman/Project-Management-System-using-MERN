"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('supertest');
const app_1 = __importDefault(require("../src/app"));
const memoryServer_1 = __importDefault(require("../Memory_server/memoryServer"));
/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await memoryServer_1.default.connect());
/**
 * Clear all test data after every test.
 */
/**
 * Remove and close the db and server.
 */
afterAll(async () => await memoryServer_1.default.closeDatabase());
describe('testing user;s Signup routes', () => {
    it('response with status of 201 for an account already in existence', async () => {
        const result = await request(app_1.default).post('/user').send({
            "fullName": "Dilichukwu Isintume",
            "email": "isintumejenny@gmail.com",
            "password": "1234"
        });
        expect(result.statusCode).toBe(201);
    });
});
