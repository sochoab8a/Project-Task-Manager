'use client';
import { toast } from 'react-hot-toast';

import { useContext, useState } from 'react';
import AuthContext from '../../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation'; 
import '../../style/style.module.css'; 

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem("email", formData.email);
    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);

      await login(data);
     
    } catch (error) {
      toast.error('Credenciales incorrectas. Inténtalo de nuevo.');

    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    router.push('/auth/register'); // Redirige a la página de registro
  };

  return (
    <div className="background-animation d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: '20rem' }}>
        <h2 className="card-title text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control rounded"
              placeholder="Correo"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control rounded"
              placeholder="Contraseña"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="text-center mt-3">
          <button onClick={handleRegisterClick} className="btn btn-secondary w-100">
            Registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;