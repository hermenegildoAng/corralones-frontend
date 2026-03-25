<template>
  <div class="p-4 md:p-10 space-y-8 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto">

      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-[10px] font-black text-rosa-comp uppercase tracking-[0.2em]">Control de Activos</span>
          <h1 class="text-4xl font-black text-slate-800 tracking-tighter uppercase">Inventario de Unidades</h1>
          <p class="text-slate-500 text-sm font-medium mt-1">
            Sede: <span class="text-primario font-bold">{{ auth.nombre_deposito || 'Acceso Global' }}</span>
          </p>
        </div>

        <router-link v-if="auth.rol === 'OPERADOR'" to="/registrar" custom v-slot="{ navigate }">
          <button @click="navigate" class="flex items-center justify-center bg-primario text-white px-8 py-4 rounded-3xl hover:scale-105 transition-all shadow-lg shadow-primario/20 font-black text-[10px] uppercase tracking-widest gap-2">
            <PlusIcon class="w-5 h-5" /> Registrar Entrada
          </button>
        </router-link>
      </div>

      <!-- FILTROS -->
      <div class="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-4xl border border-slate-100 shadow-sm">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="search" type="text" placeholder="Buscar por folio, placa, marca o modelo..."
            class="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primario/20 transition-all" />
        </div>

        <div v-if="auth.rol === 'SUPER'" class="flex items-center gap-3 px-4">
          <span class="text-[10px] font-black text-slate-400 uppercase">Filtrar Sede:</span>
          <select v-model="filtroSede" class="bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primario/20">
            <option value="TODAS">TODAS</option>
            <option v-for="s in sedes" :key="s.id" :value="s.id">{{ s.nombre }}</option>
          </select>
        </div>
      </div>

      <!-- TABLA DESKTOP -->
      <div class="hidden md:block bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/50">
            <tr>
              <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehículo</th>
              <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Folio / Placas</th>
              <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Sede Asignada</th>
              <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus</th>
              <th class="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="ingreso in vehiculosPaginados" :key="ingreso.id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-black text-slate-800">{{ ingreso.vehiculo_detalle?.marca }}</span>
                  <span class="text-[11px] text-slate-400 font-bold uppercase">
                    {{ ingreso.vehiculo_detalle?.modelo }} ({{ ingreso.vehiculo_detalle?.anio }})
                  </span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col gap-1">
                  <span class="w-fit bg-slate-800 text-white px-3 py-1 rounded-lg text-[10px] font-mono font-black uppercase">
                    {{ ingreso.vehiculo_detalle?.placas }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="text-[11px] font-black text-slate-600 uppercase">{{ ingreso.nombre_deposito || 'Sin asignar' }}</span>
              </td>
              <td class="px-8 py-6">
                <span :class="claseEstatus(ingreso.vehiculo_detalle?.estatus_actual)" class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border">
                  {{ ingreso.vehiculo_detalle?.estatus_actual }}
                </span>
              </td>
              <td class="px-8 py-6 text-center">
                <button @click="verDetalles(ingreso.id)" class="p-2.5 text-slate-400 hover:text-primario hover:bg-primario/5 rounded-xl transition-all border border-slate-100 shadow-sm group-hover:border-primario/20">
                  <EyeIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>

            <!-- Sin resultados -->
            <tr v-if="filteredVehiculos.length === 0">
              <td colspan="5" class="px-8 py-16 text-center">
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">No se encontraron unidades en este depósito</p>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- PAGINADOR -->
        <AppPaginator
          v-if="totalPaginas > 1"
          v-model="paginaActual"
          :total-paginas="totalPaginas"
          class="border-t border-slate-50"
        />
      </div>

      <!-- CARDS MOBILE -->
      <div class="md:hidden space-y-4">
        <div v-for="ingreso in vehiculosPaginados" :key="ingreso.id"
          class="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div :class="ingreso.vehiculo_detalle?.estatus_actual === 'DENTRO' ? 'bg-green-500' : 'bg-blue-500'"
            class="absolute left-0 top-0 bottom-0 w-1.5"></div>

          <div class="flex justify-between items-start mb-4">
            <div>
              <span class="text-[10px] font-black text-primario">{{ ingreso.folio }}</span>
              <h3 class="font-black text-slate-800 text-sm uppercase">
                {{ ingreso.vehiculo_detalle?.marca }} {{ ingreso.vehiculo_detalle?.modelo }}
              </h3>
              <span class="bg-slate-800 text-white px-2 py-1 rounded-lg text-[10px] font-mono font-bold">
                {{ ingreso.vehiculo_detalle?.placas }}
              </span>
            </div>
            <button @click="verDetalles(ingreso.id)" class="p-3 bg-slate-50 rounded-2xl text-primario shadow-inner">
              <EyeIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
            <div>
              <p class="text-[9px] font-black text-slate-300 uppercase italic">Ubicación</p>
              <p class="text-[10px] font-bold text-slate-600 uppercase">{{ ingreso.nombre_deposito }}</p>
            </div>
            <div class="text-right">
              <p class="text-[9px] font-black text-slate-300 uppercase italic">Estado</p>
              <span :class="claseEstatus(ingreso.vehiculo_detalle?.estatus_actual)" class="text-[9px] font-black uppercase">
                {{ ingreso.vehiculo_detalle?.estatus_actual }}
              </span>
            </div>
          </div>
        </div>

        <!-- Paginador mobile -->
        <AppPaginator
          v-if="totalPaginas > 1"
          v-model="paginaActual"
          :total-paginas="totalPaginas"
          class="bg-white border border-slate-100 rounded-3xl shadow-sm"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import clienteAxios from '../api/axios'
import { PlusIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import AppPaginator from '../components/AppPaginator.vue'

const auth     = useAuthStore()
const router   = useRouter()
const search   = ref('')
const ingresos = ref([])
const sedes    = ref([])
const filtroSede = ref('TODAS')

// ─── PAGINACIÓN ───────────────────────────────────────────────
const porPagina    = 12
const paginaActual = ref(1)

// ─── CARGA DE DATOS ───────────────────────────────────────────
const cargarIngresos = async () => {
  try {
    const res = await clienteAxios.get('ingresos/')
    console.log('Datos recibidos:', res.data)
    ingresos.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const cargarSedes = async () => {
  if (auth.rol !== 'SUPER') return
  try {
    const res  = await clienteAxios.get('depositos/')
    sedes.value = res.data
  } catch (e) { console.error(e) }
}

// ─── FILTRADO ─────────────────────────────────────────────────
const filteredVehiculos = computed(() => {
  return ingresos.value.filter(ing => {
    const v           = ing.vehiculo_detalle || {}
    const searchLower = search.value.toLowerCase()

    const matchesSearch =
      (v.marca?.toLowerCase()   || '').includes(searchLower) ||
      (v.modelo?.toLowerCase()  || '').includes(searchLower) ||
      (v.placas?.toLowerCase()  || '').includes(searchLower) ||
      (ing.folio?.toLowerCase() || '').includes(searchLower)

    const matchesSede = auth.rol !== 'SUPER'
      || filtroSede.value === 'TODAS'
      || ing.deposito == filtroSede.value

    return matchesSearch && matchesSede
  })
})

// Reset página al filtrar
watch([search, filtroSede], () => { paginaActual.value = 1 })

// ─── PAGINACIÓN COMPUTED ──────────────────────────────────────
const totalPaginas = computed(() =>
  Math.ceil(filteredVehiculos.value.length / porPagina) || 1
)

const vehiculosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return filteredVehiculos.value.slice(inicio, inicio + porPagina)
})

// ─── HELPERS ──────────────────────────────────────────────────
const verDetalles = (id) => router.push(`/Detallesauto/${id}`)

const claseEstatus = (estatus) =>
  estatus === 'DENTRO'
    ? 'bg-green-50 text-green-600 border-green-100'
    : 'bg-blue-50 text-blue-600 border-blue-100'

let pollingInterval = null

onMounted(() => {
  cargarIngresos()
  cargarSedes()
  pollingInterval = setInterval(cargarIngresos, 15000)
})


</script>