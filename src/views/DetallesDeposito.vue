<template>
  <div class="min-h-screen bg-white flex flex-col p-4 md:p-10 font-sans relative overflow-x-hidden pb-32">
    
    <button @click="router.back()" class="absolute top-6 left-6 md:top-8 md:left-10 z-20 flex items-center gap-2 text-slate-500 hover:text-primario transition-colors bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
      <ArrowLeftIcon class="w-4 h-4" />
      <span class="text-[10px] font-black uppercase tracking-widest">Regresar</span>
    </button>

    <div v-if="loading" class="w-full flex-col flex items-center justify-center min-h-[60vh]">
       <div class="w-16 h-16 border-4 border-slate-200 border-t-primario rounded-full animate-spin mb-6"></div>
       <p class="text-slate-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Cargando expediente de sede...</p>
    </div>

    <div v-else-if="error" class="w-full max-w-2xl mx-auto z-10 bg-white p-12 rounded-4xl shadow-sm border border-slate-100 text-center mt-20">
      <ExclamationCircleIcon class="w-16 h-16 text-red-500 mx-auto mb-6" />
      <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">Error de Conexión</h2>
      <p class="text-sm font-bold text-slate-500 mb-8">{{ error }}</p>
      <button @click="router.back()" class="bg-slate-900 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primario transition-all shadow-md">Volver a Intentar</button>
    </div>

    <div v-else class="w-full max-w-350 mx-auto mt-20">
      
      <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-slate-200 pb-8">
        <div>
          <span class="text-[10px] font-black text-primario uppercase tracking-[0.3em]">Plantilla Operativa y Resguardo</span>
          <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter uppercase mt-2">
            {{ deposito.nombre }}
          </h1>
          <p class="text-slate-500 font-bold text-sm mt-3 uppercase tracking-widest flex items-center gap-2">
            <MapPinIcon class="w-5 h-5 text-slate-400" />
            {{ deposito.ubicacion || 'Ubicación no especificada' }}
          </p>
        </div>

        <div class="flex items-center gap-4">
           <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
             <div class="text-right">
               <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Estatus Operativo</span>
               <span :class="deposito.estatus_deposito === 'ACTIVO' ? 'text-green-600' : 'text-red-500'" class="text-sm font-black uppercase tracking-tighter flex items-center gap-2 justify-end transition-colors duration-500">
                  <span :class="deposito.estatus_deposito === 'ACTIVO' ? 'bg-green-500 animate-pulse' : 'bg-red-500'" class="w-2.5 h-2.5 rounded-full inline-block"></span>
                  {{ deposito.estatus_deposito }}
               </span>
             </div>
             <div class="w-px h-10 bg-slate-100"></div>
             <div class="text-left">
               <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Creación</span>
               <span class="text-xs font-bold text-slate-600 uppercase">{{ formatoFecha(deposito.creado_el) }}</span>
             </div>
           </div>
        </div>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-primario/30 transition-all">
          <div class="flex justify-between items-start mb-6">
            <div class="p-3 bg-slate-50 rounded-xl group-hover:bg-primario/10 transition-colors">
              <TruckIcon class="w-6 h-6 text-slate-500 group-hover:text-primario transition-colors" />
            </div>
            <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-lg">Inventario</span>
          </div>
          <div>
            <p class="text-5xl font-black text-slate-800 tracking-tighter">{{ estadisticas.total_unidades }}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Unidades Ingresadas</p>
          </div>
        </div>

        <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-slate-800/30 transition-all">
          <div class="flex justify-between items-start mb-6">
            <div class="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-800/10 transition-colors">
              <UsersIcon class="w-6 h-6 text-slate-500 group-hover:text-slate-800 transition-colors" />
            </div>
            <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-lg">Plantilla</span>
          </div>
          <div>
            <p class="text-5xl font-black text-slate-800 tracking-tighter">{{ usuariosSede.length }}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Personal Asignado</p>
          </div>
        </div>

        <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
          <div class="flex justify-between items-start mb-6">
            <div class="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
              <ShieldCheckIcon class="w-6 h-6 text-slate-500 group-hover:text-indigo-500 transition-colors" />
            </div>
            <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-lg">Auditoría</span>
          </div>
          <div>
            <p class="text-5xl font-black text-slate-800 tracking-tighter">{{ estadisticas.total_inspecciones }}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Inspecciones Físicas</p>
          </div>
        </div>

        
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
        <section class="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col h-full">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Personal Registrado</h3>
            <span class="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-lg">{{ usuariosSede.length }} Usuarios</span>
          </div>
          <div v-if="usuariosSede.length === 0" class="flex-1 flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-100 rounded-2xl text-center">
             <UsersIcon class="w-12 h-12 text-slate-300 mb-4" />
             <p class="text-xs font-black text-slate-400 uppercase">Sin personal asignado</p>
          </div>
          <div v-else class="flex-1 overflow-x-auto">
            <table class="w-full text-left min-w-125">
              <thead>
                <tr class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th class="pb-4">Usuario</th>
                  <th class="pb-4">Rol</th>
                  <th class="pb-4 text-right">Estatus</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="user in usuariosSede" :key="user.id" class="hover:bg-slate-50 transition-colors">
                  <td class="py-4">
                    <p class="text-xs font-black text-slate-700 uppercase leading-tight">{{ user.nombre_user }} {{ user.aPaterno_user }}</p>
                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">@{{ user.username }}</p>
                  </td>
                  <td class="py-4">
                     <span :class="claseRol(user.rol)" class="px-3 py-1.5 rounded-lg text-[8px] font-black tracking-[0.15em] uppercase border">
                      {{ user.rol }}
                    </span>
                  </td>
                  <td class="py-4 text-right">
                    <span class="text-[10px] font-bold uppercase" :class="user.estatus_user === 'ACTIVO' ? 'text-green-500' : 'text-slate-400'">
                       {{ user.estatus_user }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col h-full">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Vehículos Recientes</h3>
            <button @click="irAInventarioFiltro" class="text-[9px] font-black text-primario uppercase tracking-widest hover:underline transition-all">
              Ver Todo <ArrowRightIcon class="w-3 h-3 inline ml-1" />
            </button>
          </div>
          <div v-if="vehiculosRecientes.length === 0" class="flex-1 flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-100 rounded-2xl text-center">
             <TruckIcon class="w-12 h-12 text-slate-300 mb-4" />
             <p class="text-xs font-black text-slate-400 uppercase">Inventario vacío</p>
          </div>
          <div v-else class="space-y-4">
             <div v-for="(veh, idx) in vehiculosRecientes" :key="idx" 
                  class="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                  @click="abrirDetalleAuto(veh.id)">
                <div class="px-3 py-2 bg-white border border-slate-200 rounded text-center min-w-20">
                  <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Placas</p>
                  <p class="text-xs font-black text-slate-700 uppercase">{{ veh.placas }}</p>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-black text-slate-800 uppercase">{{ veh.marca }} {{ veh.modelo }}</p>
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Folio: {{ veh.folio }}</p>
                </div>
             </div>
          </div>
        </section>
      </div>

      <section v-if="auth.rol === 'SUPER'" class="mt-12 pt-8 border-t border-slate-200">
        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500"
             :class="deposito.estatus_deposito === 'SUSPENDIDO' ? 'bg-red-50/30' : ''">
          <div>
            <span class="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Administración Superior</span>
            <h3 class="text-xl font-black text-slate-800 tracking-tighter uppercase mt-1">Control Operativo de Sede</h3>
            <p class="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">
              {{ deposito.estatus_deposito === 'ACTIVO' 
                 ? 'La sede será bloqueada para nuevos registros e ingresos.' 
                 : 'La sede será habilitada para operar con normalidad.' }}
            </p>
          </div>

          <button 
            @click="toggleEstatusDeposito"
            :class="deposito.estatus_deposito === 'ACTIVO' 
              ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white' 
              : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white'"
            class="flex items-center gap-3 px-8 py-4 rounded-2xl border font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-sm group"
          >
            <PowerIcon v-if="deposito.estatus_deposito === 'ACTIVO'" class="w-5 h-5 transition-transform group-hover:scale-110" />
            <CheckBadgeIcon v-else class="w-5 h-5 transition-transform group-hover:scale-110" />
            {{ deposito.estatus_deposito === 'ACTIVO' ? 'Suspender Acceso' : 'Reactivar Sede' }}
          </button>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import clienteAxios from '../api/axios'
import Swal from 'sweetalert2'
import { 
  ArrowLeftIcon, MapPinIcon, BuildingOfficeIcon, TruckIcon,
  UsersIcon, ShieldCheckIcon, ExclamationCircleIcon,
  ArrowRightIcon, CalendarDaysIcon, PowerIcon, CheckBadgeIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const cargandoExtras = ref(true)
const error = ref('')

const deposito = ref({})
const usuariosSede = ref([])
const vehiculosRecientes = ref([])
const estadisticas = ref({ total_unidades: 0, total_inspecciones: 0 })

const cargarDatos = async () => {
  try {
    loading.value = true
    let idBuscar = route.params.id || localStorage.getItem('deposito_ver_id')
    if (!idBuscar) throw new Error("ID de sede no encontrado.")

    const res = await clienteAxios.get(`depositos/${idBuscar}/`)
    deposito.value = res.data
    const depID = Number(idBuscar)
    
    loading.value = false
    cargandoExtras.value = true

    const [todosUsuarios, todosIngresos, todasInspecciones] = await Promise.all([
       clienteAxios.get('usuarios/').then(r => r.data.results || r.data),
       clienteAxios.get('ingresos/').then(r => r.data.results || r.data),
       clienteAxios.get('inspecciones/').then(r => r.data.results || r.data)
    ])

    usuariosSede.value = todosUsuarios.filter(u => u.id_deposito === depID)
    const IDsOperadoresSede = usuariosSede.value.map(u => u.id)
    
    const misIngresos = todosIngresos.filter(ing => {
        if (Number(ing.deposito) === depID) return true
        let userId = ing.id_usuario?.id || ing.id_usuario
        return userId && IDsOperadoresSede.includes(Number(userId))
    })

    estadisticas.value.total_unidades = misIngresos.length
    estadisticas.value.total_inspecciones = todasInspecciones.filter(ins => IDsOperadoresSede.includes(Number(ins.id_usuario?.id || ins.id_usuario))).length

    misIngresos.sort((a,b) => new Date(b.fecha_ingreso || 0) - new Date(a.fecha_ingreso || 0))
    vehiculosRecientes.value = misIngresos.slice(0, 6).map(ing => ({
        id: ing.id,
        folio: ing.folio || `INV-${ing.id}`,
        marca: ing.vehiculo_detalle?.marca || 'VEHÍCULO',
        modelo: ing.vehiculo_detalle?.modelo || '-',
        placas: ing.vehiculo_detalle?.placas || 'S/P',
        fecha_ingreso: ing.fecha_ingreso
    }))

  } catch (err) {
    error.value = "Error al conectar con la sede."
  } finally {
    cargandoExtras.value = false
  }
}

// LÓGICA DE CONTROL CON FLUJO DE DOS PASOS
const toggleEstatusDeposito = async () => {
  const esActivo = deposito.value.estatus_deposito === 'ACTIVO'
  const nuevoEstatus = esActivo ? 'SUSPENDIDO' : 'ACTIVO'

  if (esActivo) {
    try {
      // PASO 1: Validar registros "DENTRO"
      const res = await clienteAxios.get(`ingresos/?deposito=${deposito.value.id}`)
      const vehiculosDentro = res.data.filter(ing => ing.vehiculo_detalle?.estatus_actual === 'DENTRO')

      if (vehiculosDentro.length > 0) {
        // ALERTA 1: Advertencia de registros existentes
        const { isConfirmed: seguir } = await Swal.fire({
          title: '⚠️ Inventario Activo Detectado',
          html: `
            <div class="text-left space-y-3 p-2">
              <p class="text-sm text-slate-600">Esta sede tiene <b class="text-red-500">${vehiculosDentro.length} vehículo(s)</b> en resguardo actualmente.</p>
              <p class="text-xs text-slate-400 font-bold">¿Está seguro de que desea suspender las operaciones a pesar de tener vehículos dentro?</p>
            </div>
          `,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar con la suspensión',
          cancelButtonText: 'No, cancelar',
          confirmButtonColor: '#ef4444',
          customClass: { popup: 'rounded-[2rem] shadow-2xl', confirmButton: 'rounded-xl text-[10px] uppercase tracking-widest px-6 py-3', cancelButton: 'rounded-xl text-[10px] uppercase tracking-widest px-6 py-3' }
        })

        if (!seguir) return // Usuario canceló
      }
    } catch (err) {
      console.error("Error validando registros:", err)
    }
  }

  // PASO 2: Confirmación final y solicitud de motivo
  const { value: motivo, isConfirmed } = await Swal.fire({
    title: esActivo ? 'Confirmar Suspensión' : 'Reactivar Sede',
    text: esActivo ? 'Por favor, ingrese el motivo del cierre operativo:' : 'Se habilitará el acceso inmediato a la sede.',
    input: esActivo ? 'textarea' : null,
    inputPlaceholder: 'Escriba aquí la razón...',
    showCancelButton: true,
    confirmButtonText: esActivo ? 'Finalizar Suspensión' : 'Reactivar Ahora',
    cancelButtonText: 'Volver',
    confirmButtonColor: esActivo ? '#ef4444' : '#10b981',
    inputValidator: (value) => {
      if (esActivo && !value) return '¡Debe ingresar un motivo para continuar!'
    },
    customClass: { popup: 'rounded-[2rem] shadow-2xl', confirmButton: 'rounded-xl text-[10px] uppercase tracking-widest px-6 py-3', cancelButton: 'rounded-xl text-[10px] uppercase tracking-widest px-6 py-3' }
  })

  if (!isConfirmed) return

  try {
    // PATCH al servidor
    await clienteAxios.patch(`depositos/${deposito.value.id}/`, { 
      estatus_deposito: nuevoEstatus,
      motivo_cambio: motivo // Asegúrate de que el backend reciba este campo o guárdalo en logs
    })

    deposito.value.estatus_deposito = nuevoEstatus
    
    Swal.fire({
      title: esActivo ? 'Sede Suspendida' : 'Sede Habilitada',
      icon: esActivo ? 'info' : 'success',
      timer: 2000,
      showConfirmButton: false,
      customClass: { popup: 'rounded-[2rem]' }
    })
  } catch (err) {
    Swal.fire({ title: 'Error', text: 'No se pudo completar la operación.', icon: 'error' })
  }
}

const formatoFecha = (fechaStr) => {
    if(!fechaStr) return 'N/D'
    const d = new Date(fechaStr)
    return isNaN(d.getTime()) ? fechaStr : d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit'})
}

const claseRol = (rol) => {
  switch (rol) {
    case 'SUPER': return 'bg-slate-800 text-white border-slate-900'
    case 'ADMIN': return 'bg-slate-200 text-slate-700 border-slate-300'
    case 'OPERADOR': return 'bg-white text-slate-500 border-slate-200'
    default: return 'bg-slate-50 text-slate-400 border-slate-200'
  }
}

const abrirDetalleAuto = (id) => {
    localStorage.setItem('vehiculo_id', id)
    router.push('/detallesauto')
}
const irAInventarioFiltro = () => router.push('/inventario')
onMounted(cargarDatos)
</script>

<style scoped>
.max-w-350 { max-w: 1400px; }
</style>