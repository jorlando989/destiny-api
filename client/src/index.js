import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reduxThunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './components/App.js';
import reducers from './reducers';


const store = configureStore({
    reducer: reducers, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(reduxThunk), 
    devTools: process.env.NODE_ENV !== 'production'
  });

const root = ReactDOMClient.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);