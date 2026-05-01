// application/use-cases/notification/MarkAllAsReadUseCase.js
export class MarkAllAsReadUseCase {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  execute = async () => {
    const response = await this.notificationRepository.markAllAsRead();

    return {
      data: response.data,
      message: response.message || 'Todas las notificaciones marcadas como leídas'
    };
  };
}