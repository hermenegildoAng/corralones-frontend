<template>
  <div class="p-4 md:p-10 bg-slate-50 min-h-screen">
    
    <!-- CABECERA DE LA VISTA -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
      <div>
        <span class="text-[10px] font-black text-primario uppercase tracking-[0.3em]">Operador</span>
        <h1 class="text-4xl font-black text-slate-800 tracking-tighter uppercase mt-2">Mis Solicitudes</h1>
        <p class="text-slate-400 font-medium text-sm mt-1">Historial de correcciones y ediciones enviadas a los administradores.</p>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto">
        <!-- Barra de Búsqueda -->
        <div class="relative flex-1 md:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4">
          <MagnifyingGlassIcon class="w-5 h-5 text-slate-300" />
          <input 
            v-model="busqueda"
            type="text" 
            placeholder="Buscar por placa, vin o campo..." 
            class="w-full bg-transparent border-none py-4 text-xs font-black uppercase text-slate-700 outline-none ml-2 placeholder:text-slate-300"
          />
        </div>
        
        <!-- Filtro por Estado -->
        <select v-model="filtroEstatus" class="bg-white border text-xs font-black text-slate-600 border-slate-100 rounded-2xl py-4 px-6 shadow-sm outline-none uppercase cursor-pointer">
          <option value="TODOS">Todos</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="ACEPTADA">Aceptadas</option>
          <option value="RECHAZADA">Rechazadas</option>
        </select>
      </div>
    </header>

    <!-- ÁREA DE RESULTADOS -->
    <div v-if="solicitudesFiltradas.length === 0" class="bg-white p-14 rounded-[3rem] border border-dashed border-slate-200 text-center shadow-sm">
      <div class="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <InboxIcon class="w-10 h-10 text-slate-300" />
      </div>
      <p class="text-lg font-black text-slate-400 uppercase tracking-widest">Sin resultados</p>
      <p class="text-xs text-slate-400 mt-2 font-medium">No se encontraron solicitudes que coincidan con tu búsqueda.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- CARD DE CADA SOLICITUD -->
      <div 
        v-for="sol in solicitudesFiltradas" 
        :key="sol.id"
        class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      >
        <!-- Ribbons de colores laterales según estado -->
        <div :class="['absolute left-0 top-0 bottom-0 w-2 transition-colors', getColorEstatus(sol.estatus).bgBorder]"></div>
        
        <!-- Encabezado Tarjeta -->
        <div class="flex justify-between items-start mb-6">
          <div>
            <span class="text-[9px] font-black text-primario uppercase tracking-widest block mb-1">Campo Afectado</span>
            <h3 class="text-sm font-black text-primario uppercase leading-tight">{{ sol.campo_afectado }}</h3>
          </div>
          <div class="flex justify-end">
            
            <span :class="['px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-dashed flex items-center gap-2 shrink-0', getColorEstatus(sol.estatus).badge]">
              <component :is="getColorEstatus(sol.estatus).icon" class="w-3 h-3" />
              {{ sol.estatus }}
            </span>
          </div>
        </div>

        <div class="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-5 space-y-3">
           <div class="flex justify-between items-center">
             <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vehículo</span>
             <span class="text-xs font-black text-primario uppercase">{{ sol.vehiculo_identificador }}</span>
           </div>
           
           <div class="grid grid-cols-2 gap-4 border-t border-slate-200 pt-3">
              <div>
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Dice</p>
                <p class="text-xs font-bold text-slate-600 line-through decoration-red-400/50 uppercase truncate" :title="sol.valor_viejo">{{ sol.valor_viejo }}</p>
              </div>
              <div>
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Debe Decir</p>
                <p class="text-xs font-black text-green-600 uppercase truncate" :title="sol.valor_nuevo">{{ sol.valor_nuevo }}</p>
              </div>
           </div>
        </div>
        
            
        <!-- Justificación -->
        <div class="flex-1 mb-6">
          <p class="text-[9px] font-black text-primarios uppercase tracking-widest mb-2">Justificación enviada</p>
          <p class="text-xs text-slate-500 italic leading-relaxed font-medium">"{{ sol.justificacion }}"</p>
          
          <!-- Mensaje de Rechazo Visible solo si aplica -->
          <div v-if="sol.estatus === 'RECHAZADA' && sol.motivo_rechazo" class="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100">
             <p class="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Motivo Rechazo Administrativo</p>
             <p class="text-[10px] text-red-600 font-bold leading-snug">"{{ sol.motivo_rechazo }}"</p>
          </div>
        </div>

        <!-- Pie de Tarjeta -->
        <div class="flex justify-between items-center border-t border-slate-50 pt-4 mt-auto">
          <p class="text-[9px] font-black text-primario tracking-widest uppercase">{{ sol.fecha_solicitud }}</p>
          <div v-if="sol.usuario_acepto" class="text-right">
            <p class="text-[8px] font-bold text-primario uppercase italic leading-none">Aprobado/Rechazó:</p>
            <p class="text-[9px] font-black text-primario uppercase tracking-tighter mt-0.5">@{{ sol.usuario_acepto }}</p>
          </div>
        </div>

      </div>
    </div>

    <!-- SECCIÓN FOTOS -->
      <div class="mt-16">
        <div class="mb-8">
          <span class="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Evidencia Fotográfica</span>
          <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase mt-1">Mis Fotos Enviadas</h2>
        </div>

        <div v-if="fotosFiltradas.length === 0" class="bg-white p-14 rounded-[3rem] border border-dashed border-slate-200 text-center shadow-sm">
          <p class="text-lg font-black text-slate-400 uppercase tracking-widest">Sin fotos enviadas</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="foto in fotosFiltradas" :key="foto.id"
              class="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">

            <div :class="['absolute left-0 top-0 bottom-0 w-2',
              foto.estatus === 'PENDIENTE' ? 'bg-amber-400' :
              foto.estatus === 'ACEPTADA' ? 'bg-green-400' : 'bg-red-400']">
            </div>

            <div class="flex justify-end">
              <span :class="['px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-dashed',
                foto.estatus === 'PENDIENTE' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                foto.estatus === 'ACEPTADA' ? 'bg-green-50 text-green-600 border-green-200' :
                'bg-red-50 text-red-500 border-red-200']">
                {{ foto.estatus }}
              </span>
            </div>

            <div class="h-40 rounded-2xl overflow-hidden border border-slate-100 cursor-zoom-in"
                @click="window.open(foto.foto, '_blank')">
              <img :src="foto.foto" class="w-full h-full object-cover hover:scale-105 transition-transform" />
            </div>

            <div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Etiqueta</p>
              <p class="text-sm font-black text-slate-800 uppercase mt-1">{{ foto.nombre }}</p>
              <p class="text-[9px] font-bold text-primario uppercase mt-1">{{ foto.vehiculo_identificador }}</p>
              <p v-if="foto.justificacion" class="text-xs text-slate-500 italic mt-2">"{{ foto.justificacion }}"</p>
            </div>

            <div v-if="foto.motivo_rechazo" class="p-3 bg-red-50 rounded-2xl border border-red-100">
              <p class="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Motivo Rechazo</p>
              <p class="text-xs text-red-600 font-bold">"{{ foto.motivo_rechazo }}"</p>
            </div>

            <p class="text-[9px] font-black text-primario uppercase mt-auto">{{ foto.fecha_subida }}</p>
          </div>
        </div>
      </div>

  </div>
</template>

<script setup>

import { MagnifyingGlassIcon, InboxIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onMounted, onUnmounted } from 'vue'  // ← agrega onMounted
import { useAuthStore } from '../stores/auth'    // ← agrega esto
import clienteAxios from '../api/axios'   
const auth = useAuthStore()
const busqueda = ref('')
const filtroEstatus = ref('TODOS')
const loading = ref(false)
// DATA SIMULADA BASADA EN EL MODELO "SolicitudEdicion"
const historialSolicitudes = ref([])
let pollingInterval = null
// Computed para manejar la caja de búsqueda y los dropdowns
const solicitudesFiltradas = computed(() => {
  let resultado = historialSolicitudes.value

  // Filtro de Select
  if (filtroEstatus.value !== 'TODOS') {
    resultado = resultado.filter(s => s.estatus === filtroEstatus.value)
  }

  // Filtro de Input
  if (busqueda.value.trim() !== '') {
    const q = busqueda.value.toLowerCase()
    resultado = resultado.filter(s => 
      s.campo_afectado.toLowerCase().includes(q) || 
      s.vehiculo_identificador.toLowerCase().includes(q) || 
      s.justificacion.toLowerCase().includes(q)
    )
  }

  return resultado
})

// Función para pintar tarjetas dinámicamente según el estatus
const getColorEstatus = (estatus) => {
  switch(estatus) {
    case 'PENDIENTE':
      return {
        bgBorder: 'bg-yellow-400',
        badge: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        icon: ClockIcon
      }
    case 'ACEPTADA':
      return {
        bgBorder: 'bg-green-400',
        badge: 'bg-green-50 text-green-600 border-green-200',
        icon: CheckCircleIcon
      }
    case 'RECHAZADA':
      return {
        bgBorder: 'bg-red-400',
        badge: 'bg-red-50 text-red-600 border-red-200',
        icon: XCircleIcon
      }
    default:
      return {
        bgBorder: 'bg-slate-400',
        badge: 'bg-slate-50 text-slate-600 border-slate-200',
        icon: ClockIcon
      }
  }
}
const fotosFiltradas = computed(() => {
  let resultado = historialFotos.value

  if (filtroEstatus.value !== 'TODOS') {
    resultado = resultado.filter(f => f.estatus === filtroEstatus.value)
  }

  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    resultado = resultado.filter(f =>
      f.nombre.toLowerCase().includes(q) ||
      f.vehiculo_identificador.toLowerCase().includes(q)
    )
  }

  return resultado
})

const historialFotos = ref([])

const cargarMisSolicitudes = async () => {
  try {
    loading.value = true

    const [dataSoli, dataFotos] = await Promise.all([
      clienteAxios.get('solicitudes-edicion/'),
      
      clienteAxios.get('fotos/?es_solicitud=true')
    ])

    historialSolicitudes.value = dataSoli.data
      .filter(s => Number(s.usuario_solicito) === Number(auth.user_id))
      .map(s => ({
        id: s.id,
        campo_afectado: s.campo_afectado,
        vehiculo_identificador: s.folio_ingreso || `Ingreso #${s.registro_id}`,
        valor_viejo: s.valor_viejo || 'Sin dato',
        valor_nuevo: s.valor_nuevo || 'Archivo adjunto',
        justificacion: s.justificacion,
        estatus: s.estatus,
        fecha_solicitud: new Date(s.fecha_solicitud).toLocaleDateString('es-MX', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        usuario_acepto: s.admin_nombre || null,
        motivo_rechazo: s.motivo_rechazo || null
      }))

    historialFotos.value = dataFotos.data.map(f => ({
      id: f.id,
      nombre: f.nombre || 'Sin etiqueta',
      vehiculo_identificador: `Ingreso #${f.ingreso}`,
      justificacion: f.justificacion || 'Sin justificación',
      estatus: f.estatus,
      foto: f.foto,
      fecha_subida: new Date(f.fecha_subida).toLocaleDateString('es-MX', {
        day: '2-digit', month: 'short', year: 'numeric'
      }),
      motivo_rechazo: f.motivo_rechazo || null
    }))

  } catch (error) {
    console.error("Error:", error)
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  cargarMisSolicitudes()
  pollingInterval = setInterval(cargarMisSolicitudes, 15000)
})

onUnmounted(() => {
  clearInterval(pollingInterval)
})

</script>