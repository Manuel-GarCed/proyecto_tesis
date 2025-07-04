import React from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* Overlay que cubre todo */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-50"
        onClick={onClose}
      />

      {/* Caja central */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white rounded-lg shadow-lg p-6 w-95"
          onClick={e => e.stopPropagation() /* evita que cerrar al clickar dentro */}
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}