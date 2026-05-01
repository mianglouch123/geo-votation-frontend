// presentation/hooks/user/UseDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { UserRepositoryImpl } from '../../../infraestructure/repositories/UserRepositoryImpl.js';
import { GetDashboardUseCase } from '../../../application/use-cases/user/GetDashboardUseCase.js';

const userRepository = new UserRepositoryImpl();
const getDashboardUseCase = new GetDashboardUseCase(userRepository);

export function UseDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboardUseCase.execute();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const refetch = () => loadDashboard();


  return { data, loading, error, refetch };
}