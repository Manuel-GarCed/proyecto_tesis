import React from 'react';

export default function Dashboard() {
  return (
    // Este div hereda flex-1 del padre para ocupar todo el alto restante
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-1">Hola, aquí tu informe general</h1>
      <iframe
        title="Power BI Dashboard"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/view?r=eyJrIjoiZDU5YTY2YmQtNTA0Zi00YmU2LWE5ZjctMTE5NjM5YWYwOTdlIiwidCI6IjI1MGY3NmU3LTYxMDUtNDJlMy04MmQwLWJlN2M0NjBhZWE1OSIsImMiOjR9"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}