import { createConnection } from 'typeorm';

(async () => await createConnection({
  type: "postgres",
  host: "localhost",
  port: 5434,
  username: "postgres",
  password: "docker",
  name: "default",
  database: "fin_api"
}))();

