import supertestSession from "supertest-session";
import { describe, beforeAll } from "@jest/globals";
import app from "../src/app";

let request;

beforeAll(() => {
  request = supertestSession(app);
});

describe("USER TEST", () => {
  test("should allow user to get tasks assigned to them.");
});
