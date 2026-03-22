<template>
  <div class="p-4 md:p-10 space-y-8 font-sans bg-slate-50 min-h-screen text-slate-900">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- HEADER -->
      <header class="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white border border-slate-100 rounded-4xl px-8 py-6 shadow-sm gap-6">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 bg-slate-800 text-white flex items-center justify-center rounded-2xl font-black shadow-lg shadow-slate-800/20 uppercase italic text-xl shrink-0">
            AD
          </div>
          <div>
            <span class="text-[10px] font-black text-primario uppercase tracking-[0.3em]">Administrador de Depósito</span>
            <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-tight mt-1">
              {{ auth.nombre_user || 'Admin Sistema' }}
            </h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
               Sede: {{ auth.nombre_deposito || 'Corralón Central' }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-full xl:w-auto">
          <router-link to="/usuarios" custom v-slot="{ navigate }">
            
          </router-link>
          <div class="px-6 py-3 bg-white rounded-xl shadow-sm hidden sm:block">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha Actual</p>
            <p class="text-xs font-black text-slate-700 capitalize">{{ today }}</p>
          </div>
          <div class="flex items-center gap-2 px-4">
            <span class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
            <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">En Línea</span>
          </div>
        </div>
      </header>

      <!-- INDICADORES GLOBALES (Suma Total) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in statsAdmin" :key="stat.label" 
             class="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-primario/20 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-6">
              <span :class="['p-3 rounded-2xl text-white shadow-lg', stat.color]">
                <component :is="stat.icon" class="w-5 h-5" />
              </span>
              <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sede Local</span>
            </div>
            <p class="text-5xl font-black text-slate-800 tracking-tighter leading-none">{{ stat.value }}</p>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{{ stat.label }}</p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-50">
            <router-link :to="stat.path" class="text-[9px] font-black text-primario uppercase tracking-[0.2em] hover:text-indigo-900 transition-colors flex items-center gap-2">
              {{ stat.linkText }} &rarr;
            </router-link>
          </div>
        </div>
      </div>

      <!-- PRODUCTIVIDAD / RENDIMIENTO (Tarjetas Compuestas) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <QRScanner />
        <!-- Gestión de Solicitudes -->
        <!-- Gestión de Solicitudes + Fotos -->
        <section class="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div class="absolute inset-x-0 bottom-0 h-1 bg-amber-400"></div>
          
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <PencilSquareIcon class="w-6 h-6 text-amber-500" />
            </div>
            <router-link to="/GestionSoli" class="text-[10px] font-black text-primario uppercase tracking-widest hover:underline bg-primario/5 px-4 py-2 rounded-full">
              Administrar Solicitudes
            </router-link>
          </div>

          <h3 class="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-2">Despacho de Ediciones</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Estado de las peticiones de operadores</p>
          
          <!-- Dividido en 2 columnas -->
          <div class="grid grid-cols-2 gap-4 mt-auto">
            
            <!-- Columna Solicitudes -->
            <div class="space-y-3">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Solicitudes de Edición</p>
              <div class="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
                <p class="text-3xl font-black text-slate-700">{{ conteoTotalSoli }}</p>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="bg-green-50 rounded-2xl p-3 text-center border border-green-100">
                  <p class="text-[8px] font-black text-green-600 uppercase mb-1">Acept.</p>
                  <p class="text-xl font-black text-green-700">{{ conteoSoliAceptadas }}</p>
                </div>
                <div class="bg-red-50 rounded-2xl p-3 text-center border border-red-100">
                  <p class="text-[8px] font-black text-red-500 uppercase mb-1">Rechaz.</p>
                  <p class="text-xl font-black text-red-600">{{ conteoSoliRechazadas }}</p>
                </div>
              </div>
            </div>

            <!-- Divisor vertical -->
            <div class="border-l border-slate-100 pl-4 space-y-3">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fotos Pendientes</p>
              <div class="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
                <p class="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Por Revisar</p>
                <p class="text-3xl font-black text-amber-700">{{ conteoFotosPendientes }}</p>
              </div>
              <div class="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                <p class="text-[8px] font-black text-slate-500 uppercase mb-1">Aprobadas hoy</p>
                <p class="text-xl font-black text-slate-700">{{ conteoFotosAprobadas }}</p>
              </div>
            </div>

          </div>
        </section>

        <!-- Gestión de Inspecciones -->
        <section class="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div class="absolute inset-x-0 bottom-0 h-1 bg-indigo-500"></div>
          
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <ClipboardDocumentCheckIcon class="w-6 h-6 text-indigo-500" />
            </div>
            <router-link to="/GestionInspecciones" class="text-[10px] font-black text-primario uppercase tracking-widest hover:underline bg-primario/5 px-4 py-2 rounded-full">
              Panel de Inspección
            </router-link>
          </div>

          <h3 class="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-2">Auditoría / Inspecciones</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Dictámenes realizados vs Observados</p>
          
          <div class="flex gap-4 mt-auto">
            <div class="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
              <div>
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Registradas</p>
                <p class="text-3xl font-black text-slate-700">{{ conteoInspecciones }}</p>
              </div>
              <ShieldCheckIcon class="w-10 h-10 text-slate-200" />
            </div>
            
            <div class="flex-1 flex flex-col space-y-2">
              <div class="flex justify-between items-center bg-green-50 px-5 py-3 rounded-xl border border-green-100 h-full">
                <span class="text-[9px] font-black text-green-700 uppercase tracking-widest">Aprobados</span>
                <span class="text-lg font-black text-green-700">{{ conteoInspAprobadas }}</span>
              </div>
              <div class="flex justify-between items-center bg-yellow-50 px-5 py-3 rounded-xl border border-yellow-100 h-full">
                <span class="text-[9px] font-black text-yellow-700 uppercase tracking-widest">Con Obs.</span>
                <span class="text-lg font-black text-yellow-700">{{ conteoInspObservadas }}</span>
              </div>
              <div class="flex justify-between items-center bg-red-50 px-5 py-3 rounded-xl border border-red-100 h-full">
                <span class="text-[9px] font-black text-red-600 uppercase tracking-widest">Rechazados</span>
                <span class="text-lg font-black text-red-600">{{ conteoInspRechazadas }}</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      <!-- ACTIVIDAD RECIENTE -->
      <section class="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
        <div class="flex justify-between items-center mb-10">
          <div>
            <h3 class="font-black text-slate-800 uppercase text-xl md:text-2xl tracking-tighter">Actividad Global</h3>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Últimos movimientos de todos los usuarios en Sede</p>
          </div>
          <router-link to="/bitacora" class="px-6 py-3 bg-primario border border-slate-100 text-[9px] font-black text-white uppercase tracking-[0.2em] rounded-2xl transition-all shadow-sm hidden sm:block">
            Explorar Bitácora Completa
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left min-w-175">
            <thead>
              <tr class="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                <th class="px-6 py-4 rounded-l-2xl">Usuario Operativo</th>
                <th class="px-6 py-4">Acción Realizada</th>
                <th class="px-6 py-4">Rol</th>
                <th class="px-6 py-4 text-right rounded-r-2xl">Fecha / Hora Local</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr class="hover:bg-slate-50/50 transition-all">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">AJ</div>
                    <span class="text-xs font-black text-slate-700 uppercase">Armando Jiménez</span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <span class="text-xs font-bold text-slate-600 uppercase tracking-tight">Registro de Unidad (XCD-21)</span>
                </td>
                <td class="px-6 py-5">
                   <span class="px-3 py-1 bg-primario/10 text-primario border border-primario/20 text-[8px] font-black uppercase tracking-widest rounded-full">Operador</span>
                </td>
                <td class="px-6 py-5 text-right">
                  <span class="text-[10px] font-medium text-slate-500 uppercase italic">Hace 5 minutos</span>
                </td>
              </tr>
              
              <tr class="hover:bg-slate-50/50 transition-all">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">MT</div>
                    <span class="text-xs font-black text-slate-700 uppercase">Miguel Torres</span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <span class="text-xs font-bold text-slate-600 uppercase tracking-tight">Dictamen de Inspección (Folio 04)</span>
                </td>
                <td class="px-6 py-5">
                   <span class="px-3 py-1 bg-slate-800 text-white text-[8px] font-black uppercase tracking-widest rounded-full">Admin</span>
                </td>
                <td class="px-6 py-5 text-right">
                  <span class="text-[10px] font-medium text-slate-500 uppercase italic">Hace 12 minutos</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import clienteAxios from '../api/axios'
import { 
  TruckIcon, 
  UsersIcon, 
  PencilSquareIcon, 
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

// --- ESTADO Y AUTH ---
const auth = useAuthStore()
const today = new Date().toLocaleDateString('es-MX', { 
  weekday: 'long', 
  day: 'numeric', 
  month: 'long' 
})
import QRScanner from '../components/QRScanner.vue'

// --- CONTADORES GLOBALES REACTIVOS ---
const conteoUnidades = ref(0)
const conteoOperadores = ref(0)
const conteoInspecciones = ref(0)
const conteoFotosPendientes = ref(0)
const conteoFotosAprobadas = ref(0)

const conteoInspAprobadas = ref(0)
const conteoInspObservadas = ref(0)
const conteoInspRechazadas = ref(0)

// --- MÁS MÉTRICAS ESPECÍFICAS (Solicitudes) ---
const conteoSolicitudesPendientes = ref(0)
const conteoSoliAceptadas = ref(0)
const conteoSoliRechazadas = ref(0)
const conteoTotalSoli = computed(() => conteoSolicitudesPendientes.value + conteoSoliAceptadas.value + conteoSoliRechazadas.value)

// --- CARGA DE DATOS REALES ---
const cargarEstadisticas = async () => {
  const fetchSafe = async (url) => {
    try {
      const res = await clienteAxios.get(url);
      return res.data.results ? res.data.results : res.data;
    } catch (e) {
      console.error(`Error en ${url}:`, e);
      return []; 
    }
  };

  const [dataInv, dataUser, dataSoli, dataInsp, dataFotos] = await Promise.all([
    fetchSafe('ingresos/'),
    fetchSafe('usuarios/'),
    fetchSafe('solicitudes-edicion/'),
    fetchSafe('inspecciones/'),
    fetchSafe('fotos/?es_solicitud=true')
  ]);

  conteoUnidades.value = dataInv.length || 0;
  conteoOperadores.value = dataUser.filter(u => u.rol === 'OPERADOR').length || 0;
  conteoInspecciones.value = dataInsp.length || 0
  conteoInspAprobadas.value = dataInsp.filter(i => i.resultado === 'APROBADO').length || 0
  conteoInspObservadas.value = dataInsp.filter(i => i.resultado === 'OBSERVADO').length || 0
  conteoInspRechazadas.value = dataInsp.filter(i => i.resultado === 'RECHAZADO').length || 0
  // Solicitudes:
  conteoFotosPendientes.value = dataFotos.filter(f => f.estatus === 'PENDIENTE').length || 0
  conteoFotosAprobadas.value = dataFotos.filter(f => f.estatus === 'ACEPTADA').length || 0
  conteoSolicitudesPendientes.value = dataSoli.filter(s => s.estatus === 'PENDIENTE').length || 0;
  conteoSoliAceptadas.value = dataSoli.filter(s => s.estatus === 'ACEPTADA' || s.estatus === 'APROBADO').length || 0;
  conteoSoliRechazadas.value = dataSoli.filter(s => s.estatus === 'RECHAZADA' || s.estatus === 'RECHAZADO').length || 0;
  // En cargarEstadisticas reemplaza las líneas de fotos por:
  
  conteoInspecciones.value = dataInsp.length || 0;
};

// --- ESTRUCTURA DE TARJETAS GLOBALES ---
const statsAdmin = computed(() => [
  { 
    label: 'Unidades Resguardadas', 
    value: conteoUnidades.value.toString().padStart(2, '0'), 
    icon: TruckIcon, 
    color: 'bg-primario', 
    path: '/inventario', 
    linkText: 'Ver Inventario Local' 
  },
  { 
    label: 'Operadores Registrados', 
    value: conteoOperadores.value.toString().padStart(2, '0'), 
    icon: UsersIcon, 
    color: 'bg-slate-800', 
    path: '/usuarios', 
    linkText: 'Ver Plantilla' 
  },
  { 
    label: 'Pendientes por Atender', 
    value: (conteoSolicitudesPendientes.value + conteoFotosPendientes.value).toString().padStart(2, '0'), 
    icon: PencilSquareIcon, 
    color: 'bg-amber-500', 
    path: '/GestionSoli', 
    linkText: 'Atender Peticiones' 
  },
  { 
    label: 'Total Inspecciones Realizadas', 
    value: conteoInspecciones.value.toString().padStart(2, '0'), 
    icon: ShieldCheckIcon, 
    color: 'bg-green-600', 
    path: '/GestionInspecciones', 
    linkText: 'Consultar Inspecciones' 
  }
])

onMounted(cargarEstadisticas)
</script>