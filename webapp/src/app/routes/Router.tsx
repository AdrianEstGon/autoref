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
import MainLayout from '../components/layout/MainLayout';

// Componente wrapper para páginas con layout
const WithLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MainLayout>{children}</MainLayout>
);

const Router = () => {
    return (
        <HashRouter>
            <Routes>
                {/* Ruta pública - Login sin layout */}
                <Route path="/" element={<LoginView />} />
                
                {/* Rutas con layout principal */}
                <Route path="/misDesignaciones" element={<WithLayout><DesignacionesView /></WithLayout>} />
                <Route path="/miPerfil" element={<WithLayout><PerfilView /></WithLayout>} /> 
                <Route path="/miDisponibilidad" element={<WithLayout><DisponibilidadView /></WithLayout>} />
                <Route path="/miHistorial" element={<WithLayout><HistorialDesignacionesView /></WithLayout>} />
                
                {/* Rutas de administración */}
                <Route path="/gestionUsuarios/usuariosView" element={<WithLayout><UsuariosView /></WithLayout>} />
                <Route path="/gestionUsuarios/crearUsuario" element={
                    <WithLayout>
                        <CrearUsuario open={true} onClose={() => {}} onSave={() => {}} />
                    </WithLayout>
                } />
                <Route path="/gestionUsuarios/modificarUsuario" element={
                    <WithLayout>
                        <ModificarUsuario
                            open={true}
                            onClose={() => { }}
                            onUpdate={() => { }}
                            usuario={{
                                id: "",
                                nombre: "",
                                primerApellido: "",
                                segundoApellido: "",
                                fechaNacimiento: "",
                                nivel: "",
                                clubVinculadoId: "",
                                licencia: "",
                                email: "",
                                username: "",
                                password: "",
                                esAdmin: false,
                                direccion: "",
                                pais: "",
                                region: "",
                                ciudad: "",
                                codigoPostal: ""
                            }}
                        />
                    </WithLayout>
                } />
                
                <Route path="/gestionPartidos/partidosView" element={<WithLayout><PartidosView /></WithLayout>} />
                <Route path="/gestionPartidos/crearPartido" element={
                    <WithLayout>
                        <CrearPartido open={true} onClose={() => {}} onSave={() => {}} />
                    </WithLayout>
                } />
                <Route path="/gestionPartidos/modificarPartido" element={
                    <WithLayout>
                        <ModificarPartido open={true} onClose={() => { } } onUpdate={() => { } } />
                    </WithLayout>
                } />
                
                <Route path="/detallesPartido/:id" element={<WithLayout><DetallePartido /></WithLayout>} />
                <Route path="/gestionDesignaciones/panelDesignaciones" element={<WithLayout><PanelDesignacionesView /></WithLayout>} />
            </Routes>
        </HashRouter>
    );
};

export default Router;
