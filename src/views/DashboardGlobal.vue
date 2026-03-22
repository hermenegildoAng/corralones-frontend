<template>
  <div class="p-4 md:p-10 font-sans bg-slate-50">
    <div class="max-w-7xl mx-auto">
      
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center  bg-white border border-slate-100 rounded-4xl px-8 py-6 shadow-sm gap-4">
      <div class="flex items-center gap-5">
        <div class="w-14 h-14 bg-primario text-white flex items-center justify-center rounded-2xl font-black shadow-lg shadow-primario/20 uppercase italic text-xl">
          OP
        </div>
        <div>
          <span class="text-[10px] font-black text-rosa-comp uppercase tracking-[0.3em]">Super Usuario</span>
          <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-tight">
            {{ auth.nombre_user || 'Usuario Operativo' }}
          </h2>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
             Sede: {{ 'Consulta Global' }}
          </p>
        </div>
      </div>
     

      <div class="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
        <div class="px-4 py-2 bg-white rounded-xl shadow-sm">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha Actual</p>
          <p class="text-xs font-black text-slate-700 capitalize">{{ today }}</p>
        </div>
        <div class="flex items-center gap-2 pr-4">
          <span class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
          <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">En Línea</span>
        </div>
      </div>
    </header>
    <br>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div class="group p-8 rounded-4xl border border-gray-100 bg-white hover:border-primario/20 hover:shadow-xl hover:shadow-primario/5 transition-all duration-500">
          <div class="w-12 h-12 bg-primario/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primario group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V11.107c0-.307-.125-.601-.348-.814l-3.026-2.89a1.125 1.125 0 0 0-.799-.34h-7.92V6.036a.625.625 0 0 0-.625-.625H7.29a.625.625 0 0 0-.625.625v1.352a.625.625 0 0 0 .625.625h1.583a.625.625 0 0 0 .625-.625V6.036M6.75 6.75h.75m-1.5 0h.008v.008H6v-.008Zm0-2.25h.008v.008H6V4.5Zm0 4.5h.008v.008H6V9Zm0 2.25h.008v.008H6v-.008Zm0 2.25h.008v.008H6v-.008ZM18 18V6.75m-2.25 11.25h.008v.008h-.008V18Zm0-2.25h.008v.008h-.008v-.008Zm0-2.25h.008v.008h-.008v-.008Zm0-2.25h.008v.008h-.008v-.008Zm0-2.25h.008v.008h-.008v-.008Z" /></svg>
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Total Vehículos</p>
          <h2 class="text-5xl font-black mt-2 tracking-tighter text-slate-800">{{ stats.total_vehiculos }}</h2>
        </div>

        <div class="group p-8 rounded-4xl border border-gray-100 bg-white hover:border-rosa-comp/20 hover:shadow-xl hover:shadow-rosa-comp/5 transition-all duration-500">
          <div class="w-12 h-12 bg-rosa-comp/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-rosa-comp group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A4.833 4.833 0 0 1 12 12a4.833 4.833 0 0 1-7.5-1.668V21h15Z" /></svg>
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Sedes Activas</p>
          <h2 class="text-5xl font-black mt-2 tracking-tighter text-slate-800">{{ stats.depositos_activos }}</h2>
        </div>

        <div class="group p-8 rounded-4xl border border-gray-100 bg-white hover:border-green-500/20 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500">
          <div class="w-12 h-12 bg-green-50/50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" /></svg>
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Altas Hoy</p>
          <h2 class="text-5xl font-black mt-2 tracking-tighter text-green-600">{{ stats.ingresos_hoy }}</h2>
        </div>
      </div>

      <section>
        <div class="flex items-center justify-between mb-8 px-2">
          <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Directorio de Corralones</h3>
          
        </div>
        <section class="flex flex-col lg:flex-row gap-3">
  <Graficas />
  <RankingDepositos />
  <PendientesDashboard />
</section>

      </section>

      

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import clienteAxios from '../api/axios'
import Graficas from '../components/Graficas.vue'
import RankingDepositos from '../components/RankingDepositos.vue'
import PendientesDashboard from '../components/PendientesDashboard.vue'

const auth = useAuthStore()
const stats = ref({ total_vehiculos: 0, depositos_activos: 0, ingresos_hoy: 0 })
const listaDepositos = ref([])

const loading = ref(false)




const today = new Date().toLocaleDateString('es-MX', { 
  weekday: 'long', 
  day: 'numeric', 
  month: 'long' 
})

const cargarDatos = async () => {
  try {
    const [resDeps, resIngresos] = await Promise.all([
      clienteAxios.get('depositos/'),
      clienteAxios.get('ingresos/')
    ])
    
    console.log('depositos:', resDeps.data)    // ← agregar
    console.log('ingresos:', resIngresos.data) // ← agregar
    
    listaDepositos.value = resDeps.data
    stats.value.depositos_activos = resDeps.data.length
    stats.value.total_vehiculos = resIngresos.data.length
    const hoy = new Date().toISOString().split('T')[0]
    stats.value.ingresos_hoy = resIngresos.data.filter(i => i.fecha_ingreso.includes(hoy)).length
  } catch (e) { 
    console.error("Error en Dashboard Global:", e) 
  }
}



onMounted(cargarDatos)
</script>