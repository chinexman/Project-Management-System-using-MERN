import supertest from "supertest";
import {
  describe,
  beforeEach,
  test,
  expect,
  beforeAll,
  afterEach,
  afterAll,
} from "@jest/globals";
import { connect, clearDatabase, closeDatabase } from "./memory-db-handler";
import app from "../src/app";
import userModel from "../src/models/user";
import taskModel from "../src/models/task";
import bcrypt from "bcrypt";

//initial declaration for typescript intellisense support
let request = supertest.agent();

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await closeDatabase());

/**
 * Resets the session for each tests.
 */
beforeEach(() => {
  request = supertest.agent(app);
});

const user1Login = {
  email: "kayodeodole@gmail.com",
  password: "123456",
};

const user1Reg = {
  email: "kayodeodole@gmail.com",
  password: bcrypt.hashSync("123456", 12),
  fullname: "kayode odole",
};

const user2Login = {
  email: "kayodeodole2@gmail.com",
  password: "123456",
};

const user2Reg = {
  email: "kayodeodole2@gmail.com",
  password: bcrypt.hashSync("123456", 12),
  fullname: "kayode odole",
};

const sweepTheFloorTask = {
  title: "Sweep the floor",
  description: "Kayode don't forget to sweep the floor of your room.",
  owner: "this field will be updated before adding to database",
  assignee: "This field will be updated before adding to database",
  dueDate: "10/26/2021",
};

const loginSuccessText = "Found. Redirecting to /users/welcome";
const loginFailText = "Found. Redirecting to /users/loginfail";

describe("USER TEST", () => {
  test("should allow user to get tasks assigned to them.", async () => {
    //register user1 into the database
    await userModel.create(user1Reg);
    //login
    await request
      .post("/users/login")
      .send(user1Login)
      .expect(302)
      .expect((res) => {
        expect(res.text).toBe(loginSuccessText);
      });
    //user can get task assigned to them
    await request
      .get("/tasks")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.tasks)).toBe(true);
      });
  });

  test("should allow owner to delete task", async () => {
    //register user1 into the database
    const user1Db = await userModel.create(user1Reg);
    //regist user2 into the database
    const user2Db = await userModel.create(user2Reg);

    //user1 creates a task
    const taskDb = await taskModel.create({
      ...sweepTheFloorTask,
      owner: user1Db._id,
      assignee: user2Db._id,
    });

    //user2 login
    await request
      .post("/users/login")
      .send(user2Login)
      .expect(302)
      .expect((res) => {
        expect(res.text).toBe(loginSuccessText);
      });

    //user2 should not be allowed to delete task
    await request
      .delete(`/tasks/${taskDb._id}`)
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toBe(
          "You are not authorized to delete this task."
        );
      });

    //user2 logsout
    await request.get("/users/logout").expect(200);

    //user1 logs in
    await request
      .post("/users/login")
      .send(user1Login)
      .expect(302)
      .expect((res) => {
        expect(res.text).toBe(loginSuccessText);
      });

    //user1 deletes the task
    await request
      .delete(`/tasks/${taskDb._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe("Deleted successfully");
      });
  });
});
