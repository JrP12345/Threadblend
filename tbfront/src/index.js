import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SearchProvider } from './Components/SearchContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <SearchProvider>
    <App />
  </SearchProvider>);
reportWebVitals();
