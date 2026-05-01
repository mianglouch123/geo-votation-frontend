// application/use-cases/notification/GetUnreadCountUseCase.js
export class GetUnreadCountUseCase {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  execute = async () => {
    const response = await this.notificationRepository.getUnreadCount();
    return {
      data: response.data,
      message: response.message
    };
  };
}