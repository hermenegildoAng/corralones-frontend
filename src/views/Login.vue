<template>
  <header
    class="fixed top-0 left-0 w-full px-8 py-4 flex justify-between items-center bg-white/90 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
    <img src="/img/horizontal.png" alt="GOB" class="h-12 w-auto">
    <div class="hidden md:block text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de Tlaxcala</p>
      <p class="text-xs font-bold text-primario uppercase tracking-tighter">Secretaría de Movilidad y Transporte</p>
    </div>
  </header>

  <main class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 pt-24 pb-16 font-sans">
    <div class="bg-white rounded-[3rem] shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col-reverse md:flex-row ...">
      <div class="md:w-1/2 bg-primario p-12 text-white flex flex-col justify-center relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div class="absolute bottom-0 left-0 w-40 h-40 bg-rosa-comp/20 rounded-full -ml-20 -mb-20"></div>

        <div class="relative z-10">
          <span
            class="bg-rosa-comp text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">Institucional</span>
          <h1 class="text-5xl font-black mt-8 mb-6 leading-[1.1] tracking-tighter uppercase">Sistema de Control de
            Depositos</h1>
          <div class="h-1.5 w-20 bg-rosa-comp mb-10 rounded-full"></div>

          <div class="space-y-8 text-blue-50/70">
            <div class="flex items-start gap-4">
              <div class="mt-1 bg-white/10 p-2.5 rounded-xl text-rosa-comp shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p class="text-sm leading-relaxed font-medium"><strong class="text-white block mb-1">Transparencia
                  MSYT:</strong> Modernización en el resguardo de vehículos y auditoría de procesos.</p>
            </div>
            <div class="flex items-start gap-4">
              <div class="mt-1 bg-white/10 p-2.5 rounded-xl text-rosa-comp shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-sm leading-relaxed font-medium">Uso restringido a personal autorizado. El sistema registra
                cada operación por seguridad.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="md:w-1/2 p-12 lg:p-16 flex flex-col justify-center bg-white">
        <div class="mb-12 text-center md:text-left">
          <h2 class="text-4xl font-black text-slate-800 tracking-tight uppercase">Iniciar Sesión</h2>
          <p class="text-slate-400 mt-3 font-bold text-sm uppercase tracking-widest">Credenciales Oficiales</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="group">
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2 tracking-widest">Nombre de
              Usuario</label>
            <input v-model="form.username" type="text"
              class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-primario/10 focus:border-primario focus:bg-white outline-none transition-all duration-300 font-bold text-slate-700"
              placeholder="Ej. operador_tlx" required />
          </div>

          <div class="group relative">
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2 tracking-widest">
              Contraseña
            </label>

            <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
              class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-primario/10 focus:border-primario focus:bg-white outline-none transition-all duration-300 font-bold text-slate-700"
              placeholder="••••••••" required />

            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-5 top-10 text-slate-400 hover:text-slate-700">
              <EyeIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- ✅ Campo "Recordar contraseña" centrado -->
          <div class="flex items-center gap-2">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <label for="remember" class="text-sm text-gray-600 cursor-pointer select-none">
              Recordar usuario
            </label>
          </div>

          <button type="submit"
            class="w-full bg-primario text-white py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primario/90 hover:shadow-2xl hover:shadow-primario/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 mt-6 flex items-center justify-center gap-3">
            Entrar al Panel Administrativo
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
          <div class="text-center mt-4">
            <router-link to="/forgot-password"
              class="text-xs text-slate-400 hover:text-primario transition-colors font-bold uppercase tracking-widest">
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>
        </form>

        <transition name="fade">
          <p v-if="error"
            class="mt-8 text-[10px] text-center p-4 bg-red-50 text-red-600 rounded-2xl font-black border border-red-100 uppercase tracking-widest">
            ⚠️ {{ error }}
          </p>
        </transition>
      </div>
    </div>
  </main>

  <footer
    class="fixed bottom-0 left-0 w-full py-5 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-center items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest z-50 px-8">
    <div class="flex items-center gap-4">
      <span>© 2026 MSYT - TLAXCALA</span>
      <span class="hidden md:block text-slate-200">|</span>
      <a href="#" class="hover:text-primario transition-colors">Aviso de Privacidad</a>
    </div>
    <div class="md:ml-auto flex items-center gap-2">
      <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
      Sistema en Línea
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import clienteAxios from '../api/axios'
import { useRouter } from 'vue-router'
import { EyeIcon } from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2' // Asegúrate de tenerlo instalado

const router = useRouter()
const auth = useAuthStore()
const error = ref('')
const form = ref({ username: '', password: '', remember: false })
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    error.value = ''
    
    // 1. Petición al backend
    const response = await clienteAxios.post('login/', {
      username: form.value.username,
      password: form.value.password,
    })

    const data = response.data
    
    // --- NUEVA VALIDACIÓN DE SUSPENSIÓN ---
    if (data.estatus_user === 'SUSPENDIDO') {
      Swal.fire({
        title: 'Acceso Denegado',
        text: 'Tu cuenta se encuentra suspendida. Contacta al administrador.',
        icon: 'warning',
        confirmButtonColor: '#631133' // Color institucional
      })
      return // Detenemos el proceso aquí
    }

    const token = data.token || data.access
    const tokenPayload = JSON.parse(atob(token.split('.')[1]))

    // 2. Preparar el objeto de sesión con el estatus incluido
    const sessionData = {
      access: token,
      rol: data.rol,
      estatus_user: data.estatus_user, // Importante para el router
      id_deposito: data.id_deposito,
      nombre_deposito: data.id_deposito_detalles?.nombre || 'Sede Oficial',
      nombre_user: data.nombre_user,
      user_id: data.user_id || tokenPayload.user_id,
    }

    // 3. Guardar en Store y SessionStorage
    auth.login(sessionData)
    sessionStorage.setItem('user_data', JSON.stringify(sessionData))
    sessionStorage.setItem('access_token', token) // Para el router.beforeEach

    // 4. Gestión de "Recordar usuario"
    if (form.value.remember) {
      localStorage.setItem('remembered_username', form.value.username)
    } else {
      localStorage.removeItem('remembered_username')
    }

    // 5. Redirección por Rol
    const rolUpper = data.rol.toUpperCase()
    if (rolUpper === 'SUPER') {
      router.replace('/dashboard-global')
    } else if (rolUpper === 'ADMIN') {
      router.replace('/dashadmin')
    } else {
      router.replace('/dashopera')
    }

} catch (err) {
    console.log("Estructura completa del error:", err.response); // MIRA ESTO EN LA CONSOLA
    
    // Si el backend envía errores por campo (ej: { "password": ["Este campo es requerido"] })
    const validacionErrores = err.response?.data;
    if (validacionErrores && typeof validacionErrores === 'object') {
        error.value = Object.values(validacionErrores).flat().join(' ');
    } else {
        error.value = err.response?.data?.detail || 'Error de conexión con el servidor';
    }
    
    Swal.fire('Error de Acceso', error.value, 'error');
}
}

onMounted(() => {
  const savedUsername = localStorage.getItem('remembered_username')
  if (savedUsername) {
    form.value.username = savedUsername
    form.value.remember = true
  }
})
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>