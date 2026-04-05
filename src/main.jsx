// ─── Entry Point ───────────────────────────────────────────
// This is the first file that runs when the app starts
// It renders the App component inside Redux Provider and React StrictMode

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';

// Mount the app to the #root div in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provider makes Redux store available to all components */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
