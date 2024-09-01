import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App.jsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <CssBaseline />
      <App />
    </Router>
  </StrictMode>,
)
