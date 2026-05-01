// presentation/hooks/auth/useRegister.js
import {UseMutation} from '../common/UseMutation.jsx';
import { UserRepositoryImpl } from '../../../infraestructure/repositories/UserRepositoryImpl.js';
import { RegisterUseCase } from '../../../application/use-cases/user/RegisterUseCase.js';

const userRepository = new UserRepositoryImpl();
const registerUseCase = new RegisterUseCase(userRepository);

export function UseRegister() {
  return UseMutation(registerUseCase.execute);
}