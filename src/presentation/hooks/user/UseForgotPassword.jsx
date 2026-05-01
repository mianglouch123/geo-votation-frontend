// presentation/hooks/auth/useForgotPassword.js
import { useCallback } from 'react';
import {UseMutation} from '../common/UseMutation.jsx';
import { UserRepositoryImpl } from "../../../infraestructure/repositories/UserRepositoryImpl.js"
import { ForgotPasswordUseCase } from '../../../application/use-cases/user/ForgotPasswordUseCase.js';

const userRepository = new UserRepositoryImpl();
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository);

export function UseForgotPassword() {
  const forgotPassword = useCallback(async ({ email }) => {
   return forgotPasswordUseCase.execute({ email });
} , [])
  return UseMutation(forgotPassword);
}