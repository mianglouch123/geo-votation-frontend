// application/use-cases/user/GetProfileUseCase.js
import { User } from '../../../domain/entities/user/User.js';

export class GetProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute = async () => {
    const response = await this.userRepository.getProfile();
    const user = response?.data?.user;
    const stats = response?.data?.stats;
    return {
     user,
     stats
    }
  };
}