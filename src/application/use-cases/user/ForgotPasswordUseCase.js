// application/use-cases/auth/ForgotPasswordUseCase.js
import { ForgotPasswordSchema } from '../../../zod/form-validators/auth/auth.validator.js';

export class ForgotPasswordUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute = async (inputData) => {
    const validated = ForgotPasswordSchema.parse(inputData);
    const data =  await this.userRepository.forgotPassword(validated.email);
    return {
     ok : true,
     data
    }
    
  };
}