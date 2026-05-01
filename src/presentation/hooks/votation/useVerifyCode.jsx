// presentation/hooks/auth/UseVerifyCode.js
import { useState, useEffect, useCallback } from 'react';
import { UserRepositoryImpl } from '../../../infraestructure/repositories/UserRepositoryImpl.js';
import { VerifyCodeUseCase } from '../../../application/use-cases/access-verificator/VerifyCodeUseCase.js';

const userRepository = new UserRepositoryImpl();
const verifyCodeUseCase = new VerifyCodeUseCase(userRepository);

export function UseVerifyCode(token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyCode = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError('Token no proporcionado');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await verifyCodeUseCase.execute({ token });
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    verifyCode();
  }, [verifyCode]);

  const refetch = () => verifyCode();

  return { data, loading, error, refetch };
}