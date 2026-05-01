// application/use-cases/auth/ResetPasswordUseCase.js
import { ResetPasswordSchema } from '../../../zod/form-validators/auth/auth.validator.js';
export class ResetPasswordUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute = async (inputData) => {
    const validated = ResetPasswordSchema.parse(inputData);
    return await this.userRepository.resetPassword(validated);
  };
}