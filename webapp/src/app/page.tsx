'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import './page.css';
import AppRouter from './routes/Router';
import { ToastContainer } from 'react-toastify';
import API_URL from '@/config';
import GoogleMapsWrapper from './utils/GoogleMapsAPI';

// Definir la estructura de los datos del usuario
interface UserLogged {
  userId: string;
  timestamp: string;
  user: any; // Aquí puedes definir la estructura completa de tu usuario
}

function App() {
  const [userLogged, setUserLogged] = useState<UserLogged | null>(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('userLogged');
    setUserLogged(storedUser ? JSON.parse(storedUser) : null);
    
    if (storedUser) {
      const infoUser = JSON.parse(storedUser);
      hasSessionExpired(infoUser);
    }
  }, []);

  useEffect(() => {
    const updateUser = (user: any) => {
      const infoUser = JSON.parse(window.localStorage.getItem('userLogged')!);
      infoUser.user = user;
      window.localStorage.setItem('userLogged', JSON.stringify(infoUser));
    };
  }, [userLogged]);

  const hasSessionExpired = (dataUser: UserLogged) => {
    const currentTime = new Date().getTime();
    const userTime = new Date(dataUser.timestamp).getTime();
    const twoHour = 60 * 60 * 1000 * 2;
    if ((currentTime - userTime) >= twoHour) {
      window.localStorage.removeItem('userLogged');
      setUserLogged(null);
      window.location.href = '/';  // Redirige si la sesión ha expirado
    }
    return (currentTime - userTime) >= twoHour;
  }

  return (
    <GoogleMapsWrapper>
      <div className="App" background-color="#F5F5DC">
        <ToastContainer />
        <AppRouter />
        {userLogged && hasSessionExpired(userLogged)}
      </div>
    </GoogleMapsWrapper>
  );
}

export default App;
