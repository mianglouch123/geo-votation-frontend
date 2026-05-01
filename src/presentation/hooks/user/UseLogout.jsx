// presentation/hooks/auth/useLogout.js
import {UseMutation} from '../common/UseMutation.jsx';
import { LogoutUseCase } from '../../../application/use-cases/user/LogoutUseCase.js';
import { UserRepositoryImpl } from "../../../infraestructure/repositories/UserRepositoryImpl.js"
import { tokenHelper } from "../../../infraestructure/storage/helpers/token.helpers.js";

const userRepository = new UserRepositoryImpl();
const logoutUseCase = new LogoutUseCase(userRepository);

export function UseLogout() {
  return UseMutation(
    () => {
      const refreshToken = tokenHelper.getRefreshToken();
      return logoutUseCase.execute({ refreshToken });
    },
    {
      onSuccess: () => {
        tokenHelper.removeTokens();
      }
    }
  );
}