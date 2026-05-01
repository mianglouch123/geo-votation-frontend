// application/use-cases/auth/ChangePasswordUseCase.js
import { ChangePasswordSchema } from "../../../zod/form-validators/auth/auth.validator.js";
export class ChangePasswordUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute = async (inputData) => {
    const validated = ChangePasswordSchema.parse(inputData);
    return await this.userRepository.changePassword(validated);
  };
}