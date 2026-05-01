// domain/repositories/interfaces/INotificationsRepository.js

export class INotificationRepository {

  async getNotifications(params = {}) { throw new Error('Method not implemented'); }

  async getUnreadCount() { throw new Error('Method not implemented'); }

  async markAsRead(notificationId) { throw new Error('Method not implemented'); }

  async markAllAsRead() { throw new Error('Method not implemented'); }

  async deleteNotification(notificationId) { throw new Error('Method not implemented'); }
}