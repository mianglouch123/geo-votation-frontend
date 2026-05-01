import { UserRepositoryImpl } from "../../../infraestructure/repositories/UserRepositoryImpl.js"
import { LoginUseCase } from "../../../application/use-cases/user/LoginUseCase.js";
import {UseMutation} from '../common/UseMutation.jsx';
import { tokenHelper } from "../../../infraestructure/storage/helpers/token.helpers.js";
const userRepository = new UserRepositoryImpl();
const loginUseCase = new LoginUseCase(userRepository);

export function UseLogin() {
  return UseMutation(loginUseCase.execute, {
    onSuccess: (response) => {
      
      if (response.accessToken) {
        tokenHelper.setTokens(response.accessToken, response.refreshToken);
      }
    }
  });
};



