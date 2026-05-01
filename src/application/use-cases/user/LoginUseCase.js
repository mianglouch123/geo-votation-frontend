// application/use-cases/auth/LoginUseCase.js
import { User } from '../../../domain/entities/user/User.js';
import { LoginSchema } from '../../../zod/form-validators/auth/auth.validator.js';
export class LoginUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute = async (inputData) => {
    // 1️⃣ Validar con Zod
    const validatedData = LoginSchema.parse(inputData);

    // 2️⃣ Crear entidad (aplica reglas de negocio)
    const user = User.fromLogin(validatedData);

    // 3️⃣ Autenticar
    const response = await this.userRepository.login(user.toLoginPayload());

    return {
     ok : true,
     accessToken : response.token,
     refreshToken : response.refreshToken
    }
  };
}