import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid"
import { app } from "../../../../app";
import createConnection from "../../../../database";


let connection: Connection;

describe("AuthenticateUserController", () => {
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

  it("Should be able to authenticate an user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "brucewayne@justiceleague.com",
      password: "admin",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Shouldn't be able to authenticate an user with wrong password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "brucewayne@justiceleague.com",
      password: "Wrong-password",
    });

    expect(response.status).toBe(401);
  });

  it("Shouldn't be able to authenticate and user with a wrong email", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "wrong@email.com",
      password: "admin",
    });

    expect(response.status).toBe(401);
  });
});
