// application/use-cases/auth/VerifyCodeUseCase.js
export class VerifyCodeUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute = async ({ token }) => {
    if (!token) {
      throw new Error('Token de verificación requerido');
    }

    const response = await this.userRepository.verifyCode(token);

    return {
      data: response.data,
      message: response.message || 'Cuenta verificada correctamente'
    };
  };
}