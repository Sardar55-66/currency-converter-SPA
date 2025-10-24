import React from 'react';
import ReactDOM from 'react-dom/client';
import { RatesProvider } from './context/RatesProvider';
import './styles/main.scss';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RatesProvider>
      <App />
    </RatesProvider>
  </React.StrictMode>
);
