// application/use-cases/auth/RegisterUseCase.js
import { User } from '../../../domain/entities/user/User.js';
import { RegisterSchema } from '../../../zod/form-validators/auth/auth.validator.js';
export class RegisterUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute = async (inputData) => {
    // 1️⃣ Validar con Zod
    const validatedData = RegisterSchema.safeParse(inputData);

    if (!validatedData.success) {
     throw new Error(validatedData.error.issues.map(e => e.message).join(', '));    
    }


    // 2️⃣ Crear entidad (aplica reglas de negocio)
    const user = User.fromRegister(validatedData.data);

    // 3️⃣ Persistir
    const response = await this.userRepository.register(user.toRegisterPayload());

    return {
     ok : true,
	 message : response.message || 'Registro exitoso'
    }
  };
}