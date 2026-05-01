// application/use-cases/user/GetDashboardUseCase.js
export class GetDashboardUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute = async () => {
    const response = await this.userRepository.getDashboard();

    return {
      data: response.data,
      message: response.message
    };
  };
}