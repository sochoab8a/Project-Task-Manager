"use client";

import React from "react";

export default function TaskCard({ task, onDelete, onUpdate, onComplete }) {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex align-items-center">
        <input
          type="checkbox"
          className="form-check-input me-3"
          onChange={() => onComplete(task.id)}
        />
        <div className="flex-grow-1">
          <h5 className="card-title">{task.name_task}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {task.description_task}
          </h6>
          <p className="card-text">{task.priority_task}</p>
        </div>
        <button className="btn btn-primary" onClick={() => onUpdate(task)}>
          Editar
        </button>
        <button
          className="btn btn-danger ms-2"
          onClick={() => onDelete(task.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
