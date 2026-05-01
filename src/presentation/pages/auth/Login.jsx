// presentation/pages/auth/Login.jsx
import { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UseLogin } from '../../hooks/user/UseLogin.jsx';
import { UseAuthAccess } from '../../hooks/user/UseAuthAccess.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { hasAccess } = UseAuthAccess();
 
  
  const { execute: login, loading : authLoading, error } = UseLogin();


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
  if (hasAccess) {
    navigate('/dashboard');
  }
 }, [hasAccess, navigate]);
 
 if (authLoading) {
  return <p>Cargando...</p>;
 }


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      // Error ya manejado por useMutation      
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">GeoVotation</h1>
          <p className="mt-2 text-gray-600">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {authLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Register link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </Link>
          </p>
        </div>
        {/* Resend email link */}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Creaste una cuenta y no te llegó el correo de verificación?{' '}
            <Link to="/resend-verification" className="text-blue-600 hover:text-blue-500">
              Aquí puedes solicitar uno nuevo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}