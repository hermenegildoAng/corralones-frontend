<template>
  <div class="p-4 md:p-10 space-y-8 font-sans text-slate-900 bg-white">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- HEADER -->
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-gray-100 pb-8">
        <div>
          <span class="text-[10px] font-black text-rosa-comp uppercase tracking-[0.3em]">Consulta de Movimientos</span>
          <h1 class="text-4xl font-black text-primario tracking-tighter uppercase mt-2">Bitácora</h1>
          <p class="text-slate-400 font-medium text-sm">Control de accesos, roles y asignación de sedes oficiales.</p>
        </div>
      </header>

      <!-- BARRA DE BÚSQUEDA + FILTROS -->
      <div class="bg-white border border-slate-100 rounded-4xl px-8 py-6 shadow-sm space-y-6">

        <!-- Búsqueda -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <MagnifyingGlassIcon class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="BUSCAR EN BITÁCORA..."
              class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-[11px] font-black text-slate-700 uppercase tracking-widest placeholder:text-slate-300 focus:outline-none focus:border-primario/40 focus:bg-white transition-all"
            />
          </div>

          <!-- Rango de fechas -->
          <div class="flex gap-3">
            <div class="relative">
              <CalendarIcon class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="fechaDesde"
                type="date"
                class="pl-9 pr-3 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-[10px] font-black text-slate-600 focus:outline-none focus:border-primario/40 focus:bg-white transition-all"
              />
            </div>
            <div class="relative">
              <CalendarIcon class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="fechaHasta"
                type="date"
                class="pl-9 pr-3 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-[10px] font-black text-slate-600 focus:outline-none focus:border-primario/40 focus:bg-white transition-all"
              />
            </div>
          </div>

          <!-- Botón limpiar -->
          <button
            @click="limpiarFiltros"
            class="px-6 py-3.5 rounded-2xl border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-rosa-comp hover:text-rosa-comp transition-all whitespace-nowrap"
          >
            Limpiar
          </button>
        </div>

        <!-- CHIPS de filtro según ROL -->
        <div class="flex flex-wrap gap-2">
          <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest self-center mr-2">Filtrar por:</span>

          <button
            v-for="filtro in filtrosDisponibles"
            :key="filtro.key"
            @click="toggleFiltro(filtro.key)"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border',
              filtrosActivos.includes(filtro.key)
                ? `${filtro.colorActivo} border-transparent shadow-sm`
                : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'
            ]"
          >
            <component :is="filtro.icon" class="w-3.5 h-3.5" />
            {{ filtro.label }}
            <span
              v-if="contarPorFiltro(filtro.key) > 0"
              :class="['text-[8px] px-1.5 py-0.5 rounded-full font-black', filtrosActivos.includes(filtro.key) ? 'bg-white/30' : 'bg-slate-200 text-slate-500']"
            >
              {{ contarPorFiltro(filtro.key) }}
            </span>
          </button>
        </div>

        <!-- Resumen resultados -->
        <div class="flex items-center justify-between pt-1 border-t border-slate-50">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {{ registrosFiltrados.length }} registro{{ registrosFiltrados.length !== 1 ? 's' : '' }} encontrado{{ registrosFiltrados.length !== 1 ? 's' : '' }}
          </span>
          <button
            @click="exportarCSV"
            class="flex items-center gap-2 text-[9px] font-black text-primario uppercase tracking-widest hover:text-rosa-comp transition-colors"
          >
            <ArrowDownTrayIcon class="w-3.5 h-3.5" />
            Exportar CSV
          </button>
        </div>
      </div>

      <!-- TABLA BITÁCORA -->
      <section class="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">

        <!-- Sin resultados -->
        <div v-if="registrosFiltrados.length === 0" class="py-24 flex flex-col items-center justify-center gap-4">
          <div class="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center">
            <MagnifyingGlassIcon class="w-7 h-7 text-slate-300" />
          </div>
          <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin registros para estos filtros</p>
        </div>

        <table v-else class="w-full text-left">
          <thead>
            <tr class="text-[9px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
              <th class="px-8 py-5">Usuario</th>
              <th class="px-4 py-5">Categoría</th>
              <th class="px-4 py-5">Acción</th>
              <th class="px-4 py-5">Detalle</th>
              <th class="px-4 py-5 text-right">Fecha / Hora</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="reg in registrosPaginados"
              :key="reg.id"
              class="group hover:bg-slate-50/60 transition-all"
            >
              <!-- Usuario -->
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                  <div
                    :class="['w-8 h-8 rounded-2xl flex items-center justify-center text-[9px] font-black text-white shrink-0', avatarColor(reg.rol)]"
                  >
                    {{ (reg.usuario || 'NA').slice(0,2).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-[11px] font-black text-slate-700 uppercase">{{ reg.usuario }}</p>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ reg.rol }}</p>
                  </div>
                </div>
              </td>

              <!-- Categoría chip -->
              <td class="px-4 py-5">
                <span
                  :class="['inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest', chipCategoria(reg.categoria).class]"
                >
                  <component :is="chipCategoria(reg.categoria).icon" class="w-3 h-3" />
                  {{ reg.categoria }}
                </span>
              </td>

              <!-- Acción -->
              <td class="px-4 py-5">
                <span class="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{{ reg.accion }}</span>
              </td>

              <!-- Detalle -->
              <td class="px-4 py-5 max-w-50">
                <span class="text-[10px] font-bold text-slate-400 uppercase line-clamp-2">{{ reg.detalle }}</span>
              </td>

              <!-- Fecha -->
              <td class="px-8 py-5 text-right">
                <p class="text-[10px] font-black text-slate-600 uppercase">{{ reg.fecha }}</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase italic">{{ reg.hora }}</p>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- PAGINADOR EXTERNO -->
<AppPaginator
  v-model="paginaActual"
  :total-paginas="totalPaginas"
  class="border-t border-slate-50"
/>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import Swal from 'sweetalert2'
import axios from 'axios'
import { onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  TruckIcon,
  UsersIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
  ClipboardDocumentCheckIcon,
  QrCodeIcon,
} from '@heroicons/vue/24/outline'
import AppPaginator from '../components/AppPaginator.vue'

const auth = useAuthStore()

// ─── ROL DETECTADO ───────────────────────────────────────────
const rol = computed(() => auth.rol || 'operador')

// ─── FILTROS DISPONIBLES POR ROL ─────────────────────────────
const filtrosPorRol = {
  superuser: [
    { key: 'corralón',       label: 'Corralones',          icon: BuildingStorefrontIcon,     colorActivo: 'bg-primario text-white' },
    { key: 'administrador',  label: 'Administradores',     icon: UsersIcon,                  colorActivo: 'bg-slate-800 text-white' },
    { key: 'operador',       label: 'Operadores',          icon: ShieldCheckIcon,            colorActivo: 'bg-green-600 text-white' },
    { key: 'sistema',        label: 'Sistema',             icon: QrCodeIcon,                 colorActivo: 'bg-purple-600 text-white' },
  ],
  administrador: [
    { key: 'operador',       label: 'Operadores',          icon: UsersIcon,                  colorActivo: 'bg-primario text-white' },
    { key: 'vehículo',       label: 'Vehículos',           icon: TruckIcon,                  colorActivo: 'bg-slate-800 text-white' },
    { key: 'edición',        label: 'Sol. Edición',        icon: PencilSquareIcon,           colorActivo: 'bg-amber-500 text-white' },
    { key: 'inspección',     label: 'Inspecciones',        icon: ShieldCheckIcon,            colorActivo: 'bg-green-600 text-white' },
  ],
  operador: [
    { key: 'ingreso',        label: 'Ingresos',            icon: ArrowRightCircleIcon,       colorActivo: 'bg-green-600 text-white' },
    { key: 'salida',         label: 'Salidas',             icon: ArrowLeftCircleIcon,        colorActivo: 'bg-rosa-comp text-white' },
    { key: 'solicitud',      label: 'Sol. Aceptadas',      icon: ClipboardDocumentCheckIcon, colorActivo: 'bg-primario text-white' },
  ],
}

const filtrosDisponibles = computed(() => filtrosPorRol[rol.value] || filtrosPorRol.operador)

// ─── ESTADO DE FILTROS ────────────────────────────────────────
const searchQuery    = ref('')
const fechaDesde     = ref('')
const fechaHasta     = ref('')
const filtrosActivos = ref([])
const paginaActual   = ref(1)
const porPagina      = 12

const toggleFiltro = (key) => {
  const idx = filtrosActivos.value.indexOf(key)
  if (idx === -1) filtrosActivos.value.push(key)
  else filtrosActivos.value.splice(idx, 1)
  paginaActual.value = 1
}

const limpiarFiltros = () => {
  searchQuery.value    = ''
  fechaDesde.value     = ''
  fechaHasta.value     = ''
  filtrosActivos.value = []
  paginaActual.value   = 1
}

watch([searchQuery, fechaDesde, fechaHasta, filtrosActivos], () => {
  paginaActual.value = 1
})

// ─── DATOS & API ──────────────────────────────────────────────
const todosLosRegistros = ref([])

const mapCategoria = (tipo) => {
  tipo = tipo.toLowerCase()
  if (tipo.includes('vehículo')) return 'vehículo'
  if (tipo.includes('ingreso'))  return 'ingreso'
  if (tipo.includes('inspección')) return 'inspección'
  if (tipo.includes('daño'))     return 'vehículo'
  if (tipo.includes('creación')) return 'sistema'
  if (tipo.includes('edición'))  return 'edición'
  return 'sistema'
}

onMounted(async () => {
  try {
    const token = auth.token

    const res = await axios.get('http://127.0.0.1:8000/api/bitacora/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log('Respuesta:', res.data)  // ← confirma que llegan datos
    todosLosRegistros.value = res.data.map(item => ({
      id:        item.id,
      usuario:   item.usuario ?? 'Sistema',
      rol:       item.rol     ?? 'sistema',
      categoria: mapCategoria(item.tipo_evento),
      accion:    item.tipo_evento,
      detalle:   item.descripcion,
      fecha:     formatearFecha(item.fecha_evento),
      hora:      formatearHora(item.fecha_evento),
    }))

  } catch (error) {
    console.error('Status:', error.response?.status)
    console.error('Detalle:', error.response?.data)   // ← esto te dirá qué dice Django exactamente
  }
})
const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-MX')
const formatearHora  = (fecha) => new Date(fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

// ─── CATEGORÍAS VISIBLES POR ROL ─────────────────────────────
const categoriasPermitidas = computed(() => ({
  superuser:     ['corralón','administrador','operador','sistema'],
  administrador: ['operador','vehículo','edición','inspección'],
  operador:      ['ingreso','salida','solicitud'],
}[rol.value] || []))

// ─── FILTRADO ─────────────────────────────────────────────────
const registrosFiltrados = computed(() => {
  let lista = todosLosRegistros.value

  if (filtrosActivos.value.length > 0) {
    lista = lista.filter(r => filtrosActivos.value.includes(r.categoria))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    lista = lista.filter(r =>
      r.usuario.toLowerCase().includes(q)   ||
      r.accion.toLowerCase().includes(q)    ||
      r.detalle.toLowerCase().includes(q)   ||
      r.categoria.toLowerCase().includes(q)
    )
  }

  if (fechaDesde.value) {
    const desde = new Date(fechaDesde.value)
    lista = lista.filter(r => parseFecha(r.fecha) >= desde)
  }
  if (fechaHasta.value) {
    const hasta = new Date(fechaHasta.value)
    lista = lista.filter(r => parseFecha(r.fecha) <= hasta)
  }

  return lista
})

const parseFecha = (str) => {
  const meses = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }
  const [d, m, y] = str.split('/')
  return new Date(y, meses[m] ?? 0, parseInt(d))
}

const contarPorFiltro = (key) =>
  todosLosRegistros.value.filter(r =>
    categoriasPermitidas.value.includes(r.categoria) && r.categoria === key
  ).length

// ─── PAGINACIÓN ───────────────────────────────────────────────
const totalPaginas = computed(() => Math.ceil(registrosFiltrados.value.length / porPagina) || 1)

const registrosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return registrosFiltrados.value.slice(inicio, inicio + porPagina)
})

// ─── HELPERS VISUALES ────────────────────────────────────────
const avatarColor = (r) => ({
  superuser:     'bg-purple-600',
  administrador: 'bg-primario',
  operador:      'bg-green-600',
  sistema:       'bg-slate-600',
}[r] || 'bg-slate-400')

const chipCategoria = (cat) => {
  const map = {
    corralón:      { class: 'bg-primario/10 text-primario',       icon: BuildingStorefrontIcon },
    administrador: { class: 'bg-slate-100 text-slate-600',        icon: UsersIcon },
    sistema:       { class: 'bg-purple-50 text-purple-600',       icon: QrCodeIcon },
    operador:      { class: 'bg-green-50 text-green-700',         icon: UsersIcon },
    vehículo:      { class: 'bg-slate-100 text-slate-600',        icon: TruckIcon },
    edición:       { class: 'bg-amber-50 text-amber-600',         icon: PencilSquareIcon },
    inspección:    { class: 'bg-green-50 text-green-700',         icon: ShieldCheckIcon },
    ingreso:       { class: 'bg-green-50 text-green-700',         icon: ArrowRightCircleIcon },
    salida:        { class: 'bg-rosa-comp/10 text-rosa-comp',     icon: ArrowLeftCircleIcon },
    solicitud:     { class: 'bg-primario/10 text-primario',       icon: ClipboardDocumentCheckIcon },
  }
  return map[cat] || { class: 'bg-slate-100 text-slate-500', icon: ShieldCheckIcon }
}

// ─── EXPORTAR CSV ─────────────────────────────────────────────
const exportarCSV = () => {
  const headers = ['ID','Usuario','Rol','Categoría','Acción','Detalle','Fecha','Hora']
  const rows = registrosFiltrados.value.map(r =>
    [r.id, r.usuario, r.rol, r.categoria, r.accion, `"${r.detalle}"`, r.fecha, r.hora].join(',')
  )
  const csv  = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `bitacora_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)

  Swal.mixin({
    toast: true, position: 'bottom-end',
    showConfirmButton: false, timer: 2500, timerProgressBar: true,
    didOpen: (t) => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer },
  }).fire({ icon: 'info', iconColor: 'green', color: 'green', background: 'white', title: 'CSV exportado correctamente!' })
}
</script>