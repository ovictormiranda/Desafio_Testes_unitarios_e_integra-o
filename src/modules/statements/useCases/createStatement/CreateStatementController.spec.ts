import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

import createConnection  from "../../../../database";

let connection: Connection;

describe("CreateStatementController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'brucewayne@justiceleague.com', '${password}', 'now()', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a deposit statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "brucewayne@justiceleague.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 5000,
        description: "Deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.amount).toBe(5000);
  });

  it("Should be able to create withdraw statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "brucewayne@justiceleague.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "Withdraw test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.amount).toBe(200);
  })

});
