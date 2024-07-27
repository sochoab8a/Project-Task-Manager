"use client"
import { toast } from 'react-hot-toast';
import React, { createContext, useState } from 'react';
import axios from '../services/AxiosInstance';
import { useRouter } from 'next/navigation';
import { Toaster } from "react-hot-toast";
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  const login = async (formData) => {
    try {
      const response = await axios.post('/auth/login', formData);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('id', response.data.user_id);
      Cookies.set('idUser', response.data.user_id, { expires: 90 }); 

      router.push('/auth/tasks');
    } catch (error) {
      toast.error('Credenciales incorrectas');

      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('id');
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post('auth/register', formData);
      router.push('/auth/login');
      return response.data;
      
    } catch (error) {
      console.log(error)
      toast.error('Usuario ya existente');

    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post('/tasks/newTask', taskData);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await axios.put(`/tasks/updateTask/${id}`, taskData);
      setTasks(tasks.map(task => (task.id === id ? { ...task, ...taskData } : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/deleteTask/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/login'); 
  };

  return (
    <AuthContext.Provider value={{ user, login, register, handleCreateTask, handleUpdateTask, handleDeleteTask, tasks, setTasks }}>
           <Toaster position="bottom-center" />

      {children}

    </AuthContext.Provider>
  );
};

export default AuthContext;