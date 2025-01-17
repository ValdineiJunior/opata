import { beforeEach, describe, expect, it } from "vitest";
import { container } from "tsyringe";
import { CreateAnimalRoute } from "./create-animal.route";
import { CreateAnimalUseCase } from "@/app/use-cases/create-animal/create-animal.usecase";
import { AnimalRepositoryGateway } from "@/app/domain/animal/gateway/animal-repository.gateway.interface";
import { CreateAnimalInputDto } from "@/app/use-cases/create-animal/create-animal.dto";
import { CreateAnimalPresentOutput } from "../../presenters/create-animal/create-animal.presenter.dto";
import { UUID_REGEX } from "@/app/globals/constants";

describe("routes / create-animal", () => {
  let animalRepository: AnimalRepositoryGateway;
  let createAnimalUseCase: CreateAnimalUseCase;
  let createAnimalRoute: CreateAnimalRoute;
  beforeEach(() => {
    animalRepository = container.resolve("AnimalRepositoryGateway");
    createAnimalUseCase = CreateAnimalUseCase.create(animalRepository);
    createAnimalRoute = CreateAnimalRoute.create(createAnimalUseCase);
  });

  it("should create a new animal", async () => {
    const request = {
      json: async (): Promise<CreateAnimalInputDto> => {
        return {
          name: "Turtle",
          age: 10,
          history: "Turtle history",
          observations: "Turtle observations",
        };
      },
    } as Request;

    const response = await createAnimalRoute.handle(request);
    const output: CreateAnimalPresentOutput = await response.json();
    expect(response.status).toBe(201);
    expect(output.id).toMatch(UUID_REGEX);
    expect(output.name).toBe("Turtle");
    expect(output.age).toBe(10);
    expect(output.history).toBe("Turtle history");
    expect(output.observations).toBe("Turtle observations");
  });
});
