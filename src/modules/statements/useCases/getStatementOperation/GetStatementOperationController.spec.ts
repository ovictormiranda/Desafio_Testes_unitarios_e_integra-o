

import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("GetOperationController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'tony@stark.com', '${password}', 'now()', 'now()' )`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to get a statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "tony@stark.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const statement = await request(app)
      .post ("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit test"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(statement.body.id);
  });

  it("Shouldn't be able to get an statement to an unknown id", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "tony@stark.com",
      password: "admin"
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get(`/api/v1/statements/${uuidV4()}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(404);
  })
})
