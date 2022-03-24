import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create a Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Tony",
      email: "tony@stark.com",
      password: "avengers123"
    });

    if (user.id) {
      const depositStatement = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 300,
        description: "Deposit"
      });

      const withDrawStatement = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 300,
        description: "WithDraw"
      });

      expect(withDrawStatement).toHaveProperty("id");
      expect(withDrawStatement).toHaveProperty("type", "withdraw");

      expect(depositStatement).toHaveProperty("id");
      expect(depositStatement).toHaveProperty("type", "deposit");
    }
  });

  it("Shouldn't be able to create a statement of an Unknown User", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "Unknown User",
        type: OperationType.DEPOSIT,
        amount: 300,
        description: "Deposit"
      })
    }).rejects.toBeInstanceOf(AppError)
  });

  it("Shouldn't be able to withdraw more money then exist in account", async () => {
    const user = await createUserUseCase.execute({
      name: "Tony Stark",
      email: "tony@stark.com",
      password: "UltronLives"
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 300,
        description: "WithDraw",
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})
