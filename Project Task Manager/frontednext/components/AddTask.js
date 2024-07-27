"use client";
import React from "react";
import { useState } from "react";
import CreateTaskForm from "./CreateTaskForm";
import styles from "../app/style/style.module.css";

export default function AddTask() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  return (
    <div className={styles.createTask}>
      <button className={styles.addButton} onClick={handleShowModal}>
        +
      </button>
      <span>Añadir una tarea</span>
      <CreateTaskForm
        show={showModal}
        handleClose={handleCloseModal}
      ></CreateTaskForm>
    </div>
  );
}
