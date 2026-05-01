// presentation/hooks/auth/useResetPassword.js
import { useCallback } from 'react';
import {UseMutation} from '../common/UseMutation.jsx';
import { UserRepositoryImpl } from "../../../infraestructure/repositories/UserRepositoryImpl.js"
import { ResetPasswordUseCase } from '../../../application/use-cases/user/ResetPasswordUseCase.js';

const userRepository = new UserRepositoryImpl();
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);

export function UseResetPassword(token) {
  const resetPassword = useCallback(({ newPassword, confirmPassword }) => {
   return resetPasswordUseCase.execute({ token , newPassword , confirmPassword })
 } , [token]);

 return UseMutation(resetPassword);
 
}