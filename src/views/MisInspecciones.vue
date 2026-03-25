<template>
  <div class="p-4 md:p-10 bg-slate-50 min-h-screen relative overflow-x-hidden">
    
    <!-- CABECERA -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
      <div>
        <span class="text-[10px] font-black text-primario uppercase tracking-[0.3em]">Operador</span>
        <h1 class="text-4xl font-black text-slate-800 tracking-tighter uppercase mt-2">Mis Inspecciones</h1>
        <p class="text-slate-400 font-medium text-sm mt-1">Dictámenes y revisiones enviadas por el administrador de sede.</p>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto">
        <!-- Barra Búsqueda -->
        <div class="relative flex-1 md:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4">
          <MagnifyingGlassIcon class="w-5 h-5 text-slate-300" />
          <input 
            v-model="busqueda"
            type="text" 
            placeholder="Buscar por folio o admin..." 
            class="w-full bg-transparent border-none py-4 text-xs font-black uppercase text-slate-700 outline-none ml-2 placeholder:text-slate-300"
          />
        </div>
        
        <!-- Filtro Resultado -->
        <select v-model="filtroResultado" class="bg-white border text-xs font-black text-slate-600 border-slate-100 rounded-2xl py-4 px-6 shadow-sm outline-none uppercase cursor-pointer">
          <option value="TODOS">Todos</option>
          <option value="APROBADO">Aprobados</option>
          <option value="OBSERVADO">Con Observaciones</option>
          <option value="RECHAZADO">Rechazados</option>
        </select>
      </div>
    </header>

    <!-- ÁREA CENTRAL (GRIDS) -->
    <div v-if="inspeccionesFiltradas.length === 0" class="bg-white p-14 rounded-[3rem] border border-dashed border-slate-200 text-center shadow-sm">
      <div class="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <ClipboardDocumentListIcon class="w-10 h-10 text-slate-300" />
      </div>
      <p class="text-lg font-black text-slate-400 uppercase tracking-widest">Sin resultados</p>
      <p class="text-xs text-slate-400 mt-2 font-medium">Aún no tienes inspecciones o la búsqueda no coincide.</p>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      <!-- CARD DE INSPECCION -->
      <div 
        v-for="inspeccion in inspeccionesFiltradas" 
        :key="inspeccion.id"
        @click="verDetalle(inspeccion)"
        class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 cursor-pointer"
      >
        <!-- Icono Semáforo Central -->
        <div :class="['w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-inner', getEstiloResultado(inspeccion.resultado).bgIcono]">
           <component :is="getEstiloResultado(inspeccion.resultado).icon" :class="['w-10 h-10', getEstiloResultado(inspeccion.resultado).colorTexto]" />
        </div>

        <div class="flex-1 flex flex-col justify-center">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[9px] font-black text-primario uppercase tracking-widest block">Folio Ingreso</span>
              <p class="text-[10px] font-black text-primario uppercase tracking-tighter">{{ inspeccion.fecha_revision }}</p>
            </div>
            
            <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight mb-1">{{ inspeccion.folio }}</h3>
            
            <p :class="['text-xs font-black uppercase tracking-widest mb-4', getEstiloResultado(inspeccion.resultado).colorTexto]">
              {{ inspeccion.resultado }}
            </p>

            <!-- Mini stats de fallos/aciertos -->
            <div class="flex gap-4 border-t border-slate-100 pt-4 mt-auto">
               <div class="flex items-center gap-2">
                 <UserIcon class="w-4 h-4 text-slate-400" />
                 <span class="text-[10px] font-bold text-slate-500 uppercase">Por: <span class="text-primario">@{{ inspeccion.admin_username }}</span></span>
               </div>
               <div class="flex items-center gap-2 ml-auto">
                 <span class="text-[9px] font-black text-slate-400 uppercase transition-colors group-hover:text-primario">Click para leer detalles &rarr;</span>
               </div>
            </div>
        </div>
      </div>
    </div>


    <!-- DRAWER LATERAL DE DETALLES (SÓLO LECTURA) -->
    <transition name="drawer">
      <aside v-if="drawerDetalle && inspeccionActiva" class="fixed right-0 top-0 h-screen w-full md:w-112.5 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col p-10 overflow-y-auto">
        
        <div class="flex justify-between items-start mb-10">
          <div>
            <span class="text-[9px] font-black text-primario uppercase tracking-[0.4em]">Lectura de Auditoría</span>
            <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase mt-1">Dictamen Final</h2>
            <p class="text-sm font-bold text-slate-400 uppercase mt-2">FOLIO: <span class="text-primario">{{ inspeccionActiva.folio }}</span></p>
          </div>
          <button @click="cerrarDetalle" class="p-2 hover:bg-slate-50 rounded-xl transition-all">✕</button>
        </div>

        <div class="space-y-8">
          
          <!-- Lista de Checks -->
          <div class="space-y-4">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revisión de Parámetros</p>
            
            <div 
              v-for="(val, clave) in estructuraChecks" 
              :key="clave"
              class="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100"
            >
              <span class="text-[10px] font-black text-slate-600 uppercase">{{ val.label }}</span>
              <!-- Botón falso/Read-Only -->
              <div :class="['w-10 h-5 rounded-full relative cursor-not-allowed opacity-80', inspeccionActiva[clave] ? 'bg-primario' : 'bg-red-400']">
                <div :class="['absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm', inspeccionActiva[clave] ? 'left-6' : 'left-1']"></div>
              </div>
            </div>
          </div>

          <!-- Cuadro de Veredicto -->
          <div class="space-y-4">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultado Final</p>
            <div :class="['py-6 px-6 rounded-3xl border-2 text-center', getEstiloResultado(inspeccionActiva.resultado).bgBadge]">
               <p :class="['text-sm font-black uppercase tracking-widest', getEstiloResultado(inspeccionActiva.resultado).colorTexto]">
                 {{ inspeccionActiva.resultado }}
               </p>
            </div>
          </div>

          <!-- Comentarios -->
          <div class="space-y-4">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observaciones del Administrador</p>
            <div class="w-full bg-slate-50 border border-slate-100 rounded-4xl p-8">
               <p class="text-sm italic font-medium text-slate-600 leading-relaxed">
                 {{ inspeccionActiva.observaciones_admin || 'Sin observaciones adicionales registradas.' }}
               </p>
            </div>
          </div>

        </div>
      </aside>
    </transition>
    
    <!-- FONDO NEGRO PARA DRAWER -->
    <div v-if="drawerDetalle" @click="cerrarDetalle" class="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"></div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MagnifyingGlassIcon, ClipboardDocumentListIcon, CheckBadgeIcon, ExclamationTriangleIcon, XCircleIcon, UserIcon } from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'
import clienteAxios from '../api/axios'

const busqueda = ref('')
const filtroResultado = ref('TODOS')
const drawerDetalle = ref(false)
const inspeccionActiva = ref(null)
let pollingInterval = null
// DATA SIMULADA BASADA EN EL MODELO "Inspeccion"
const misInspecciones = ref([])

const estructuraChecks = {
  identificacion_ok: { label: 'Datos ID (Placas/VIN) correctos' },
  inventario_ok: { label: 'Inventario físico verificado' },
  estado_fisico_ok: { label: 'Daños físicos validados con fotos' },
  documentacion_ok: { label: 'Documentación legible' }
}

const inspeccionesFiltradas = computed(() => {
  let resultado = misInspecciones.value

  if (filtroResultado.value !== 'TODOS') {
    resultado = resultado.filter(i => i.resultado === filtroResultado.value)
  }

  if (busqueda.value.trim() !== '') {
    const q = busqueda.value.toLowerCase()
    resultado = resultado.filter(i => 
      i.folio.toLowerCase().includes(q) || 
      i.administrador.toLowerCase().includes(q)
    )
  }

  return resultado
})

const verDetalle = (ins) => {
  inspeccionActiva.value = ins
  drawerDetalle.value = true
}

const cerrarDetalle = () => {
  drawerDetalle.value = false
  setTimeout(() => { inspeccionActiva.value = null }, 300) // Limpieza suave
}

const cargarInspecciones = async () => {
  try {
    const { data } = await clienteAxios.get('inspecciones/')
    misInspecciones.value = data
    console.log('Inspecciones reales:', data)
  } catch (error) {
    console.error(error)
  }
}
const getEstiloResultado = (res) => {
  switch (res) {
    case 'APROBADO':
      return { bgIcono: 'bg-green-50', colorTexto: 'text-green-500', icon: CheckBadgeIcon, bgBadge: 'bg-green-50/50 border-green-200' }
    case 'OBSERVADO':
      return { bgIcono: 'bg-yellow-50', colorTexto: 'text-yellow-500', icon: ExclamationTriangleIcon, bgBadge: 'bg-yellow-50/50 border-yellow-200' }
    case 'RECHAZADO':
      return { bgIcono: 'bg-red-50', colorTexto: 'text-red-500', icon: XCircleIcon, bgBadge: 'bg-red-50/50 border-red-200' }
    default:
      return { bgIcono: 'bg-slate-50', colorTexto: 'text-slate-500', icon: ClipboardDocumentListIcon, bgBadge: 'bg-slate-50 border-slate-200' }
  }
}
onMounted(() => {
  cargarInspecciones()
  pollingInterval = setInterval(cargarInspecciones, 15000)
})

onUnmounted(() => {
  clearInterval(pollingInterval)
})



</script>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: transform 0.4s ease; }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
</style>
