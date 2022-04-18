import React from 'react';
import './index.css';
import App from './App';
import { store } from './features/store';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import './bootstrap.min.css';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
