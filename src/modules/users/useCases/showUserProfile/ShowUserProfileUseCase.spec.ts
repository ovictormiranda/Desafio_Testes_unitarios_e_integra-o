import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {
  beforeEach( async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show an User Profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Tony Stark",
      email: "tony@stark.com",
      password: "GeniusPlayboyBillionaire"
    });

    if (user.id) {
      const response = await showUserProfileUseCase.execute(user.id);

      expect(response).toHaveProperty("id");
    }
  });
});
