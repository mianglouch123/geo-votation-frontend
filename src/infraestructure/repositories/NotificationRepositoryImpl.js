// infrastructure/repositories/NotificationRepositoryImpl.js
import { INotificationRepository } from '../../domain/repositories/interfaces/INotificationRepository.js';
import { httpClient } from '../http/client/client.js';

export class NotificationRepositoryImpl extends INotificationRepository {

  constructor() {
   super();
   this.baseUrl = `/user/notifications`
  }

  async getNotifications(params = {}) {
    const response = await httpClient.get(`${this.baseUrl}`, { params });
    return response.data;
  }

  async getUnreadCount() {
    const response = await httpClient.get(`/user/notifications-unread`);
    return response.data;
  }

  async markAsRead(notificationId) {
    const response = await httpClient.put(`user/notification/${notificationId}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await httpClient.put(`${this.baseUrl}/read-all`);
    return response.data;
  }

  async deleteNotification(notificationId) {
    const response = await httpClient.delete(`/user/notification/${notificationId}`);
    return response.data;
  }
}