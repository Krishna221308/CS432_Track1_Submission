import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import './styles/global.css';

function App() {
  const content = useRoutes(routes);
  
  return (
    <div className="app-container">
      {content}
    </div>
  );
}

export default App;
