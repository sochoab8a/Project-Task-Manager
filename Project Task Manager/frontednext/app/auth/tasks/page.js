import React from 'react';
import Cookies from 'js-cookie';
import TaskList from '../../../components/TaskList';
import { TaskProvider } from '../../../context/TaskContext';
import CreateTaskForm from '../../../components/CreateTaskForm';
import AddTask from '../../../components/AddTask';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoutButton from '../../../components/LogoutButton';
const idUser = Cookies.get('idUser');
async function fetchTasks(page = 1, perPage = 10) {

  console.log(idUser);
  
  const res = await fetch(` /api/tasks/getAllTask/${idUser}?page=${page}&per_page=${perPage}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const data = await res.json();
  return data;
}

export default async function TasksPage() {
  const perPage = 10; 
  const initialPage = 1; // Página inicial

  let tasks = [];
  let totalPages = 1;

  try {
    const data = await fetchTasks(initialPage, perPage);
    tasks = data.data;
    totalPages = data.last_page;
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }

  return (
    <TaskProvider initialTasks={tasks}>
      <div className="container mt-2">
      <LogoutButton></LogoutButton>
        <AddTask />
        <h1>Task List</h1>
        <TaskList initialPage={initialPage} totalPages={totalPages} />
        <CreateTaskForm />
      </div>
    </TaskProvider>
  );
}