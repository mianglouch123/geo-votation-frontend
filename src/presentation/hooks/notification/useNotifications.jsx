// presentation/hooks/notification/useNotifications.js
import { useCallback } from 'react';
import { UsePagination } from '../common/UsePagination.jsx';

import { NotificationRepositoryImpl } from '../../../infraestructure/repositories/NotificationRepositoryImpl.js';
import { GetNotificationsUseCase } from '../../../application/use-cases/notification/GetNotificationsUseCase.js';

const notificationRepository = new NotificationRepositoryImpl();
const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);

export function UseNotifications(read = null) {
  const fetchNotifications = useCallback(
    async ({ page, limit }) => {
      return await getNotificationsUseCase.execute({ page, limit, read });
    },
    [read]
  );

  return UsePagination(fetchNotifications);
}