'use client';
import { toast } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import axios from '../services/AxiosInstance'; 
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';

const TaskList = ({ initialPage, totalPages }) => {
  const { tasks,setTasks,handleDelete,handleShowModal, handleShowDeleteModal} = useTasks();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  const filteredTasks = tasks.filter(task => {
    if (filterBy === 'name') {
      return task.name_task.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterBy === 'description') {
      return task.description_task.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterBy === 'priority') {
      return task.priority_task.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });
  useEffect(() => {
    const fetchTasks = async (page) => {
      const idUser=localStorage.getItem("id")
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/getAllTask/${idUser}?page=${page}&per_page=${10}`
        );
        const dataResponse = await response.json();
       

        setTasks(dataResponse.data); 
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks(currentPage);
  }, [currentPage, setTasks])

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await axios.delete(`/tasks/deleteTask/${taskId}`); 
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      handleShowMessageComplete();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleShowMessageComplete = () => {
    toast.success('Tarea Completada !'); 
  };

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control"
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="form-select mt-2"
        >
          <option value="name">Name</option>
          <option value="description">Description</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      {filteredTasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onDelete={handleShowDeleteModal} 
          onUpdate={handleShowModal} 
          onComplete={handleComplete} 
        />
      ))}
      {/* Paginación */}
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li className="page-item" key={index + 1}>
              <button
                className="page-link"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TaskList;