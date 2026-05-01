export class LogoutUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  execute = async ({ refreshToken }) => {
    if(!refreshToken) {
	 throw new Error('Refresh token is required for logout');
	}
    return await this.userRepository.logout(refreshToken);
  }

  

}