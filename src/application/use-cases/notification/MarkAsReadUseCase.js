// application/use-cases/notification/MarkAsReadUseCase.js
export class MarkAsReadUseCase {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  execute = async ({ notificationId }) => {
    if (!notificationId) throw new Error('ID de notificación requerido');

    const response = await this.notificationRepository.markAsRead(notificationId);

    return {
      success: true,
      data: response.data,
      message: response.message || 'Notificación marcada como leída'
    };
  };
}