import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("User Authentication", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "Tony Stark",
      email: "ironman@avengers.com",
      password: "genius_playboy_billionaire"
    };
    await createUserUseCase.execute(user);

    const authenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authenticate).toHaveProperty("token");
  });

  it("Shouldn't be able to authenticate a nonexistent user", () => {
    expect( async () => {
      await authenticateUserUseCase.execute({
        email: "nemCrieiUsuario@comoVouAutenticar.com",
        password: "impossible"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to authenticate with incorrect password", () => {
    expect( async () => {
      const user : ICreateUserDTO = {
        name: "Tony Stark",
        email: "ironman@avengers.com",
        password: "genius_playboy_billionaire"
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword"
      })
    }).rejects.toBeInstanceOf(AppError);
  })

});
