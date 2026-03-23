<template>
  <button 
    @click="toggleSidebar"
    class="fixed top-4 left-4 z-50 p-2 bg-white text-primario rounded-lg md:hidden shadow-lg"
  >
    <span v-if="!isOpen">☰</span>
    <span v-else>✕</span>
  </button>

  <div 
    v-if="isOpen" 
    @click="toggleSidebar" 
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
  ></div>

  <aside 
    :class="[
      'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 transition-transform duration-300 w-64 flex flex-col',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <div class="p-6 border-b border-gray-100  text-white">
      <img src="/img/SMYT_trans.png" alt="GOB" class="">
    </div>

    <nav class="flex-1 p-4 space-y-2 mt-4">
      <router-link 
        v-for="link in menuLinks" 
        :key="link.path"
        :to="link.path" 
        class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors" 
        active-class="bg-primario text-white"
      >
        <component :is="link.icon" class="w-5 h-5 mr-3"/> 
        {{ link.name }}
      </router-link>
    </nav>

    <div class="p-4 border-t border-gray-100">
<button @click="goToEditProfile" class="w-full flex items-center p-3 text-primario font-bold gap-2 hover:bg-primario hover:text-white rounded-lg transition-colors">
  <UserIcon class="w-5 h-5" />
  <span>Editar Perfil</span>
</button>

    </div>

    <div class="p-4 border-t border-gray-100">
      <button @click="logout" class="w-full flex items-center p-3 text-red-600 font-bold gap-2">
        <ArrowRightOnRectangleIcon class="w-5 h-5" />
        <span>Salir</span>
      </button>
    </div>
  </aside>
  
</template>
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { 
  HomeIcon, 
  TruckIcon, 
  ArrowRightOnRectangleIcon,
  PencilSquareIcon, // Cambié PlusCircle por este para ediciones
  UsersIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon, // Icono para Inspecciones
  UserIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const router = useRouter()
const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
const goToEditProfile = () => {
  router.push('/Editperfil'); // Asegúrate que esta ruta exista en tu router/index.js
};
// Lógica de Links Dinámicos ACTUALIZADA
const menuLinks = computed(() => {
  // 1. LINKS PARA SUPER USUARIO
  if (auth.rol === 'SUPER') {
    return [
      { name: 'Dashboard Global', path: '/dashboard-global', icon: HomeIcon },
      { name: 'Gestión Usuarios', path: '/usuarios', icon: UsersIcon },
      { name: 'Depositos', path: '/GestionDepositos', icon: BuildingOfficeIcon },
      { name: 'Bitácora', path: '/bitacora', icon: BuildingOfficeIcon },
      { name: 'Inventario', path: '/inventario', icon: TruckIcon },
    ]
  }

  // 2. LINKS PARA ADMINISTRADOR DE SEDE
  if (auth.rol === 'ADMIN') {
    return [
      { name: 'Dashboard Admin', path: '/DashAdmin', icon: HomeIcon },
      { name: 'Inventario', path: '/inventario', icon: TruckIcon },
      { name: 'Gestionar Solicitudes', path: '/GestionSoli', icon: PencilSquareIcon },

      { name: 'Inspecciones', path: '/GestionInspecciones', icon: ClipboardDocumentCheckIcon },
      { name: 'Bitácora', path: '/bitacora', icon: BuildingOfficeIcon },
      { name: 'Gestión Usuarios', path: '/usuarios', icon: UsersIcon },
    ]
  }

  // 3. LINKS PARA OPERADOR
  return [
    { name: 'Dashboard Operador', path: '/dashopera', icon: HomeIcon },
    { name: 'Inventario', path: '/inventario', icon: TruckIcon },
    { name: 'Mis Solicitudes', path: '/MisSolicitudes', icon: PencilSquareIcon },
    { name: 'Mis Inspecciones', path: '/MisInspecciones', icon: ClipboardDocumentCheckIcon },
    { name: 'Bitácora', path: '/bitacora', icon: BuildingOfficeIcon },
  ]
})

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>