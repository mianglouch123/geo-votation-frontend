// presentation/pages/auth/VerifyCode.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { httpClient } from '../../../infraestructure/http/client/client.js';

export default function VerifyCode() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if(!token) {
     return;
    }

    const verifyCode = async () => {
   
      try {
        // ✅ GET request (backend cambiado a GET)
        const response = await httpClient.get(`/verify-code/${token}`);
        
        if (response.data.ok) {
          setSuccess(true);
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(response.data.message || 'Error al verificar la cuenta');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error al verificar la cuenta');
      } finally {
        setLoading(false);
      }
    };

    verifyCode();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando tu cuenta...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cuenta verificada!</h2>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido verificada exitosamente.
          </p>
          <p className="text-sm text-gray-500">
            Serás redirigido al login en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de verificación</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/resend-verification')}
          className="text-blue-600 hover:text-blue-500"
        >
          Reenviar código de verificación
        </button>
      </div>
    </div>
  );
}