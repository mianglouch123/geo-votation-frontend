// application/use-cases/notification/GetNotificationsUseCase.js
export class GetNotificationsUseCase {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  execute = async ({ page = 1, limit = 20, read = null }) => {
    const params = { page, limit };
    if (read !== null) params.read = read;

    const response = await this.notificationRepository.getNotifications(params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: response.message
    };
  };
}