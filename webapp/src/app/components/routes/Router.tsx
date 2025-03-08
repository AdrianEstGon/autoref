import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import LoginView from '../login/LoginView';
/*import MisPartidos from '../partidos/MisPartidos';  // Tu componente para la vista de partidos
import Disponibilidad from '../disponibilidad/Disponibilidad';  // Componente para la vista de disponibilidad
import PerfilUsuario from '../usuario/PerfilUsuario';  // Componente para el perfil del usuario
import DesignacionesPanel from '../designaciones/DesignacionesPanel';  // Panel de designaciones
import PartidosPanel from '../partidos/PartidosPanel';  // Panel de partidos
import UsuariosPanel from '../usuarios/UsuariosPanel';  // Panel de usuarios
import ErrorConnection from '../error/ErrorConnection';
import ErrorNotFound from '../error/ErrorNotFound';
import Home from '../home/Home';

import RegisterView from '../register/RegisterView';
import ConfigView from '../user/configuration/ConfigView';
import FeedUser from '../user/feed/FeedUser'; */

const Router = () => {
    return (
        <HashRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<LoginView />} />

                {/* Rutas de las diferentes vistas de usuario */}
        
            </Routes>
        </HashRouter>
    );
};

export default Router;
