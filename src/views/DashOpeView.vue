<template>
  <div class="p-4 md:p-10 space-y-8 font-sans bg-slate-50 min-h-screen">
    
    <!-- HEADER -->
    <header class="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white border border-slate-100 rounded-4xl px-8 py-6 shadow-sm gap-6">
      <div class="flex items-center gap-5">
        <div class="w-14 h-14 bg-primario text-white flex items-center justify-center rounded-2xl font-black shadow-lg shadow-primario/20 uppercase italic text-xl shrink-0">
          OP
        </div>
        <div>
          <span class="text-[10px] font-black text-primario uppercase tracking-[0.3em]">Operador de Turno</span>
          <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-tight mt-1">
            {{ auth.nombre_user || 'Usuario Operativo' }}
          </h2>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
             Sede: {{ auth.nombre_deposito || 'Corralón Central' }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-full xl:w-auto">
        <router-link v-if="auth.rol === 'OPERADOR'" to="/registrar" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            class="flex-1 xl:flex-none flex items-center justify-center bg-primario text-white px-8 py-4 rounded-xl hover:bg-indigo-900 transition-all shadow-lg shadow-primario/20 active:scale-95 font-black text-[10px] uppercase tracking-widest gap-2"
          >
            <PlusIcon class="w-5 h-5" /> 
            Registrar Ingreso
          </button>
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

    <!-- MÉTRICAS PRINCIPALES -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- 1. Ingresos Totales -->
      <section class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div class="absolute inset-x-0 bottom-0 h-1 bg-primario"></div>
        <div class="relative z-10 flex flex-col h-full">
          <div class="w-12 h-12 bg-primario/10 rounded-2xl flex items-center justify-center mb-6">
            <TruckIcon class="w-6 h-6 text-primario" />
          </div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Vehículos Ingresados</h3>
          <p class="text-5xl font-black text-slate-800 tracking-tighter">{{ conteoIngresos }}</p>
          <p class="text-xs font-bold text-slate-500 mt-4 leading-relaxed uppercase tracking-widest text-[9px] bg-slate-50 p-4 rounded-2xl border border-slate-100">
            Total de vehículos resguardados en tu sede actualmente.
          </p>
        </div>
      </section>

      <!-- 2. Solicitudes de Edición -->
      <section class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between relative">
        <div class="absolute inset-x-0 bottom-0 h-1 bg-amber-400"></div>
        <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
          <PencilSquareIcon class="w-6 h-6 text-amber-500" />
        </div>
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center justify-between">
          <span>Mis Solicitudes</span>
          <router-link to="/MisSolicitudes" class="text-primario hover:underline ml-2">Ver todas &rarr;</router-link>
        </h3>
        <p class="text-5xl font-black text-slate-800 tracking-tighter mb-6">{{conteoSolicitudes}}</p>
        
        <div class="grid grid-cols-3 gap-2 mt-auto">
          <div class="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
            <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Pendientes</p>
            <p class="text-lg font-black text-amber-600">{{ conteoSoliPendientes }}</p>
            
          </div>
          <div class="bg-green-50 rounded-xl p-3 text-center border border-green-100">
            <p class="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Aceptadas</p>
            <p class="text-lg font-black text-green-600">{{ conteoSoliAceptadas }}</p>
          </div>
          <div class="bg-red-50 rounded-xl p-3 text-center border border-red-100">
            <p class="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Rechazadas</p>
            <p class="text-lg font-black text-red-600">{{ conteoSoliRechazadas }}</p>
          </div>
        </div>
      </section>

      <!-- 3. Dictámenes de Inspección -->
      <section class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between relative">
         <div class="absolute inset-x-0 bottom-0 h-1 bg-indigo-500"></div>
         <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
           <ClipboardDocumentCheckIcon class="w-6 h-6 text-indigo-500" />
         </div>
         <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center justify-between">
           <span>Tus Inspecciones</span>
           <router-link to="/MisInspecciones" class="text-primario hover:underline ml-2">Revisar &rarr;</router-link>
         </h3>
         <p class="text-5xl font-black text-slate-800 tracking-tighter mb-6">{{ conteoInspecciones }}</p>

         <div class="space-y-2 mt-auto">
            <div class="flex justify-between items-center bg-green-50 px-4 py-2.5 rounded-xl border border-green-100">
              <span class="text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2"><CheckBadgeIcon class="w-4 h-4" /> Aprobados</span>
              <span class="text-xs font-black text-green-700">{{ conteoInspAprobadas }}</span>
            </div>
            <div class="flex justify-between items-center bg-yellow-50 px-4 py-2.5 rounded-xl border border-yellow-100">
              <span class="text-[9px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-2"><ExclamationTriangleIcon class="w-4 h-4" /> Con Detalles</span>
              <span class="text-xs font-black text-yellow-700">{{ conteoInspObservadas }}</span>
            </div>
            <div class="flex justify-between items-center bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
              <span class="text-[9px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2"><XCircleIcon class="w-4 h-4" /> Rechazados</span>
              <span class="text-xs font-black text-red-700">{{ conteoInspRechazadas }}</span>
            </div>
         </div>
      </section>

    </div>

    <!-- ACTIVIDAD RECIENTE -->
    <div class="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-sm">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-50 gap-4">
        <div>
          <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Actividad Reciente</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Últimos movimientos registrados por ti</p>
        </div>
        <router-link to="/bitacora" class="px-6 py-3 bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] rounded-2xl hover:bg-primario hover:text-white hover:border-primario transition-all shadow-sm">
          Ver Bitácora Completa
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left min-w-150">
          <thead>
            <tr class="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
              <th class="px-6 py-4 rounded-l-2xl">Operación</th>
              <th class="px-6 py-4">Folio / Placa</th>
              <th class="px-6 py-4">Status / Evento</th>
              <th class="px-6 py-4 text-right rounded-r-2xl">Fecha y Hora</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <!-- Simulación de Actividad -->
            <tr class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primario/10 rounded-lg"><TruckIcon class="w-4 h-4 text-primario" /></div>
                  <span class="text-xs font-black text-slate-700 uppercase">Nuevo Ingreso</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span class="text-xs font-black text-slate-600 uppercase">XAB-92</span>
              </td>
              <td class="px-6 py-5">
                <span class="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-[8px] font-black uppercase tracking-widest rounded-full">Registro Exitoso</span>
              </td>
              <td class="px-6 py-5 text-right font-medium text-xs text-slate-500">Hoy, 10:20 AM</td>
            </tr>

            <tr class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-amber-50 border border-amber-100 rounded-lg"><PencilSquareIcon class="w-4 h-4 text-amber-500" /></div>
                  <span class="text-xs font-black text-slate-700 uppercase">Envió Solicitud</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span class="text-[10px] font-bold text-slate-500 uppercase">Cambio Placa (TLA-11)</span>
              </td>
              <td class="px-6 py-5">
                <span class="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 text-[8px] font-black uppercase tracking-widest rounded-full">Pendiente Revisión</span>
              </td>
              <td class="px-6 py-5 text-right font-medium text-xs text-slate-500">Ayer, 16:40 PM</td>
            </tr>

            <tr class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-indigo-50 border border-indigo-100 rounded-lg"><ClipboardDocumentCheckIcon class="w-4 h-4 text-indigo-500" /></div>
                  <span class="text-xs font-black text-slate-700 uppercase">Inspección Leída</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span class="text-xs font-black text-slate-600 uppercase">SMyT-004</span>
              </td>
              <td class="px-6 py-5">
                <span class="px-3 py-1 bg-green-50 text-green-600 border border-green-200 text-[8px] font-black uppercase tracking-widest rounded-full">Dictamen Aprobado</span>
              </td>
              <td class="px-6 py-5 text-right font-medium text-xs text-slate-500">12 MAR, 09:15 AM</td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import clienteAxios from '../api/axios'
import { PlusIcon, PencilSquareIcon, TruckIcon, ClipboardDocumentCheckIcon, CheckBadgeIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

// --- CONTADORES ---
const conteoIngresos = ref(0)
const conteoSolicitudes = ref(0)
const conteoSoliPendientes = ref(0)
const conteoSoliAceptadas = ref(0)
const conteoSoliRechazadas = ref(0)
const conteoInspecciones = ref(0)
const conteoInspAprobadas = ref(0)
const conteoInspObservadas = ref(0)
const conteoInspRechazadas = ref(0)

const cargarDatos = async () => {
  const fetchSafe = async (url) => {
    try {
      const res = await clienteAxios.get(url)
      return res.data.results ? res.data.results : res.data
    } catch (e) {
      console.error(`Error en ${url}:`, e)
      return []
    }
  }

  const [dataIngresos, dataSolicitudes, dataInspecciones] = await Promise.all([
    fetchSafe('ingresos/'),
    fetchSafe('solicitudes-edicion/'),
    fetchSafe('inspecciones/')
  ])

  // Ingresos del operador logueado
  const misIngresos = dataIngresos.filter(i => Number(i.operador) === Number(auth.user_id))
  //conteoIngresos.value = misIngresos.length
  conteoIngresos.value = dataIngresos.length

  // Solicitudes del operador logueado
  const misSolicitudes = dataSolicitudes.filter(s => Number(s.usuario_solicito) === Number(auth.user_id))
  conteoSolicitudes.value = misSolicitudes.length
  conteoSoliPendientes.value = misSolicitudes.filter(s => s.estatus === 'PENDIENTE').length
  conteoSoliAceptadas.value = misSolicitudes.filter(s => s.estatus === 'ACEPTADA').length
  conteoSoliRechazadas.value = misSolicitudes.filter(s => s.estatus === 'RECHAZADA').length

  // Inspecciones — el operador las ve pero no las hace, filtramos por ingreso que le pertenece
  // Si el modelo de inspección tiene relación con ingreso y el ingreso tiene operador:
  conteoInspecciones.value = dataInspecciones.length
  conteoInspAprobadas.value = dataInspecciones.filter(i => i.resultado === 'APROBADO').length
  conteoInspObservadas.value = dataInspecciones.filter(i => i.resultado === 'OBSERVADO').length
  conteoInspRechazadas.value = dataInspecciones.filter(i => i.resultado === 'RECHAZADO').length
}

onMounted(cargarDatos)
</script>