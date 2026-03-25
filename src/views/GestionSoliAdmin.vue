<template>
  <div class="p-4 md:p-10 bg-slate-50 min-h-screen relative overflow-x-hidden">
    
    <!-- CABECERA DE LA VISTA -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
      <div>
        <span class="text-[10px] font-black text-primario uppercase tracking-[0.3em]">Administrador</span>
        <h1 class="text-4xl font-black text-slate-800 tracking-tighter uppercase mt-2">Aprobación de Ediciones</h1>
        <p class="text-slate-400 font-medium text-sm mt-1">Revisa la evidencia y dictamina las correcciones de tu sede.</p>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto">
        <!-- Barra de Búsqueda -->
        <div class="relative flex-1 md:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4">
          <MagnifyingGlassIcon class="w-5 h-5 text-slate-300" />
          <input 
            v-model="busqueda"
            type="text" 
            placeholder="Buscar por operador o campo..." 
            class="w-full bg-transparent border-none py-4 text-xs font-black uppercase text-slate-700 outline-none ml-2 placeholder:text-slate-300"
          />
        </div>
        
        <!-- Filtro por Estado -->
        <select v-model="filtroActual" class="bg-white border text-xs font-black text-slate-600 border-slate-100 rounded-2xl py-4 px-6 shadow-sm outline-none uppercase cursor-pointer">
          <option value="TODAS">Todas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="ACEPTADA">Aceptadas</option>
          <option value="RECHAZADA">Rechazadas</option>
        </select>
      </div>
    </header> 

    <!-- ÁREA DE RESULTADOS -->
    <div v-if="filtradas.length === 0" class="bg-white p-14 rounded-[3rem] border border-dashed border-slate-200 text-center shadow-sm">
      <div class="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <InboxIcon class="w-10 h-10 text-slate-300" />
      </div>
      <p class="text-lg font-black text-slate-400 uppercase tracking-widest">Sin resultados</p>
      <p class="text-xs text-slate-400 mt-2 font-medium">No hay solicitudes pendientes o la búsqueda no coincide.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div v-for="sol in filtradas" :key="sol.id" 
          class="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm transition-all relative overflow-hidden flex flex-col justify-between group hover:shadow-xl">
        
        <div :class="['absolute left-0 top-0 bottom-0 w-2 transition-colors', getColorEstatus(sol.estatus).bgBorder]"></div>

        <div class="flex justify-between items-start mb-6 w-full">
          <div>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Campo Afectado</span>
            <h3 class="text-sm font-black text-slate-800 tracking-tight uppercase leading-tight">{{ sol.campo_afectado }}</h3>
            <p class="text-[9px] font-bold text-primario uppercase mt-1">De: <span class="font-black">@{{ sol.usuario_solicito }}</span></p>
          </div>
          <span :class="['px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-dashed flex items-center gap-2 shrink-0 ml-2', getColorEstatus(sol.estatus).badge]">
            <component :is="getColorEstatus(sol.estatus).icon" class="w-3 h-3" />
            <span class="hidden sm:inline">{{ sol.estatus }}</span>
          </span>
        </div>

        <div class="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-5 space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor Original</p>
              <p class="text-xs font-bold text-slate-600 line-through decoration-red-400/50 uppercase truncate" :title="sol.valor_viejo">{{ formatearValor(sol.valor_viejo) }}</p>
            </div>
            <div>
              <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Propuesta Nueva</p>
              <p class="text-xs font-black text-green-600 uppercase truncate" :title="sol.valor_nuevo">{{ formatearValor(sol.valor_nuevo) }}</p>
            </div>
          </div>
        </div>

        <div v-if="sol.evidencia_solicitud" class="mb-5">
          <p class="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Evidencia Adjunta:</p>
          <div class="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-100 group">
            <img :src="sol.evidencia_solicitud || 'ruta/a/tu/imagen/default.png'" class="w-full h-full object-cover group-hover:scale-110 transition-transform cursor-zoom-in" @click="verImagen(sol.evidencia_solicitud)" />
            <div @click="verImagen(sol.evidencia_solicitud)" class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-zoom-in">
               <span class="text-[8px] text-white font-black uppercase">Ampliar Foto</span>
            </div>
          </div>
        </div>

        <div class="flex-1 mb-6">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Justificación</p>
          <p class="text-xs text-slate-500 italic leading-relaxed font-medium">"{{ sol.justificacion }}"</p>
          
          <div v-if="sol.motivo_rechazo" class="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100">
             <p class="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Motivo del Rechazo:</p>
             <p class="text-[10px] text-red-600 font-bold leading-snug">{{ sol.motivo_rechazo }}</p>
          </div>
        </div>

        <!-- Acciones si es PENDIENTE -->
        <div v-if="sol.estatus === 'PENDIENTE'" class="pt-5 border-t border-slate-100 flex gap-3 mt-auto">
          <button 
            @click="abrirModalRechazo(sol)"
            class="flex-1 py-3 hover:bg-red-50 rounded-[1.2rem] border border-transparent text-[10px] font-black uppercase tracking-widest text-red-500 transition-all hover:border-red-100"
          >
            Rechazar
          </button>
          <button 
            @click="procesar(sol, 'ACEPTADA')"
            class="flex-1 py-3 bg-primario rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-900 transition-all shadow-xl shadow-primario/20"
          >
            Aprobar
          </button>
        </div>
        
        <!-- Fecha si ya fue dictaminada -->
        <div v-else class="flex justify-between items-center border-t border-slate-50 pt-4 mt-auto">
          <p class="text-[9px] font-black text-slate-300 tracking-widest uppercase">{{ sol.fecha_solicitud }}</p>
        </div>

      </div>
    </div>



    <!-- SECCIÓN FOTOS PENDIENTES -->
      <div class="mt-16">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <span class="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Evidencia Fotográfica</span>
            <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase mt-1">Fotos de Expedientes</h2>
          </div>

          <div class="flex items-center gap-4 w-full md:w-auto">
            <!-- Buscador -->
            <div class="relative flex-1 md:w-56 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4">
              <MagnifyingGlassIcon class="w-4 h-4 text-slate-300" />
              <input
                v-model="filtroBusquedaFotos"
                type="text"
                placeholder="Buscar por etiqueta..."
                class="w-full bg-transparent border-none py-3 text-xs font-black uppercase text-slate-700 outline-none ml-2 placeholder:text-slate-300"
              />
            </div>

            <!-- Filtro estatus -->
            <select v-model="filtroEstatusFotos" class="bg-white border text-xs font-black text-slate-600 border-slate-100 rounded-2xl py-3 px-5 shadow-sm outline-none uppercase cursor-pointer">
              <option value="TODAS">Todas</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="ACEPTADA">Aceptadas</option>
              <option value="RECHAZADA">Rechazadas</option>
            </select>
          </div>
        </div>

  <!-- Cambia fotosPendientes por fotosFiltradas -->
      <div v-if="fotosFiltradas.length === 0" class="bg-white p-14 rounded-[3rem] border border-dashed border-slate-200 text-center shadow-sm">
        <p class="text-lg font-black text-slate-400 uppercase tracking-widest">Sin resultados</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="foto in fotosFiltradas" :key="foto.id"
            class="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          
          <!-- Barra de color según estatus -->
          <div :class="['absolute left-0 top-0 bottom-0 w-2', 
            foto.estatus === 'PENDIENTE' ? 'bg-amber-400' : 
            foto.estatus === 'ACEPTADA' ? 'bg-green-400' : 'bg-red-400']">
          </div>

          <!-- Badge estatus -->
          <div class="flex justify-end">
            <span :class="['px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-dashed',
              foto.estatus === 'PENDIENTE' ? 'bg-amber-50 text-amber-600 border-amber-200' :
              foto.estatus === 'ACEPTADA' ? 'bg-green-50 text-green-600 border-green-200' :
              'bg-red-50 text-red-500 border-red-200']">
              {{ foto.estatus }}
            </span>
          </div>

          <div class="h-48 rounded-2xl overflow-hidden border border-slate-100 relative group cursor-zoom-in"
              @click="verImagen(foto.foto)">
            <img :src="foto.foto" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>

          <div>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Etiqueta</p>
            <p class="text-sm font-bold  text-primario uppercase mt-1">{{ foto.nombre }}</p>
            <p v-if="foto.justificacion" class="text-xs text-slate-500 italic mt-2">"{{ foto.justificacion }}"</p>
            <p class="text-sm font-black  text-primario/200 uppercase mt-1">{{foto.fecha_subida}}</p>
            <p v-if="foto.motivo_rechazo" class="text-xs text-red-500 font-bold mt-2 bg-red-50 p-2 rounded-xl">
              Rechazo: {{ foto.motivo_rechazo }}
            </p>
          </div>

          <!-- Acciones solo si PENDIENTE -->
          <div v-if="foto.estatus === 'PENDIENTE'" class="flex gap-3 pt-4 border-t border-slate-100">
            <button @click="rechazarFoto(foto)"
              class="flex-1 py-3 hover:bg-red-50 rounded-[1.2rem] text-[10px] font-black uppercase text-red-500 transition-all hover:border hover:border-red-100">
              Rechazar
            </button>
            <button @click="aprobarFoto(foto.id)"
              class="flex-1 py-3 bg-primario rounded-[1.2rem] text-[10px] font-black uppercase text-white shadow-xl shadow-primario/20">
              Aprobar
            </button>
          </div>
        </div>
      </div>
    </div>

      <!-- MODAL RECHAZO FOTO -->
      <div v-if="modalRechazoFoto" class="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
        <div class="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
          <h3 class="text-2xl font-black text-red-500 uppercase tracking-tighter mb-2">Rechazar Foto</h3>
          <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Indica la razón al operador</p>
          <textarea
            v-model="motivoFotoTemp"
            rows="4"
            placeholder="Ej: La foto no es clara o no corresponde al vehículo..."
            class="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-medium outline-none resize-none"
          ></textarea>
          <div class="flex gap-4 mt-8">
            <button @click="modalRechazoFoto = false" class="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase rounded-2xl hover:bg-slate-100">Cancelar</button>
            <button @click="confirmarRechazoFoto" class="flex-1 py-4 bg-red-600 text-white rounded-3xl text-[10px] font-black uppercase shadow-xl">Confirmar</button>
          </div>
        </div>
      </div>

    <!-- MODAL DE RECHAZO -->
    <div v-if="modalRechazo" class="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div class="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <h3 class="text-2xl font-black text-primario uppercase tracking-tighter mb-2">Rechazar Solicitud</h3>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Indica la razón para el operador</p>
        
        <textarea 
          v-model="motivoTemp" 
          rows="4" 
          placeholder="Ej: La evidencia no es clara o no corresponde al vehículo..."
          class="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-red-500/20 outline-none resize-none placeholder:text-slate-300"
        ></textarea>

        <div class="flex gap-4 mt-8">
          <button @click="modalRechazo = false" class="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all">Cancelar</button>
          <button @click="confirmarRechazo" class="flex-1 py-4 bg-red-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-200">Confirmar Rechazo</button>
        </div>
      </div>
    </div>
    <!-- VISOR DE IMAGEN -->
<div v-if="imagenVisor" 
     class="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
     @click.self="imagenVisor = null">
  <div class="relative max-w-4xl w-full flex flex-col items-center">
    <button @click="imagenVisor = null"
      class="absolute -top-10 right-0 text-white/70 hover:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
      <XMarkIcon class="w-5 h-5" /> Cerrar
    </button>
    <img :src="imagenVisor" class="max-h-[85vh] w-auto object-contain rounded-3xl" />
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted} from 'vue'
import { 
  MagnifyingGlassIcon, 
  InboxIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  XMarkIcon   
} from '@heroicons/vue/24/outline'

import clienteAxios from '../api/axios'

import Swal from 'sweetalert2'


const busqueda = ref('')
const filtroActual = ref('PENDIENTE')
const modalRechazo = ref(false)
const motivoTemp = ref('')
const solicitudAProcesar = ref(null)
const loading = ref(false)

const solicitudes = ref([])

const formatearValor = (valor) => {
  if (!valor) return 'N/A';
  if (valor === 'ARCHIVO_ADJUNTO') return '📷 Nueva Fotografía';
  
  try {
    const data = JSON.parse(valor);
    
    // Extraemos los valores sin importar si vienen en mayúsculas o minúsculas
    const desc = data.descripcion || data.DESCRIPCION;
    const cant = data.cantidad || data.CANTIDAD;
    const est = data.estado || data.ESTADO || data.estado_objeto;
    const parte = data.parte_vehiculo || data.PARTE_VEHICULO;

    // Si es un Objeto Personal
    if (desc !== undefined || cant !== undefined) {
      return `${desc || 'Objeto'} (${cant || 1} PZA) - ${est || ''}`;
    }
    // Si es un Daño
    if (parte !== undefined) {
      return `${parte}: ${desc || ''}`;
    }
    
    return valor; // Si de plano no entiende nada, muestra el texto original
  } catch (e) {
    return valor; // Si es texto normal (como el Número de Motor), lo regresa tal cual
  }
}
const filtradas = computed(() => {
  let resultado = solicitudes.value

  if (filtroActual.value !== 'TODAS') {
    resultado = resultado.filter(s => s.estatus === filtroActual.value)
  }

  if (busqueda.value.trim() !== '') {
    const q = busqueda.value.toLowerCase()
    resultado = resultado.filter(s => 
      s.campo_afectado.toLowerCase().includes(q) || 
      s.usuario_solicito.toLowerCase().includes(q) || 
      s.justificacion.toLowerCase().includes(q)
    )
  }

  return resultado
})




const getColorEstatus = (estatus) => {
  switch(estatus) {
    case 'PENDIENTE':
      return { bgBorder: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-600 border-yellow-200', icon: ClockIcon }
    case 'ACEPTADA':
      return { bgBorder: 'bg-green-400', badge: 'bg-green-50 text-green-600 border-green-200', icon: CheckCircleIcon }
    case 'RECHAZADA':
      return { bgBorder: 'bg-red-400', badge: 'bg-red-50 text-red-600 border-red-200', icon: XCircleIcon }
    default:
      return { bgBorder: 'bg-slate-400', badge: 'bg-slate-50 text-slate-600 border-slate-200', icon: ClockIcon }
  }
}

const abrirModalRechazo = (sol) => {
  solicitudAProcesar.value = sol
  motivoTemp.value = ''
  modalRechazo.value = true
}

const confirmarRechazo = async () => {
  if (motivoTemp.value.trim() === '') {
    Swal.fire({
      icon: 'error',
      title: 'Motivo requerido',
      text: 'Por favor, indica la razón del rechazo.',
      customClass: { popup: 'rounded-[2rem] border-slate-100 shadow-xl' }
    })
    return
  }

  try {
    loading.value = true
    // 1. Petición real al servidor
    await clienteAxios.post(`solicitudes-edicion/${solicitudAProcesar.value.id}/revisar/`, {
      estatus: 'RECHAZADA',
      motivo_rechazo: motivoTemp.value
    })

    modalRechazo.value = false
    
    // 2. Alerta bonita de éxito
    Swal.fire({
      icon: 'success',
      position: 'bottom-end',
      title: 'Solicitud rechazada!',
      showConfirmButton: false,
      timer: 2500,
      customClass: { popup: 'rounded-[2rem] border-slate-100 shadow-xl shadow-red-200' }
    })
    
    await cargarSolicitudes() // Refrescar lista
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error al rechazar' })
  } finally {
    loading.value = false
  }
}

const procesar = async (sol, nuevoEstado) => {
  const result = await Swal.fire({
    title: '¿Aprobar este cambio?',
    text: `Se actualizará el registro oficial.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aprobar solicitud',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'bg-primario text-white rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primario/30 hover:bg-indigo-900 transition-all',
      cancelButton: 'bg-slate-100 text-slate-600 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-slate-200 transition-all'
    }
  })

  if (result.isConfirmed) {
    try {
      loading.value = true
      // 3. Petición real al servidor
      await clienteAxios.post(`solicitudes-edicion/${sol.id}/revisar/`, { estatus: 'ACEPTADA' });

      
      
      await cargarSolicitudes()
      Swal.fire({
        icon: 'success',
        position: 'bottom-end',
        title: `¡Cambio Aplicado!`,
        showConfirmButton: false,
        timer: 2500,
        customClass: { popup: 'rounded-[2rem] border-slate-100 shadow-xl shadow-green-200' }
      })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error al procesar el cambio' })
    } finally {
      loading.value = false
    }
  }
}
const cargarSolicitudes = async () => {
  try {
    loading.value = true
    const timestamp = new Date().getTime()
    const { data } = await clienteAxios.get(`solicitudes-edicion/?t=${timestamp}`)
    solicitudes.value = data
  } catch (error) {
    console.error("Error al cargar auditoría:", error)
  } finally {
    loading.value = false
  }
}


// --- FOTOS PENDIENTES ---
const todasLasFotos = ref([])
const filtroBusquedaFotos = ref('')
const filtroEstatusFotos = ref('PENDIENTE')
const modalRechazoFoto = ref(false)
const motivoFotoTemp = ref('')  
const fotoAProcesar = ref(null)


const cargarFotosPendientes = async () => {
  try {
    const { data } = await clienteAxios.get('fotos/?es_solicitud=true')
    todasLasFotos.value = data
  } catch (error) {
    console.error("Error al cargar fotos:", error)
  }
}

const fotosFiltradas = computed(() => {
  let resultado = todasLasFotos.value

  if (filtroEstatusFotos.value !== 'TODAS') {
    resultado = resultado.filter(f => f.estatus === filtroEstatusFotos.value)
  }

  if (filtroBusquedaFotos.value.trim()) {
    const q = filtroBusquedaFotos.value.toLowerCase()
    resultado = resultado.filter(f =>
      f.nombre.toLowerCase().includes(q)
    )
  }

  return resultado
})

const aprobarFoto = async (fotoId) => {
  const result = await Swal.fire({
    title: '¿Aprobar esta foto?',
    text: 'Se publicará en el expediente.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aprobar',
    cancelButtonText: 'Cancelar',
  })
  if (!result.isConfirmed) return

  try {
    await clienteAxios.post(`fotos/${fotoId}/revisar/`, { decision: 'ACEPTAR' })
    await cargarFotosPendientes()
    Swal.fire({ icon: 'success', title: '¡Foto aprobada!', timer: 2000, showConfirmButton: false })
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error al aprobar' })
  }
}

const rechazarFoto = (foto) => {
  fotoAProcesar.value = foto
  motivoFotoTemp.value = ''
  modalRechazoFoto.value = true
}

const confirmarRechazoFoto = async () => {
  if (!motivoFotoTemp.value.trim()) {
    Swal.fire({ icon: 'error', title: 'Motivo requerido' })
    return
  }
  try {
    await clienteAxios.post(`fotos/${fotoAProcesar.value.id}/revisar/`, {
      decision: 'RECHAZAR',
      motivo_rechazo: motivoFotoTemp.value
    })
    modalRechazoFoto.value = false
    await cargarFotosPendientes()
    Swal.fire({ icon: 'success', title: '¡Foto rechazada!', timer: 2000, showConfirmButton: false })
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error al rechazar' })
  }
}

const imagenVisor = ref(null)
const verImagen = (url) => { imagenVisor.value = url }
onMounted(() => {
  cargarSolicitudes()
  cargarFotosPendientes()  // ← agregar esta línea
})

</script>