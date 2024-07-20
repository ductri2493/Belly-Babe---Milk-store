import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'swiper/css/bundle';
import './index.css';
import { StyledEngineProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
