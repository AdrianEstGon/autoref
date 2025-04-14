'use client';
import * as React from 'react';
import { useState } from 'react';
import './page.css';
import AppRouter from './routes/Router';
import { ToastContainer } from 'react-toastify';
import GoogleMapsWrapper from './utils/GoogleMapsAPI';

function App() {
  return (
    <GoogleMapsWrapper>
      <div className="App" background-color="#F5F5DC">
        <ToastContainer />
        <AppRouter />
      </div>
    </GoogleMapsWrapper>
  );
}

export default App;

