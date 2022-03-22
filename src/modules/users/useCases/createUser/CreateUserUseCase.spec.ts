import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create an User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Bruce Wayne",
      email: "batman@justiceleague.com",
      password: "justice"
    });

    expect(user).toHaveProperty("id");
  });

  it("Shouldn't be able to create an user with the same email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Bruce Wayne",
        email: "batman@justiceleague.com",
        password: "justice"
      });

      await createUserUseCase.execute({
        name: "Tim",
        email: "batman@justiceleague.com",
        password: "robin"
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})
