// presentation/hooks/notification/useUnreadCount.js
import { useState, useEffect } from 'react';
import { NotificationRepositoryImpl } from '../../../infraestructure/repositories/NotificationRepositoryImpl.js';
import { GetUnreadCountUseCase } from '../../../application/use-cases/notification/GetUnreadCountUseCase.js';

const notificationRepository = new NotificationRepositoryImpl();
const getUnreadCountUseCase = new GetUnreadCountUseCase(notificationRepository);

export function UseUnreadCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    setLoading(true);
    try {
      const response = await getUnreadCountUseCase.execute();
      setCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return { count, loading, refetch: fetchCount };
}