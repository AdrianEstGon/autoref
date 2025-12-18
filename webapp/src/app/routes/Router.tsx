import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
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
import ClubInscripcionesView from '../components/mutua/ClubInscripcionesView';
import FederacionMutuaView from '../components/mutua/FederacionMutuaView';
import CompeticionesView from '../components/federacion/CompeticionesView';
import EquiposView from '../components/federacion/EquiposView';
import CategoriasView from '../components/federacion/CategoriasView';
import TemporadasView from '../components/federacion/TemporadasView';
import ModalidadesView from '../components/federacion/ModalidadesView';
import PersonasView from '../components/federacion/PersonasView';
import ClubsView from '../components/federacion/ClubsView';
import PartidosClubView from '../components/club/PartidosClubView';
import CambiosPartidosView from '../components/federacion/CambiosPartidosView';
import ActaPartidoView from '../components/acta/ActaPartidoView';
import PublicoPortalView from '../components/publico/PublicoPortalView';
import PublicoNoticiasView from '../components/publico/PublicoNoticiasView';
import PublicoNoticiaDetalleView from '../components/publico/PublicoNoticiaDetalleView';
import LicenciasClubView from '../components/club/LicenciasClubView';
import LicenciasFederacionView from '../components/federacion/LicenciasFederacionView';
import MisLiquidacionesView from '../components/liquidaciones/MisLiquidacionesView';
import ComiteLiquidacionesView from '../components/liquidaciones/ComiteLiquidacionesView';
import OrdenesPagoView from '../components/liquidaciones/OrdenesPagoView';
import FacturacionView from '../components/federacion/FacturacionView';

// Componente wrapper para páginas con layout
const WithLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MainLayout>{children}</MainLayout>
);

const RequireRole: React.FC<{ allowedRoles: string[]; children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const role = window.localStorage.getItem('userRole');
  const token = window.localStorage.getItem('token');

  // Si no hay sesión => login
  if (!token || !role) return <Navigate to="/login" replace />;

  // Admin siempre puede
  if (role === 'Admin') return <>{children}</>;

  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Router = () => {
    return (
        <HashRouter>
            <Routes>
                {/* Home público (sin login) */}
                <Route path="/" element={<PublicoPortalView />} />

                {/* Login (sin layout) */}
                <Route path="/login" element={<LoginView />} />

                {/* Alias portal público */}
                <Route path="/publico" element={<PublicoPortalView />} />

                {/* Noticias (público) */}
                <Route path="/noticias" element={<PublicoNoticiasView />} />
                <Route path="/noticias/:slug" element={<PublicoNoticiaDetalleView />} />
                
                {/* Rutas con layout principal */}
                <Route path="/misDesignaciones" element={
                  <RequireRole allowedRoles={['Arbitro', 'ComiteArbitros', 'Federacion']}>
                    <WithLayout><DesignacionesView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/miPerfil" element={
                  <RequireRole allowedRoles={['Arbitro', 'ComiteArbitros', 'Federacion', 'Club', 'Publico']}>
                    <WithLayout><PerfilView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/miDisponibilidad" element={
                  <RequireRole allowedRoles={['Arbitro', 'ComiteArbitros', 'Federacion']}>
                    <WithLayout><DisponibilidadView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/miHistorial" element={
                  <RequireRole allowedRoles={['Arbitro', 'ComiteArbitros', 'Federacion']}>
                    <WithLayout><HistorialDesignacionesView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/liquidaciones" element={
                  <RequireRole allowedRoles={['Arbitro', 'ComiteArbitros', 'Federacion']}>
                    <WithLayout><MisLiquidacionesView /></WithLayout>
                  </RequireRole>
                } />
                
                {/* Rutas de administración */}
                <Route path="/gestionUsuarios/usuariosView" element={
                  <RequireRole allowedRoles={['Admin']}>
                    <WithLayout><UsuariosView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/gestionUsuarios/crearUsuario" element={
                    <RequireRole allowedRoles={['Admin']}>
                      <WithLayout>
                          <CrearUsuario open={true} onClose={() => {}} onSave={() => {}} />
                      </WithLayout>
                    </RequireRole>
                } />
                <Route path="/gestionUsuarios/modificarUsuario" element={
                    <RequireRole allowedRoles={['Admin']}>
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
                    </RequireRole>
                } />
                
                <Route path="/gestionPartidos/partidosView" element={
                  <RequireRole allowedRoles={['Federacion', 'ComiteArbitros']}>
                    <WithLayout><PartidosView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/gestionPartidos/crearPartido" element={
                    <RequireRole allowedRoles={['Federacion', 'ComiteArbitros']}>
                      <WithLayout>
                          <CrearPartido open={true} onClose={() => {}} onSave={() => {}} />
                      </WithLayout>
                    </RequireRole>
                } />
                <Route path="/gestionPartidos/modificarPartido" element={
                    <RequireRole allowedRoles={['Federacion', 'ComiteArbitros']}>
                      <WithLayout>
                          <ModificarPartido open={true} onClose={() => { } } onUpdate={() => { } } />
                      </WithLayout>
                    </RequireRole>
                } />
                
                <Route path="/detallesPartido/:id" element={
                  <RequireRole allowedRoles={['Arbitro', 'ComiteArbitros', 'Federacion', 'Club', 'Publico']}>
                    <WithLayout><DetallePartido /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/acta/:id" element={
                  <RequireRole allowedRoles={['Arbitro', 'ComiteArbitros', 'Federacion']}> 
                    <WithLayout><ActaPartidoView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/gestionDesignaciones/panelDesignaciones" element={
                  <RequireRole allowedRoles={['ComiteArbitros']}>
                    <WithLayout><PanelDesignacionesView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/comite/liquidaciones" element={
                  <RequireRole allowedRoles={['ComiteArbitros']}>
                    <WithLayout><ComiteLiquidacionesView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/comite/ordenes-pago" element={
                  <RequireRole allowedRoles={['ComiteArbitros']}>
                    <WithLayout><OrdenesPagoView /></WithLayout>
                  </RequireRole>
                } />

                {/* Rutas Club */}
                <Route path="/club/partidos" element={
                  <RequireRole allowedRoles={['Club']}>
                    <WithLayout><PartidosClubView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/club/licencias" element={
                  <RequireRole allowedRoles={['Club']}>
                    <WithLayout><LicenciasClubView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/club/inscripciones" element={
                  <RequireRole allowedRoles={['Club']}>
                    <WithLayout><ClubInscripcionesView /></WithLayout>
                  </RequireRole>
                } />

                {/* Rutas Federación */}
                <Route path="/federacion/mutua" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><FederacionMutuaView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/clubs" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><ClubsView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/personas" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><PersonasView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/competiciones" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><CompeticionesView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/temporadas" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><TemporadasView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/modalidades" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><ModalidadesView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/equipos" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><EquiposView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/categorias" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><CategoriasView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/cambios-partidos" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><CambiosPartidosView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/licencias" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><LicenciasFederacionView /></WithLayout>
                  </RequireRole>
                } />
                <Route path="/federacion/facturacion" element={
                  <RequireRole allowedRoles={['Federacion']}>
                    <WithLayout><FacturacionView /></WithLayout>
                  </RequireRole>
                } />
            </Routes>
        </HashRouter>
    );
};

export default Router;
