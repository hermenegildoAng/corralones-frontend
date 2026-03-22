import { createRouter, createWebHistory } from 'vue-router'
// vistas
import Login from './views/Login.vue'
import Inventario from './views/Inventario.vue'
import GestionSoliAdmin from './views/GestionSoliAdmin.vue'
import DashboardGlobal from './views/DashboardGlobal.vue'
import UsuariosGestion from './views/UsuariosGestion.vue'
import DashAdmin from './views/DashAdmin.vue'
import DashOpeView from './views/DashOpeView.vue'
import SolicitudEdicion from './views/SolicitudEdicion.vue'
import Registrar from './views/Registrar.vue'
import Detalles from './views/Detalles.vue'
import Bitacora from './views/Bitacora.vue'
import SolicitudesOpe from './views/SolicitudesOpe.vue'
import NuevaInspeccion from './views/NuevaInspeccion.vue'
import GestionInspecciones from './views/GestionInspecciones.vue'
import Detallesauto from './views/Detallesauto.vue'
import MisSolicitudes from './views/MisSolicitudes.vue'
import MisInspecciones from './views/MisInspecciones.vue'
import GestionDepositos from './views/GestionDepositos.vue'
import Editperfil from './views/Editperfil.vue'
// nuevas del archivo 2
import DetallesUser from './views/DetallesUser.vue'
import DetallesDeposito from './views/DetallesDeposito.vue'

const routes = [
  { path: '/', component: Login, meta: { hideSidebar: true } },

  // 🔹 INVENTARIO
  { path: '/inventario', component: Inventario, meta: { requiresAuth: true, roles: ['ADMIN', 'OPERADOR', 'SUPER'] } },

  // 🔹 DASHBOARDS
  { path: '/dashopera', component: DashOpeView, meta: { requiresAuth: true, roles: ['OPERADOR'] } },
  { path: '/dashadmin', component: DashAdmin, meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/dashboard-global', component: DashboardGlobal, meta: { requiresAuth: true, roles: ['SUPER'] } },

  // 🔹 REGISTROS / VEHÍCULOS
  { path: '/registrar', component: Registrar, meta: { requiresAuth: true, roles: ['OPERADOR'] } },
  { path: '/detalles', component: Detalles, meta: { requiresAuth: true, roles: ['ADMIN', 'OPERADOR', 'SUPER'] } },
  { path: '/Detallesauto/:id', component: Detallesauto, meta: { requiresAuth: true, roles: ['ADMIN', 'OPERADOR', 'SUPER'] } },

  // 🔹 SOLICITUDES
  { path: '/GestionSoli', component: GestionSoliAdmin, meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/solicitudes-operador', component: SolicitudesOpe, meta: { requiresAuth: true, roles: ['OPERADOR'] } },
  { path: '/MisSolicitudes', component: MisSolicitudes, meta: { requiresAuth: true, roles: ['OPERADOR'] } },
  { path: '/edicionregistro', component: SolicitudEdicion, meta: { requiresAuth: true, roles: ['OPERADOR'] } },

  // 🔹 INSPECCIONES
  { path: '/nuevaInspeccion', component: NuevaInspeccion, meta: { requiresAuth: true, roles: ['OPERADOR'] } },
  { path: '/GestionInspecciones', component: GestionInspecciones, meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/MisInspecciones', component: MisInspecciones, meta: { requiresAuth: true, roles: ['OPERADOR'] } },

  // 🔹 DEPÓSITOS
  { path: '/GestionDepositos', component: GestionDepositos, meta: { requiresAuth: true, roles: ['SUPER'] } },
  { path: '/deposito/:id?', name: 'DetallesDeposito', component: DetallesDeposito, meta: { requiresAuth: true, roles: ['SUPER'] } },

  // 🔹 USUARIOS
  { path: '/usuarios', name: 'UsuariosGestion', component: UsuariosGestion, meta: { requiresAuth: true, roles: ['SUPER', 'ADMIN'] } },
  { path: '/usuario/:id', name: 'DetallesUser', component: DetallesUser, meta: { requiresAuth: true, roles: ['ADMIN', 'SUPER'] } },

  // 🔹 BITÁCORA
  { path: '/bitacora', component: Bitacora, meta: { requiresAuth: true, roles: ['ADMIN', 'OPERADOR','SUPER'] } },

  // 🔹 PERFIL
  { path: '/Editperfil', component: Editperfil, meta: { requiresAuth: true, roles: ['ADMIN', 'OPERADOR', 'SUPER'] } },

  // 🔹 PÚBLICAS
  { path: '/forgot-password', component: () => import('./views/ForgotPassword.vue'), meta: { hideSidebar: true } },
  { path: '/reset-password/:uid/:token', component: () => import('./views/ResetPassword.vue'), meta: { hideSidebar: true } },
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('access_token')
  const userRaw = sessionStorage.getItem('user_data')
  const userData = userRaw ? JSON.parse(userRaw) : null

  // --- NUEVA VALIDACIÓN DE SUSPENSIÓN ---
  // Si el usuario está logueado pero su estatus es SUSPENDIDO
  if (userData && userData.estatus_user === 'SUSPENDIDO' && to.path !== '/') {
    // Limpiamos la sesión para que no pueda reintentar sin loguearse de nuevo
    sessionStorage.clear() 
    
    // Lo mandamos al login con un mensaje (opcional, usando query params)
    return next('/?error=suspended')
  }

  // 1. Si no hay token y la ruta lo requiere
  if (to.meta.requiresAuth && !token) {
    return next('/')
  }

  // 2. Si ya hay token e intenta ir al Login
  if (to.path === '/' && token && userData) {
    const role = userData.rol.toUpperCase()
    if (role === 'SUPER') return next('/dashboard-global')
    if (role === 'ADMIN') return next('/dashadmin')
    return next('/dashopera')
  }

  // 3. Verificación de Roles
  if (to.meta.roles && userData && userData.rol) {
    const userRoleNormalized = userData.rol.toUpperCase();
    
    if (!to.meta.roles.includes(userRoleNormalized)) {
      console.warn(`Acceso denegado: El rol ${userRoleNormalized} no tiene permiso`);
      
      if (userRoleNormalized === 'SUPER') return next('/dashboard-global');
      if (userRoleNormalized === 'ADMIN') return next('/dashadmin');
      return next('/dashopera');
    }
  }

  next()
})
export default router