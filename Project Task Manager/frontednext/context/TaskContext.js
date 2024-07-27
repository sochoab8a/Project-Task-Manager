"use client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../services/AxiosInstance";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";


const TaskContext = createContext();

export const useTasks = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children, initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    router.push("/auth/login");

  };

  const handleShowMessageUpdate = () => {
    toast.success("Actualizado con éxito!"); 
  };

  const handleDelete = async () => {
    if (taskToDelete) {
      console.log(taskToDelete);
      try {
        const response = await axios.delete(
          `/tasks/deleteTask/${taskToDelete}`
        );
        setTasks(tasks.filter((task) => task.id !== taskToDelete));
        setShowDeleteModal(false);
        toast.success("Tarea eliminada con éxito!");
      } catch (error) {
        console.error("Error delete task:", error);
        toast.error("Error al eliminar la tarea.");
      }
    }
  };

  const handleUpdate = async (updatedTask) => {
    try {
      const email= localStorage.getItem("email");
      updatedTask["email_user"] = email;
      const response = await axios.put(
        `/tasks/updateTask/${currentTask.id}`,
        updatedTask
      );
      const updatedData = response.data.task;
      setTasks(
        tasks.map((task) => (task.id === updatedData.id ? updatedData : task))
      );
      handleShowMessageUpdate();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.description_task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TaskContext.Provider
    
      value={{
        tasks: filteredTasks,
        handleDelete,
        setTasks,
        handleShowModal,
        handleShowDeleteModal,
        setSearchTerm,
        logout,
      }}
      
    >
      <Toaster position="bottom-center" />

      {children}


      {/* Modal para Crear/Actualizar Tarea */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentTask ? "Actualizar Tarea" : "Crear Tarea"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTask && (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const updatedTask = {
                  id: currentTask.id,
                  name_task: form.name.value,
                  description_task: form.description.value,
                  priority_task: form.priority.value,
                };
                handleUpdate(updatedTask);
              }}
            >
              <Form.Group controlId="formTaskName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={currentTask.name_task}
                  name="name"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTaskDescription">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={currentTask.description_task}
                  name="description"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTaskPriority">
                <Form.Label>Prioridad</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={currentTask.priority_task}
                  name="priority"
                  required
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                Actualizar Tarea
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de Confirmación para Eliminar Tarea */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro de que desea eliminar la tarea "
            {taskToDelete?.name_task}"?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </TaskContext.Provider>
  );
};
