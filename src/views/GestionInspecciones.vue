<template>
  <div class="p-4 md:p-10 space-y-8 font-sans bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      
      <!-- CABECERA -->
      <header class="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-10 gap-6">
        <div>
          <span class="text-[10px] font-black text-primario uppercase tracking-[0.3em]">Auditoría de Sede</span>
          <h1 class="text-4xl font-black text-slate-800 tracking-tighter uppercase mt-2">Control de Inspecciones</h1>
          <p class="text-slate-400 font-medium text-sm mt-1">Historial y dictámenes de vehículos en resguardo.</p>
        </div>

        <div class="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          
          

          <!-- Barra Búsqueda -->
          <div class="relative flex-1 md:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4 w-full">
            <MagnifyingGlassIcon class="w-5 h-5 text-slate-300" />
            <input 
              v-model="busqueda"
              type="text" 
              placeholder="Buscar folio o vehículo..." 
              class="w-full bg-transparent border-none py-4 text-xs font-black uppercase text-slate-700 outline-none ml-2 placeholder:text-slate-300"
            />
          </div>
          
          <!-- Filtro Resultado -->
          <select v-model="filtroResultado" class="bg-white border text-xs font-black text-slate-600 border-slate-100 rounded-2xl py-4 px-6 shadow-sm outline-none uppercase cursor-pointer w-full md:w-auto">
            <option value="TODOS">Todos</option>
            <option value="APROBADO">Aprobados</option>
            <option value="OBSERVADO">Con Observaciones</option>
            <option value="RECHAZADO">Rechazados</option>
          </select>
        </div>
      </header>
      
      <!-- ESTADO VACÍO -->
      <div v-if="inspeccionesFiltradas.length === 0" class="bg-white p-14 rounded-[3rem] border border-dashed border-slate-200 text-center shadow-sm">
        <div class="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ClipboardDocumentListIcon class="w-10 h-10 text-slate-300" />
        </div>
        <p class="text-lg font-black text-slate-400 uppercase tracking-widest">Sin resultados</p>
        <p class="text-xs text-slate-400 mt-2 font-medium">Aún no hay inspecciones que coincidan con la búsqueda.</p>
      </div>

      <!-- GRID DE TARJETAS -->
      <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div 
          v-for="ins in inspeccionesFiltradas" 
          :key="ins.id"
          @click="irADetalles(ins.ingreso_id)"
          class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 cursor-pointer"
        >
          <!-- Semáforo -->
          <div :class="['w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-inner', getEstiloResultado(ins.resultado).bgIcono]">
             <component :is="getEstiloResultado(ins.resultado).icon" :class="['w-10 h-10', getEstiloResultado(ins.resultado).colorTexto]" />
          </div>

          <div class="flex-1 flex flex-col justify-center">
              <div class="flex justify-between items-start mb-2">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Vehículo / Folio</span>
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{{ ins.fecha }}</p>
              </div>
              
              <h3 class="text-sm font-black text-slate-800 uppercase tracking-tight mb-1 truncate" :title="ins.vehiculo">{{ ins.vehiculo }}</h3>
              <p class="text-xs font-bold text-slate-500 mb-2 truncate">{{ ins.folio }}</p>

              <div class="flex gap-4 border-t border-slate-100 pt-4 mt-auto items-center">
                 <p :class="['text-[10px] font-black uppercase tracking-widest', getEstiloResultado(ins.resultado).colorTexto]">
                    {{ ins.resultado }}
                 </p>
                 <div class="flex items-center gap-2 ml-auto">
                   <EyeIcon class="w-4 h-4 text-slate-300 group-hover:text-primario transition-colors" />
                   <span class="text-[9px] font-black text-slate-400 uppercase transition-colors group-hover:text-primario">Ver Ficha</span>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { EyeIcon, MagnifyingGlassIcon,  ClipboardDocumentListIcon, CheckBadgeIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'
import clienteAxios from '../api/axios'
import { useAuthStore } from '../stores/auth'
const router = useRouter()

const busqueda = ref('')
const filtroResultado = ref('TODOS')


const seleccion = ref({ folio: '...' })
let pollingInterval = null



const historial = ref([])
const auth = useAuthStore()



// Computed para manejar buscador y select
const inspeccionesFiltradas = computed(() => {
  let res = historial.value

  if (filtroResultado.value !== 'TODOS') {
    res = res.filter(ins => ins.resultado === filtroResultado.value) // ← fix
  }

  if (busqueda.value.trim() !== '') {
    const q = busqueda.value.toLowerCase()
    res = res.filter(i => 
      i.folio.toLowerCase().includes(q) || 
      i.vehiculo.toLowerCase().includes(q)
    )
  }

  return res
})

const getEstiloResultado = (res) => {
  switch (res) {
    case 'APROBADO':
      return { bgIcono: 'bg-green-50', colorTexto: 'text-green-500', icon: CheckBadgeIcon }
    case 'OBSERVADO':
      return { bgIcono: 'bg-yellow-50', colorTexto: 'text-yellow-500', icon: ExclamationTriangleIcon }
    case 'RECHAZADO':
      return { bgIcono: 'bg-red-50', colorTexto: 'text-red-500', icon: XCircleIcon }
    default:
      return { bgIcono: 'bg-slate-50', colorTexto: 'text-slate-500', icon: ClipboardDocumentListIcon }
  }
}

const cargarInspecciones = async () => {
  try {
    const res = await clienteAxios.get('/inspecciones/')
    historial.value = res.data
      .filter(ins => Number(ins.administrador) === Number(auth.user_id))
      .map(ins => ({
        id: ins.id,
        ingreso_id: ins.ingreso,
        resultado: ins.resultado,
        fecha: new Date(ins.fecha_revision).toLocaleString(),
        folio: ins.ingreso_data?.folio || `Ingreso #${ins.ingreso}`,
        vehiculo: ins.ingreso_data?.vehiculo || `Vehículo ${ins.ingreso}`
      }))
  } catch (e) {
    console.error(e)
  }
}

const irADetalles = (ingresoId) => {
  router.push(`/Detallesauto/${ingresoId}`)
}

onMounted(() => {
  cargarInspecciones()
  pollingInterval = setInterval(cargarInspecciones, 15000)
})

onUnmounted(() => {
  clearInterval(pollingInterval)
})
</script>