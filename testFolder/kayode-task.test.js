"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_session_1 = __importDefault(require("supertest-session"));
const globals_1 = require("@jest/globals");
const app_1 = __importDefault(require("../src/app"));
let request;
(0, globals_1.beforeAll)(() => {
    request = (0, supertest_session_1.default)(app_1.default);
});
(0, globals_1.describe)("USER TEST", () => {
    test("should allow user to get tasks assigned to them.");
});
