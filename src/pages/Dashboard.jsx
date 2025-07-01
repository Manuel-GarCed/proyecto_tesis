import React from 'react';

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full p-1">
      {/* 1. Header ocupa lo que necesite */}
      {/*<h1 className="text-3xl font-bold mb-4">Hola, aquí tu informe general</h1>*/}
      {/* 2. Contenedor del iframe que crece */}
      <div className="flex-1 min-h-0">
        <iframe
          title="Power BI Dashboard"
          src="https://app.powerbi.com/view?r=eyJrIjoiZDU5YTY2YmQtNTA0Zi00YmU2LWE5ZjctMTE5NjM5YWYwOTdlIiwidCI6IjI1MGY3NmU3LTYxMDUtNDJlMy04MmQwLWJlN2M0NjBhZWE1OSIsImMiOjR9"
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}