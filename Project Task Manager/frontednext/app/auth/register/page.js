'use client';

import { useContext, useState } from 'react';
import AuthContext from '../../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation'; 
import '../../style/style.module.css'; 
import { toast } from 'react-hot-toast';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
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
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);

      const response = await register(data);
      
      if (response.error) {
        toast.error(response.error.message || 'Error en el registro');
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/auth/login'); // Redirige a la página de login
  };

  return (
    <div className="background-animation d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: '25rem' }}>
        <h1 className="card-title text-center mb-4">Registro</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control rounded"
              placeholder="Nombre"
              required
            />
          </div>
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
              'Registro'
            )}
          </button>
        </form>
        <div className="text-center mt-3">
          <button onClick={handleLoginClick} className="btn btn-secondary w-100">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;