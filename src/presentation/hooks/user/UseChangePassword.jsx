// presentation/hooks/auth/useChangePassword.js
import {UseMutation} from '../common/UseMutation.jsx';
import { useCallback } from 'react';
import { UserRepositoryImpl } from "../../../infraestructure/repositories/UserRepositoryImpl.js"
import { ChangePasswordUseCase } from '../../../application/use-cases/user/ChangePasswordUseCase.js';

const userRepository = new UserRepositoryImpl();
const changePasswordUseCase = new ChangePasswordUseCase(userRepository);

export function UseChangePassword() {

   const changePassword = useCallback(async ({ currentPassword , newPassword, confirmPassword }) => {
   const inputData = { currentPassword , newPassword , confirmPassword }
   return changePasswordUseCase.execute(inputData)
  } , [])
  return UseMutation(changePassword);
}
