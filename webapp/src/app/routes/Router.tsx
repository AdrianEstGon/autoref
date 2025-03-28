import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import LoginView from '../components/login/LoginView';
import DesignacionesView from '../components/designaciones/DesignacionesView';
import PerfilView from '../components/perfil/PerfilView';
import UsuariosView from '../components/gestion_usuarios/UsuariosView';
import CrearUsuario from '../components/gestion_usuarios/CrearUsuario';
import ModificarUsuario from '../components/gestion_usuarios/ModificarUsuario';
import PartidosView from '../components/gestion_partidos/PartidosView';
import CrearPartido from '../components/gestion_partidos/CrearPartido';
import ModificarPartido from '../components/gestion_partidos/ModificarPartido';
import DisponibilidadView from '../components/disponibilidad/DisponibilidadView';
import PanelDesignacionesView from '../components/gestion_designaciones/PanelDesignacionesView';
import DetallePartido from "../components/gestion_partidos/DetallesPartidoView";
import HistorialDesignacionesView from '../components/designaciones/HistorialDesignacionesView';
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
                <Route path="/misDesignaciones" element={<DesignacionesView />} />
                <Route path="/miPerfil" element={<PerfilView />} /> 
                <Route path="/miDisponibilidad" element={<DisponibilidadView />} />
                <Route path="/miHistorial" element={<HistorialDesignacionesView />} />
                <Route path="/gestionUsuarios/usuariosView" element={<UsuariosView />} />
                <Route path="/gestionUsuarios/crearUsuario" element={<CrearUsuario open={true} onClose={() => {}} onSave={() => {}} />} />
                <Route path="/gestionUsuarios/modificarUsuario" element={<ModificarUsuario open={true} onClose={() => { } } onUpdate={() => { } } usuario={undefined}  />} />
                <Route path="/gestionPartidos/partidosView" element={<PartidosView />} />
                <Route path="/gestionPartidos/crearPartido" element={<CrearPartido open={true} onClose={() => {}} onSave={() => {}} />} />
                <Route path="/gestionPartidos/modificarPartido" element={<ModificarPartido open={true} onClose={() => { } } onUpdate={() => { } } />} />
                <Route path="/detallesPartido/:id" element={<DetallePartido />} />
                <Route path="/gestionDesignaciones/panelDesignaciones" element={<PanelDesignacionesView />} />

                {/* Rutas privadas */}

                {/* Rutas de las diferentes vistas de usuario */}
        
            </Routes>
        </HashRouter>
    );
};

export default Router;
