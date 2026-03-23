<template>
  <div class="p-4 md:p-10 space-y-8 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto">

      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Administración</span>
          <h1 class="text-4xl font-black text-slate-800 tracking-tighter uppercase">Gestión de Depósitos</h1>
        </div>
        <button @click="abrirModalCrear"
          class="text-[10px] font-black text-white bg-primario px-6 py-3 rounded-full  cursor-pointer uppercase tracking-widest shadow-sm border border-primario-100">
          + AGREGAR DEPÓSITO
        </button>
      </div>

      <!-- FILTROS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-4 rounded-4xl border border-slate-100 shadow-sm">
        <div class="relative">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="search" type="text" placeholder="Buscar sede..."
            class="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primario/20" />
        </div>
        <select v-model="filtroEstatus" class="bg-slate-50 border-none rounded-2xl px-6 py-4 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primario/20">
          <option value="TODOS">TODOS LOS ESTATUS</option>
          <option value="ACTIVO">ACTIVO</option>
          <option value="SUSPENDIDO">SUSPENDIDO</option>
        </select>
      </div>

      <!-- TABLA -->
      <div class="hidden md:block bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/50">
            <tr>
              <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Sede / Ubicación</th>
              <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto</th>
              <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus</th>
              <th class="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="dep in depositosPaginados" :key="dep.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-black text-slate-800">{{ dep.nombre }}</span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase">{{ dep.municipio }}, {{ dep.estado }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-[11px] font-bold text-slate-600">{{ dep.correo || 'Sin correo' }}</span>
                  <span class="text-[10px] text-slate-400 font-medium">{{ dep.telefono || 'Sin tel.' }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span :class="claseEstatus(dep.estatus_deposito)" class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border">
                  {{ dep.estatus_deposito }}
                </span>
              </td>
              <td class="px-8 py-6 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="verDetalles(dep.id)" class="p-2.5 text-slate-400 hover:text-primario rounded-xl border border-slate-100 transition-all">
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button @click="abrirModalEditar(dep)" class="p-2.5 text-slate-400 hover:text-primario rounded-xl border border-slate-100 transition-all">
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Sin resultados -->
            <tr v-if="filteredDepositos.length === 0">
              <td colspan="4" class="px-8 py-16 text-center">
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin depósitos para estos filtros</p>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- PAGINADOR — dentro del contenedor de la tabla, con las props correctas -->
<AppPaginator
  v-model="paginaActual"
  :total-paginas="totalPaginas"
  class="border-t border-slate-50"
/>
      </div>



      <div class="md:hidden space-y-4">
  <div
    v-for="dep in depositosPaginados"
    :key="dep.id"
    class="bg-white rounded-4xl border border-slate-100 shadow-sm p-6"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <p class="text-sm font-black text-slate-800 uppercase">{{ dep.nombre }}</p>
        <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{{ dep.municipio }}, {{ dep.estado }}</p>
      </div>
      <span :class="claseEstatus(dep.estatus_deposito)" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ml-2">
        {{ dep.estatus_deposito }}
      </span>
    </div>

    <!-- Contacto -->
    <div class="space-y-1 border-t border-slate-50 pt-4 mb-4">
      <p class="text-[11px] font-bold text-slate-600">{{ dep.correo || 'Sin correo' }}</p>
      <p class="text-[10px] text-slate-400">{{ dep.telefono || 'Sin teléfono' }}</p>
    </div>

    <!-- Acciones -->
    <div class="flex gap-2 pt-2 border-t border-slate-50">
      <button @click="verDetalles(dep.id)"
        class="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primario hover:text-white transition-all border border-slate-100 text-[10px] font-black uppercase flex items-center justify-center gap-2">
        <EyeIcon class="w-4 h-4" /> Ver
      </button>
      <button @click="abrirModalEditar(dep)"
        class="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primario hover:text-white transition-all border border-slate-100 text-[10px] font-black uppercase flex items-center justify-center gap-2">
        <PencilSquareIcon class="w-4 h-4" /> Editar
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
      <div v-if="mostrarModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
        <div class="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl my-8 animate-in fade-in zoom-in duration-300">
          <div class="p-8 md:p-12">

            <div class="flex justify-between items-center mb-10">
              <div>
                
                <h2 class="text-3xl font-black text-slate-800 tracking-tighter uppercase mt-1">
                  {{ modoEdicion ? 'Actualizar Sede' : 'Nuevo Depósito' }}
                </h2>
              </div>
              <button @click="cerrarModal" class="text-slate-300 hover:text-red-500 transition-colors p-2 text-2xl">✕</button>
            </div>

            <form @submit.prevent="modoEdicion ? actualizarDeposito() : crearDeposito()" class="space-y-6">

              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nombre del Corralón *</label>
                <input v-model="nuevoDep.nombre" type="text" required
                  class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold text-slate-700 transition-all"
                  placeholder="Ej. Depósito Tlaxcala Centro">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">C.P. *</label>
                  <div class="relative">
                    <input v-model="nuevoDep.cp" type="text" maxlength="5" required
                      class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold text-slate-700 transition-all pr-12"
                      placeholder="77500">
                    <div class="absolute right-4 top-1/2 -translate-y-1/2">
                      <span v-if="loadingCP" class="animate-spin block w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full"></span>
                      <CheckCircleIcon v-if="cpValidado && !loadingCP" class="w-6 h-6 text-green-500 animate-in zoom-in" />
                      <ExclamationCircleIcon v-if="cpError && !loadingCP" class="w-6 h-6 text-red-500 animate-in shake" />
                    </div>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Estado</label>
                  <input v-model="nuevoDep.estado" type="text" readonly
                    class="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed outline-none">
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Municipio</label>
                  <input v-model="nuevoDep.municipio" type="text" readonly
                    class="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed outline-none">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Colonia *</label>
                  <select v-if="colonias.length > 0" v-model="nuevoDep.colonia"
                    class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none">
                    <option v-for="col in colonias" :key="col" :value="col">{{ col }}</option>
                  </select>
                  <input v-else v-model="nuevoDep.colonia" type="text" required
                    class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold text-slate-700 transition-all"
                    placeholder="Ingrese colonia">
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Calle y Número *</label>
                  <input v-model="nuevoDep.calle" type="text" required
                    class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold text-slate-700 transition-all"
                    placeholder="Av. Juárez #45">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Teléfono (10 dígitos) *</label>
                  <div class="relative">
                    <input
                      v-model="nuevoDep.telefono"
                      type="tel"
                      maxlength="10"
                      @input="nuevoDep.telefono = nuevoDep.telefono.replace(/\D/g, '').slice(0, 10)"
                      required
                      class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none font-bold text-slate-700 transition-all"
                      :class="nuevoDep.telefono.length > 0 && nuevoDep.telefono.length < 10 ? 'focus:ring-red-500/20 border border-red-100' : 'focus:ring-amber-500/20'"
                      placeholder="2461234567"
                    >
                    <span v-if="nuevoDep.telefono.length > 0"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black"
                      :class="nuevoDep.telefono.length === 10 ? 'text-green-500' : 'text-slate-300'">
                      {{ nuevoDep.telefono.length }}/10
                    </span>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Correo</label>
                  <input v-model="nuevoDep.correo" type="email"
                    class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold text-slate-700 transition-all"
                    placeholder="contacto@ejemplo.com">
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Estatus Operativo</label>
                <select v-model="nuevoDep.estatus_deposito"
                  class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold text-slate-700 transition-all uppercase text-[10px]">
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="SUSPENDIDO">SUSPENDIDO</option>
                </select>
              </div>

              <button type="submit" :disabled="loading"
                class="w-full bg-primario cursor-pointer text-white font-black py-6 rounded-4xl mt-4  transition-all uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-slate-100 disabled:opacity-50 active:scale-95">
                <span v-if="loading" class="animate-spin mr-2 inline-block">◌</span>
                {{ modoEdicion ? 'Actualizar Información' : 'Registrar Depósito' }}
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import clienteAxios from '../api/axios'
import Swal from 'sweetalert2'
import { EyeIcon, MagnifyingGlassIcon, PencilSquareIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid'
import AppPaginator from '../components/AppPaginator.vue'

const router = useRouter()

// ─── ESTADO ───────────────────────────────────────────────────
const sedes              = ref([])
const search             = ref('')
const filtroEstatus      = ref('TODOS')
const loading            = ref(false)
const mostrarModal       = ref(false)
const modoEdicion        = ref(false)
const depositoEditandoId = ref(null)
const loadingCP          = ref(false)
const cpValidado         = ref(false)
const cpError            = ref(false)
const colonias           = ref([])

const nuevoDep = ref({
  nombre: '', calle: '', colonia: '', cp: '', municipio: '',
  estado: '', telefono: '', correo: '', estatus_deposito: 'ACTIVO'
})

// ─── PAGINACIÓN ───────────────────────────────────────────────
const porPagina    = 12
const paginaActual = ref(1)

// ─── FILTRADO ─────────────────────────────────────────────────
const filteredDepositos = computed(() => {
  return sedes.value.filter(s => {
    const query             = search.value.toLowerCase()
    const coincideNombre    = (s.nombre?.toLowerCase()    || '').includes(query)
    const coincideMunicipio = (s.municipio?.toLowerCase() || '').includes(query)
    const coincideEstatus   = filtroEstatus.value === 'TODOS' || s.estatus_deposito === filtroEstatus.value
    return (coincideNombre || coincideMunicipio) && coincideEstatus
  })
})

// Reset página al filtrar
watch([search, filtroEstatus], () => { paginaActual.value = 1 })

// ─── PAGINACIÓN COMPUTED ──────────────────────────────────────
const totalPaginas = computed(() =>
  Math.ceil(filteredDepositos.value.length / porPagina) || 1
)

const depositosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return filteredDepositos.value.slice(inicio, inicio + porPagina)
})

// ─── AUTOCOMPLETADO CP ────────────────────────────────────────
watch(() => nuevoDep.value.cp, async (val) => {
  cpValidado.value = false
  cpError.value    = false
  if (val?.length === 5 && /^\d+$/.test(val)) {
    loadingCP.value = true
    try {
      const res  = await clienteAxios.get(`cp/${val}/`)
      const data = res.data
      nuevoDep.value.estado    = data.estado
      nuevoDep.value.municipio = data.municipio
      colonias.value           = data.colonias
      if (data.colonias.length > 0) nuevoDep.value.colonia = data.colonias[0]
      cpValidado.value = true
    } catch {
      cpError.value            = true
      nuevoDep.value.estado    = 'NO ENCONTRADO'
      nuevoDep.value.municipio = ''
      colonias.value           = []
    } finally {
      loadingCP.value = false
    }
  }
})

// ─── MÉTODOS ──────────────────────────────────────────────────
const limpiarFormulario = () => {
  nuevoDep.value = { nombre: '', calle: '', colonia: '', cp: '', municipio: '', estado: '', telefono: '', correo: '', estatus_deposito: 'ACTIVO' }
  cpValidado.value = false
  cpError.value    = false
  colonias.value   = []
}

const cargarDatos = async () => {
  try {
    const res   = await clienteAxios.get('depositos/')
    sedes.value = res.data
  } catch (e) { console.error(e) }
}

const abrirModalCrear = () => {
  modoEdicion.value = false
  limpiarFormulario()
  mostrarModal.value = true
}

const abrirModalEditar = (dep) => {
  modoEdicion.value        = true
  depositoEditandoId.value = dep.id
  nuevoDep.value           = { ...dep }
  cpValidado.value         = !!dep.cp
  mostrarModal.value       = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  setTimeout(limpiarFormulario, 300)
}

const crearDeposito = async () => {
  if (nuevoDep.value.telefono && nuevoDep.value.telefono.length !== 10) {
    Swal.fire('Atención', 'El teléfono debe tener 10 dígitos', 'warning')
    return
  }
  loading.value = true
  try {
    await clienteAxios.post('depositos/', nuevoDep.value)
    Swal.fire({ icon: 'success', title: 'Éxito', showConfirmButton: false, timer: 1500 })
    cerrarModal()
    await cargarDatos()
  } catch { Swal.fire('Error', 'No se pudo guardar', 'error') }
  finally   { loading.value = false }
}

const actualizarDeposito = async () => {
  loading.value = true
  try {
    await clienteAxios.patch(`depositos/${depositoEditandoId.value}/`, nuevoDep.value)
    Swal.fire({ icon: 'success', title: 'Actualizado', showConfirmButton: false, timer: 1500 })
    cerrarModal()
    await cargarDatos()
  } catch { Swal.fire('Error', 'No se pudo actualizar', 'error') }
  finally   { loading.value = false }
}

const claseEstatus = (estatus) =>
  estatus === 'ACTIVO'
    ? 'bg-green-50 text-green-600 border-green-100'
    : 'bg-red-50 text-red-600 border-red-100'

const verDetalles = (id) => router.push(`/deposito/${id}`)

onMounted(cargarDatos)
</script>

<style scoped>
.shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>