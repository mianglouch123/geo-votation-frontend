// presentation/hooks/auth/useProfile.js
import { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { UserRepositoryImpl } from "../../../infraestructure/repositories/UserRepositoryImpl.js"
import { GetProfileUseCase } from '../../../application/use-cases/user/GetProfileUseCase.js';

const userRepository = new UserRepositoryImpl();
const getProfileUseCase = new GetProfileUseCase(userRepository);

export function UseUserProfile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async() => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProfileUseCase.execute();
      setUser(response.user);
      setStats(response.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
 } , [])

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { user, stats, loading, error, refetch: loadProfile };
}