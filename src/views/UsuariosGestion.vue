<template>
  <div class="p-4 md:p-10 text-slate-800 bg-white">
    <div class="max-w-7xl mx-auto">

      <!-- HEADER -->
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-100 pb-8">
        <div>
          <span class="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em]">Administración de Recursos</span>
          <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase mt-2">Gestión de Personal</h1>
          <p class="text-slate-400 font-medium text-sm">Control de accesos, roles y asignación de sedes oficiales.</p>
        </div>
        <button
          type="button"
          @click="abrirModal"
          class="bg-primario text-white font-black px-8 py-4 rounded-2xl hover:scale-105 cursor-pointer shadow-xl shadow-slate-900/20 transition-all text-[10px] uppercase tracking-widest"
        >
          + NUEVO USUARIO
        </button>
      </header>

      <!-- BARRA BÚSQUEDA + FILTROS -->
      <div class="flex flex-col md:flex-row gap-4 mb-8 items-center bg-white p-4 rounded-4xl border border-slate-100 shadow-sm">
        <div class="relative flex-1 w-full">
          <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por nombre o usuario..."
            class="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
          />
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto px-4">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol:</span>
          <select v-model="filtroRol" class="bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-purple-500/20 uppercase tracking-widest cursor-pointer">
            <option value="TODOS">TODOS</option>
            <option value="SUPER">SUPER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OPERADOR">OPERADOR</option>
          </select>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus:</span>
          <select v-model="filtroEstatus" class="bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-purple-500/20 uppercase tracking-widest cursor-pointer">
            <option value="TODOS">TODOS</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="SUSPENDIDO">SUSPENDIDO</option>
          </select>
        </div>
      </div>

      <!-- TABLA -->
      <div class="hidden md:block bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th class="px-8 py-6">Nombre / Identidad</th>
                <th class="px-8 py-6 text-center">Nivel Acceso</th>
                <th class="px-8 py-6">Sede Asignada</th>
                <th class="px-8 py-6">Estatus</th>
                <th class="px-8 py-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="user in usuariosPaginados"
                :key="user.id"
                :class="['transition-colors group', user.estatus_user === 'SUSPENDIDO' ? 'bg-red-50/30 opacity-60' : 'hover:bg-purple-50/40']"
              >
                <td class="px-8 py-6">
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-primario font-black mr-4 group-hover:bg-primario group-hover:text-white transition-all shadow-sm">
                      {{ user.username?.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-black text-slate-800 leading-tight uppercase text-sm">{{ user.nombre_user }} {{ user.aPaterno_user }}</p>
                      <p class="text-[10px] text-slate-400 font-mono tracking-tighter mt-1">@{{ user.username }}</p>
                    </div>
                  </div>
                </td>

                <td class="px-8 py-6 text-center">
                  <span class="px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.15em] uppercase border" :class="claseRol(user.rol)">
                    {{ user.rol }}
                  </span>
                </td>

                <td class="px-9 py-6">
                  <div v-if="user.id_deposito_detalles" class="flex flex-col">
                    <span class="text-xs font-black text-slate-700 uppercase tracking-tight">{{ user.id_deposito_detalles.nombre }}</span>
                    <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{{ user.id_deposito_detalles.ubicacion }}</span>
                  </div>
                  <span v-else class="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">Acceso Global</span>
                </td>

                <td class="px-9 py-6">
                  <span class="px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.15em] uppercase border" :class="claseEstatus(user.estatus_user)">
                    {{ user.estatus_user }}
                  </span>
                </td>

                <td class="px-8 py-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      @click="abrirModalEdicion(user)"
                      class="p-3 rounded-2xl bg-white text-slate-400 hover:bg-purple-600 hover:text-white transition-all border border-slate-100 shadow-sm"
                      title="Editar"
                    >
                      <PencilSquareIcon class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      @click="router.push(`/usuario/${user.id}`)"
                      class="p-3 rounded-2xl bg-white text-slate-400 hover:bg-purple-900 hover:text-white transition-all border border-slate-100 shadow-sm"
                    >
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="cambiarEstatusUsuario(user)"
                      :class="[
                        'px-4 py-2.5 rounded-xl transition-all border text-[10px] font-black flex items-center justify-center',
                        user.estatus_user === 'ACTIVO'
                          ? 'bg-white border-red-100 text-red-400 hover:bg-red-500 hover:text-white'
                          : 'bg-white border-green-100 text-green-500 hover:bg-green-500 hover:text-white'
                      ]"
                    >
                      <XMarkIcon
                        v-if="user.estatus_user === 'ACTIVO'"
                        class="w-4 h-4"
                      />
                      <CheckIcon
                        v-else
                        class="w-4 h-4"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppPaginator
          v-if="totalPaginas > 1"
          v-model="paginaActual"
          :total-paginas="totalPaginas"
          class="border-t border-slate-50"
        />
      </div>




        <div class="md:hidden space-y-4">
          <div
            v-for="user in usuariosPaginados"
            :key="user.id"
            :class="['bg-white rounded-4xl border border-slate-100 shadow-sm p-6 transition-all',
                    user.estatus_user === 'SUSPENDIDO' ? 'opacity-60 bg-red-50/30' : '']"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 font-black text-lg">
                  {{ user.username?.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="font-black text-slate-800 uppercase text-sm leading-tight">{{ user.nombre_user }} {{ user.aPaterno_user }}</p>
                  <p class="text-[10px] text-slate-400 font-mono mt-0.5">@{{ user.username }}</p>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase border" :class="claseRol(user.rol)">
                {{ user.rol }}
              </span>
            </div>

            <div class="space-y-2 border-t border-slate-50 pt-4 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sede</span>
                <span class="text-[10px] font-black text-slate-700 uppercase">
                  {{ user.id_deposito_detalles?.nombre || 'Acceso Global' }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estatus</span>
                <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase border" :class="claseEstatus(user.estatus_user)">
                  {{ user.estatus_user }}
                </span>
              </div>
            </div>

            <div class="flex gap-2 pt-2 border-t border-slate-50">
              <button @click="abrirModalEdicion(user)"
                class="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-purple-600 hover:text-white transition-all border border-slate-100 text-[10px] font-black uppercase flex items-center justify-center gap-2">
                <PencilSquareIcon class="w-4 h-4" /> Editar
              </button>
              <button @click="router.push(`/usuario/${user.id}`)"
                class="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-purple-900 hover:text-white transition-all border border-slate-100 text-[10px] font-black uppercase flex items-center justify-center gap-2">
                <EyeIcon class="w-4 h-4" /> Ver
              </button>
              <button
                @click="cambiarEstatusUsuario(user)"
                :class="[
                  'px-4 py-2.5 rounded-xl transition-all border text-[10px] font-black flex items-center justify-center',
                  user.estatus_user === 'ACTIVO'
                    ? 'bg-white border-red-100 text-red-400 hover:bg-red-500 hover:text-white'
                    : 'bg-white border-green-100 text-green-500 hover:bg-green-500 hover:text-white'
                ]"
              >
                <XMarkIcon
                  v-if="user.estatus_user === 'ACTIVO'"
                  class="w-4 h-4"
                />
                <CheckIcon
                  v-else
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <AppPaginator
            v-if="totalPaginas > 1"
            v-model="paginaActual"
            :total-paginas="totalPaginas"
          />
        </div>






      <!-- MODAL -->
      <div v-if="mostrarModal" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
        <div class="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300 my-auto">
          <div class="p-10">
            <div class="flex justify-between items-center mb-10">
              <div>
                <span class="text-[9px] font-black text-primario uppercase tracking-[0.3em]">{{ editandoId ? 'Actualización' : 'Alta de Personal' }}</span>
                <h2 class="text-3xl font-black text-primario tracking-tighter uppercase mt-1">{{ editandoId ? 'Editar Usuario' : 'Nuevo Integrante' }}</h2>
              </div>
              <button
                type="button"
                @click="mostrarModal = false"
                class="text-slate-300 hover:text-red-500 transition-colors text-2xl"
              >✕</button>
            </div>

            <form @submit.prevent="guardarUsuario" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nombre(s)</label>
                  <input v-model="nuevoUsuario.nombre_user" type="text" required class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold placeholder:text-slate-200" placeholder="Ej. Roberto">
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Apellido Paterno</label>
                  <input v-model="nuevoUsuario.aPaterno_user" type="text" required class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold placeholder:text-slate-200" placeholder="Ej. García">
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Apellido Materno</label>
                <input v-model="nuevoUsuario.aMaterno_user" type="text" required class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold placeholder:text-slate-200" placeholder="Ej. García">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Email Corporativo</label>
                  <input v-model="nuevoUsuario.email" type="email" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold placeholder:text-slate-200" placeholder="correo@dominio.com">
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Teléfono (10 dígitos)</label>
                  <input
                    v-model="nuevoUsuario.telefono_user"
                    type="text"
                    required
                    maxlength="10"
                    @input="nuevoUsuario.telefono_user = nuevoUsuario.telefono_user.replace(/\D/g, '')"
                    :class="['w-full px-6 py-4 rounded-2xl font-bold transition-all border-2 bg-slate-50 outline-none',
                             nuevoUsuario.telefono_user && nuevoUsuario.telefono_user.length !== 10
                               ? 'border-purple-400'
                               : 'border-transparent focus:ring-2 focus:ring-purple-500/20']"
                    placeholder="2411234567"
                  >
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nivel Acceso</label>
                  <select v-model="nuevoUsuario.rol" class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-black text-[10px] uppercase tracking-widest">
                    <option v-for="r in rolesDisponibles" :key="r.value" :value="r.value">{{ r.label }}</option>
                  </select>
                </div>
                <div class="space-y-2" v-if="nuevoUsuario.rol !== 'SUPER'">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Sede Oficial</label>
                  <select v-if="auth.rol === 'SUPER'" v-model="nuevoUsuario.id_deposito" required class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-black text-[10px] uppercase tracking-widest">
                    <option v-for="sede in sedes" :key="sede.id" :value="sede.id">{{ sede.nombre }}</option>
                  </select>
                  <div v-else class="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 flex items-center gap-2">
                    {{ auth.nombre_deposito || 'TU SEDE ASIGNADA' }}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-purple-50/50 rounded-3xl border border-purple-100">
                <div class="space-y-2">
                  <label class="text-[9px] font-black uppercase ml-2 tracking-widest text-primario">Username</label>
                  <input v-model="nuevoUsuario.username" type="text" :readonly="!!editandoId" class="w-full px-6 py-4 bg-white border border-purple-100 rounded-2xl font-black text-slate-700 outline-none">
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black uppercase ml-2 tracking-widest text-primario">
                    {{ editandoId ? 'Nueva Password (opcional)' : 'Password Inicial' }}
                  </label>
                  <input v-model="nuevoUsuario.password" type="text" :required="!editandoId" class="w-full px-6 py-4 bg-white border border-purple-100 rounded-2xl font-black text-slate-700 outline-none" placeholder="••••••••">
                </div>
              </div>

              <!-- BOTÓN SUBMIT con estado de carga -->
              <button
                type="submit"
                :disabled="cargando"
                :class="['w-full font-black py-5 rounded-3xl mt-4 transition-all uppercase text-[10px] tracking-[0.2em]',
                  cargando
                    ? 'bg-slate-400 text-white cursor-not-allowed'
                    : 'bg-primario text-white cursor-pointer hover:shadow-2xl hover:shadow-purple-900/30'
                ]"
              >
                <span v-if="cargando">⏳ GUARDANDO...</span>
                <span v-else>{{ editandoId ? 'GUARDAR CAMBIOS' : 'CREAR CUENTA OFICIAL' }}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { EyeIcon, PencilSquareIcon , CheckIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import clienteAxios from '../api/axios'
import Swal from 'sweetalert2'
import AppPaginator from '../components/AppPaginator.vue'

const auth          = useAuthStore()
const router        = useRouter()
const mostrarModal  = ref(false)
const editandoId    = ref(null)
const cargando      = ref(false)   // ✅ bloquea doble submit
const sedes         = ref([])
const usuarios      = ref([])
const busqueda      = ref('')
const filtroRol     = ref('TODOS')
const filtroEstatus = ref('TODOS')

// ─── PAGINACIÓN ───────────────────────────────────────────────
const porPagina    = 5
const paginaActual = ref(1)

// ─── FORM ─────────────────────────────────────────────────────
const nuevoUsuario = ref({
  username: '', password: '', nombre_user: '', aPaterno_user: '', aMaterno_user: '',
  telefono_user: '', email: '', rol: 'OPERADOR', id_deposito: null
})

// ─── ABRIR MODAL EDICIÓN ──────────────────────────────────────
const abrirModalEdicion = (user) => {
  editandoId.value = user.id
  nuevoUsuario.value = {
    username:      user.username,
    password:      '',
    nombre_user:   user.nombre_user,
    aPaterno_user: user.aPaterno_user,
    aMaterno_user: user.aMaterno_user || '',
    telefono_user: user.telefono_user || '',  // ← llega vacío del backend
    email:         user.email || '',
    rol:           user.rol,
    id_deposito:   user.id_deposito
  }
  mostrarModal.value = true
}

// ─── ABRIR MODAL NUEVO ────────────────────────────────────────
const abrirModal = () => {
  editandoId.value = null
  nuevoUsuario.value = {
    username: '', password: '', nombre_user: '', aPaterno_user: '', aMaterno_user: '',
    telefono_user: '', email: '', rol: 'OPERADOR',
    id_deposito: auth.rol === 'ADMIN' ? auth.id_deposito : null
  }
  mostrarModal.value = true
}


// ─── GUARDAR (POST O PATCH) ───────────────────────────────────
const guardarUsuario = async () => {
  if (cargando.value) return
  
  const datosAEnviar = { ...nuevoUsuario.value }
  if (datosAEnviar.rol === 'SUPER') datosAEnviar.id_deposito = null
  if (!datosAEnviar.email?.trim()) datosAEnviar.email = null
  if (editandoId.value && !datosAEnviar.password) delete datosAEnviar.password  

  console.log('Enviando:', JSON.stringify(datosAEnviar))  // ← agregar
  console.log('ID a editar:', editandoId.value)    // ← antes del try
  
  if (!editandoId.value && nuevoUsuario.value.telefono_user.length !== 10) {
    Swal.fire({ icon: 'warning', title: 'Teléfono incompleto', text: 'Debes ingresar exactamente 10 dígitos.', confirmButtonColor: '#9333ea' })
    return
  }
  
  // Al editar, solo validar si escribió algo
  if (editandoId.value && nuevoUsuario.value.telefono_user && nuevoUsuario.value.telefono_user.length !== 10) {
    Swal.fire({ icon: 'warning', title: 'Teléfono incompleto', text: 'Debes ingresar exactamente 10 dígitos.', confirmButtonColor: '#9333ea' })
    return
  }

  

  cargando.value = true  // ✅ bloquear UI mientras se procesa

  try {
    if (editandoId.value) {
      // ── EDITAR ──
      const response = await clienteAxios.patch(`usuarios/${editandoId.value}/`, datosAEnviar)
      const index = usuarios.value.findIndex(u => u.id === editandoId.value)
      if (index !== -1) usuarios.value[index] = response.data
      mostrarModal.value = false
      Swal.fire({ icon: 'success', title: 'Usuario Actualizado', timer: 1500, showConfirmButton: false })

    } else {
      // ── CREAR ──
      const response = await clienteAxios.post('usuarios/', datosAEnviar)
      usuarios.value.push(response.data)
      mostrarModal.value = false
      Swal.fire({ icon: 'success', title: 'Usuario Creado', timer: 1500, showConfirmButton: false })
    }

  } catch (error) {
    const errData = error.response?.data
    console.log('Error completo:', error.response?.status, JSON.stringify(error.response?.data))  // ← agregar
    let mensaje = 'No se pudo guardar la información'
    if (errData) {
      mensaje = Object.entries(errData)
        .map(([campo, errores]) =>
          `• ${campo}: ${Array.isArray(errores) ? errores.join(', ') : errores}`
        )
        .join('\n')
    }
    // Modal permanece abierto para que el usuario corrija
    Swal.fire({ icon: 'error', title: 'Error al guardar', text: mensaje })

  } finally {
    cargando.value = false  // ✅ siempre desbloquear, haya error o éxito
  }
}

// ─── CARGA INICIAL ────────────────────────────────────────────
const cargarUsuarios = async () => {
  try {
    const response = await clienteAxios.get('usuarios/')
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

const cargarSedes = async () => {
  try {
    const res = await clienteAxios.get('depositos/')
    sedes.value = res.data
  } catch (e) {
    console.error('Error al cargar sedes:', e)
  }
}

// ─── FILTRADO ─────────────────────────────────────────────────
const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(user => {
    const esUsuarioActual  = user.username === auth.username
    const coincideRol      = filtroRol.value === 'TODOS'     || user.rol          === filtroRol.value
    const coincideEstatus  = filtroEstatus.value === 'TODOS' || user.estatus_user === filtroEstatus.value
    const termino          = busqueda.value.toLowerCase()
    const coincideBusqueda = (user.nombre_user || '').toLowerCase().includes(termino)
                          || (user.username    || '').toLowerCase().includes(termino)
    const esDeMiSede       = auth.rol === 'SUPER'
                          || String(user.id_deposito) === String(auth.id_deposito)
    return !esUsuarioActual && coincideRol && coincideEstatus && coincideBusqueda && esDeMiSede
  })
})

// Reset página al filtrar
watch(usuariosFiltrados, () => { paginaActual.value = 1 })

// ─── PAGINACIÓN COMPUTED ──────────────────────────────────────
const totalPaginas = computed(() =>
  Math.ceil(usuariosFiltrados.value.length / porPagina) || 1
)

const usuariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return usuariosFiltrados.value.slice(inicio, inicio + porPagina)
})

// ─── AUTO-GENERAR CREDENCIALES (solo en creación) ─────────────
watch(
  [() => nuevoUsuario.value.nombre_user, () => nuevoUsuario.value.aPaterno_user],
  ([nombre, apellido]) => {
    if (!editandoId.value && nombre && apellido) {
      nuevoUsuario.value.username = `${nombre.charAt(0)}${apellido.replace(/\s+/g, '')}`.toLowerCase()
      nuevoUsuario.value.password = `${apellido.charAt(0).toUpperCase()}${apellido.slice(1).toLowerCase()}2026`
    }
  }
)

// ─── CAMBIAR ESTATUS ──────────────────────────────────────────
const cambiarEstatusUsuario = async (user) => {
  const nuevoEstado = user.estatus_user === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO'
  try {
    await clienteAxios.patch(`usuarios/${user.id}/`, { estatus_user: nuevoEstado })
    user.estatus_user = nuevoEstado
    Swal.fire({ icon: 'success', title: `Usuario ${nuevoEstado}`, timer: 1000, showConfirmButton: false })
  } catch (error) {
    Swal.fire('Error', 'No se pudo actualizar el estado', 'error')
  }
}

// ─── HELPERS ──────────────────────────────────────────────────
const rolesDisponibles = computed(() => {
  if (auth.rol === 'SUPER') {
    return [
      { value: 'OPERADOR', label: 'OPERADOR' },
      { value: 'ADMIN',    label: 'ADMIN'    },
      { value: 'SUPER',    label: 'SUPER'    }
    ]
  }
  return [{ value: 'OPERADOR', label: 'OPERADOR' }]
})

const claseRol = (rol) => ({
  SUPER:    'bg-purple-50 text-purple-600 border-purple-100',
  ADMIN:    'bg-orange-50 text-orange-600 border-orange-100',
  OPERADOR: 'bg-blue-50   text-blue-600   border-blue-100'
}[rol] || 'bg-slate-50 text-slate-600 border-slate-100')

const claseEstatus = (estatus) =>
  estatus === 'ACTIVO'
    ? 'bg-green-50 text-green-600 border-green-100'
    : 'bg-red-50   text-red-600   border-red-100'

onMounted(() => {
  cargarUsuarios()
  cargarSedes()
})
</script>