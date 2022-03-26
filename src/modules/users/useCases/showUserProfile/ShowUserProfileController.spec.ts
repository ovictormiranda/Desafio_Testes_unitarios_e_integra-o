import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import  createConnection  from "../../../../database";
import { app } from "../../../../app";


let connection: Connection;

describe("Show user profile controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4()
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'Bruce', 'brucewayne@justiceleague.com', '${password}', 'now()', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show an specific user profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "brucewayne@justiceleague.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .get("/api/v1/profile")
    .send()
    .set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Bruce");
    expect(response.body.email).toBe("brucewayne@justiceleague.com");
  });
});
