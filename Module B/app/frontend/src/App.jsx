import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './components/ThemeContext';
import './styles/global.css';
import './styles/toast.css';

function App() {
  const content = useRoutes(routes);
  
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="app-container">
          {content}
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
