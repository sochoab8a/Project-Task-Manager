"use client";
import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import axios from "../services/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Form, Button } from "react-bootstrap";

export default function CreateTaskForm({ show, handleClose, taskToEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const { setTasks } = useTasks();

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name_task);
      setDescription(taskToEdit.description_task);
      setPriority(taskToEdit.priority_task);
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const idUser = localStorage.getItem("id");
    const emailUser = localStorage.getItem("email");

    const formDataTask = new FormData();
    formDataTask.append("name_task", name);
    formDataTask.append("description_task", description);
    formDataTask.append("priority_task", priority);
    formDataTask.append("user_id", idUser);
    formDataTask.append("email_user", emailUser);

    try {
      let response;
      if (taskToEdit) {
        response = await axios.put(
          `/tasks/updateTask/${taskToEdit.id}`,
          formDataTask
        );
        const data = response.data.task;
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === data.id ? data : task))
        );
      } else {
        // Create new task
        response = await axios.post("/tasks/newTask", formDataTask);
        const data = response.data.user;
        setTasks((prevTasks) => [...prevTasks, data]);
      }

      handleShowMessageComplete();
      setName("");
      setDescription("");
      setPriority("");
      handleClose();
    } catch (error) {
      console.error("Error processing task:", error);
    }
  };

  const handleShowMessageComplete = () => {
    toast.success(taskToEdit ? "Tarea actualizada!" : "Nueva tarea agregada!");
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {taskToEdit ? "Actualizar Tarea" : "Crear Tarea"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="priority">
            <Form.Label>Prioridad</Form.Label>
            <Form.Control
              as="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="">Selecciona una prioridad</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            {taskToEdit ? "Actualizar Tarea" : "Crear Tarea"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
