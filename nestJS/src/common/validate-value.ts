import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export async function validateValue<T extends object>(
  cls: new () => T,
  plain: object
): Promise<T> {
  const instance = plainToInstance(cls, plain);

  const errors = await validate(instance);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return instance;
}