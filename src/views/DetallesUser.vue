<template>
  <div class="min-h-screen bg-white flex flex-col xl:flex-row p-4 md:p-10 gap-8 relative overflow-hidden font-sans pb-24">
    
    <!-- FONDO DECORATIVO -->
    <div class="absolute top-0 right-0 w-full h-100  z-0 -mx-4 md:-mx-10 rounded-b-[4rem]"></div>
    
    <button @click="router.back()" class="absolute top-10 left-6 md:top-8 md:left-10 z-20 flex items-center gap-2 text-slate-500 hover:text-primario transition-colors bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
      <ArrowLeftIcon class="w-4 h-4" />
      <span class="text-[10px] font-black uppercase tracking-widest">Regresar</span>
    </button>
    <!-- ===== BOTÓN DE REGRESO ===== -->
    
    <!-- ===== CARGANDO ===== -->
    <div v-if="loading" class="w-full flex-col flex items-center justify-center min-h-[60vh] z-10">
       <div class="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
       <p class="text-white text-xs font-black uppercase tracking-[0.2em] animate-pulse">Cargando expediente...</p>
    </div>

    <!-- ===== ERROR ===== -->
    <div v-else-if="error" class="w-full max-w-2xl mx-auto z-10 bg-white p-12 rounded-[3rem] shadow-2xl text-center mt-20">
      <ExclamationTriangleIcon class="w-16 h-16 text-red-500 mx-auto mb-6" />
      <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">Error al cargar perfil</h2>
      <p class="text-sm font-bold text-slate-500 mb-8">{{ error }}</p>
      <button @click="router.back()" class="bg-slate-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primario transition-all">Regresar</button>
    </div>

    <!-- ===== CONTENEDOR PRINCIPAL ===== -->
    <div v-else class="w-full flex flex-col xl:flex-row gap-8 z-10 mt-16 md:mt-24">
      
      <!-- LADO IZQUIERDO: PERFIL E IDENTIDAD -->
      <section class="w-full xl:w-4/12 flex flex-col space-y-8">
        
        <div class="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative group">
          
          <!-- Banner Superior -->
          <div :class="user.estatus_user === 'ACTIVO' ? 'bg-slate-800' : 'bg-red-900'" class="h-40 relative overflow-hidden transition-colors duration-500">
            <div class="absolute inset-0 opacity-20 bg-primario from-white via-transparent to-transparent"></div>
            
            <div class="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md"
                 :class="user.estatus_user === 'ACTIVO' ? 'bg-green-500/20 border-green-400/30 text-white' : 'bg-red-500/20 border-red-400/30 text-white'">
              <span class="w-2.5 h-2.5 rounded-full" :class="user.estatus_user === 'ACTIVO' ? 'bg-green-400 animate-pulse' : 'bg-red-400'"></span>
              <span class="text-[9px] font-black uppercase tracking-widest">{{ user.estatus_user }}</span>
            </div>
          </div>

          <!-- Avatar -->
          <div class="flex justify-center -mt-20 relative px-8">
            <div class="w-36 h-36 rounded-full border-8 border-white bg-slate-100 flex items-center justify-center shadow-inner overflow-hidden relative">
               <span class="text-5xl font-black text-slate-300">{{ user.username.charAt(0).toUpperCase() }}</span>
            </div>
          </div>

          <!-- Datos Principales -->
          <div class="p-8 pt-6 text-center space-y-4 border-b border-slate-50">
            <div>
              <h1 class="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-tight">{{ user.nombre_user }} {{ user.aPaterno_user }} {{ user.aMaterno_user }}</h1>
              <p class="text-[11px] font-black text-primario uppercase tracking-widest mt-1">@{{ user.username }}</p>
            </div>
            
            <div class="flex justify-center gap-2 flex-wrap">
              <span class="px-5 py-2 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border bg-slate-50 text-slate-600 border-slate-200">
                {{ user.rol }}
              </span>
            </div>
          </div>

          <!-- Información Detallada -->
          <div class="bg-slate-50 p-8 space-y-6">
             <div>
               <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Afiliación Activa</p>
               <div class="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                 <BuildingOfficeIcon class="w-6 h-6 text-primario shrink-0 mt-0.5" />
                 <div>
                   <p class="text-sm font-black text-slate-700 uppercase leading-snug">{{ deposito?.nombre || 'Acceso Global / Sin Sede' }}</p>
                   <p v-if="deposito" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ deposito.ubicacion }}</p>
                 </div>
               </div>
             </div>

             <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 h-3 truncate">Teléfono</p>
                  <p class="text-xs font-bold text-slate-700 truncate min-h-4">{{ user.telefono_user || 'N/A' }}</p>
                </div>
                <div class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                   <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 h-3 truncate">Email</p>
                  <p class="text-xs font-bold text-slate-700 truncate min-h-4">{{ user.email || 'N/A' }}</p>
                </div>
             </div>
             
             <!-- ZONA DE PELIGRO (Solo SUPER) -->
             <div v-if="auth.rol === 'SUPER' && user.id !== auth.user_id" class="pt-6 border-t border-slate-200">
                <p class="text-[9px] font-black text-red-400 uppercase tracking-widest mb-4">Administración Superior</p>
                
                <button 
                  @click="cambiarEstatus"
                  :class="user.estatus_user === 'ACTIVO' ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border-green-100'"
                  class="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border flex items-center justify-center gap-2 group shadow-sm disabled:opacity-50"
                  :disabled="actualizando"
                >
                  <PowerIcon class="w-4 h-4" />
                  {{ actualizando ? 'Procesando...' : (user.estatus_user === 'ACTIVO' ? 'Suspender Acceso' : 'Reactivar Cuenta') }}
                </button>
             </div>
          </div>
        </div>
      </section>

      <!-- LADO DERECHO: HISTORIAL Y MÉTRICAS -->
      <section class="w-full xl:w-8/12 flex flex-col space-y-6">
        
        <!-- Tarjetas de Resumen (Métricas del usuario simuladas) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-6 md:p-8 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Ingresos Registrados</p>
              <p class="text-4xl font-black text-slate-800">{{ metricas.ingresos }}</p>
            </div>
            <div class="p-4 bg-primario/10 rounded-2xl"><TruckIcon class="w-8 h-8 text-primario"/></div>
          </div>
          
          <div class="bg-white p-6 md:p-8 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Inspecciones</p>
              <p class="text-4xl font-black text-slate-800">{{ metricas.inspecciones }}</p>
            </div>
            <div class="p-4 bg-indigo-50 rounded-2xl"><ShieldCheckIcon class="w-8 h-8 text-indigo-500"/></div>
          </div>

          <div class="bg-white p-6 md:p-8 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Solicitudes Edición</p>
              <p class="text-4xl font-black text-slate-800">{{ metricas.solicitudes }}</p>
            </div>
            <div class="p-4 bg-amber-50 rounded-2xl"><PencilSquareIcon class="w-8 h-8 text-amber-500"/></div>
          </div>
        </div>

        <!-- Tabla de Actividad Reciente -->
        <div class="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm flex-1 flex flex-col">
          <div class="flex justify-between items-center mb-10">
            <div>
              <h3 class="text-xl md:text-2xl font-black text-slate-800 tracking-tighter uppercase mb-1">Expediente de Actividad</h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Movimientos recientes realizados por {{ user.username }}</p>
            </div>
            <ClipboardDocumentListIcon class="w-8 h-8 text-slate-300 hidden sm:block" />
          </div>

          <div class="overflow-hidden flex-1">
            <template v-if="cargandoHistorial">
               <div class="flex flex-col items-center justify-center py-12 opacity-50">
                 <div class="w-8 h-8 border-4 border-slate-200 border-t-primario rounded-full animate-spin mb-4"></div>
                 <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronizando bitácora...</p>
               </div>
            </template>
            
            <template v-else-if="historial.length === 0">
               <div class="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                 <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                   <FolderMinusIcon class="w-8 h-8 text-slate-300" />
                 </div>
                 <h4 class="text-sm font-black text-slate-600 uppercase tracking-widest">Sin Actividad</h4>
                 <p class="text-xs font-bold text-slate-400 mt-2 max-w-xs">No se encontraron movimientos registrados recientemente por este usuario.</p>
               </div>
            </template>

            <table v-else class="w-full text-left min-w-125">
              <thead>
                <tr class="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                  <th class="px-6 py-4 rounded-tl-2xl">Tipo de Acción</th>
                  <th class="px-6 py-4">Detalle / Referencia</th>
                  <th class="px-6 py-4">Estado</th>
                  <th class="px-6 py-4 text-right rounded-tr-2xl">Fecha de Registro</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="(item, idx) in historial" :key="idx" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-xl" :class="item.bgIcon">
                        <component :is="item.icon" class="w-4 h-4" :class="item.textColor" />
                      </div>
                      <span class="text-xs font-black text-slate-700 uppercase">{{ item.tipo }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-5">
                    <span class="text-xs font-bold text-slate-600 uppercase">{{ item.referencia }}</span>
                  </td>
                  <td class="px-6 py-5">
                    <span class="px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border" :class="item.statusBadge">
                      {{ item.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-5 text-right">
                    <span class="text-[10px] font-medium text-slate-500 uppercase italic">{{ item.fecha }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-if="historial.length > 0" class="mt-8 pt-6 border-t border-slate-100 text-center">
             <router-link to="/bitacora" class="text-[9px] font-black text-primario hover:text-slate-800 uppercase tracking-[0.2em] transition-colors">
                Explorar Bitácora Global &rarr;
             </router-link>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import clienteAxios from '../api/axios'
import { 
  ArrowLeftIcon, BuildingOfficeIcon, PowerIcon, 
  ExclamationTriangleIcon, TruckIcon, ShieldCheckIcon, PencilSquareIcon, 
  ClipboardDocumentListIcon, FolderMinusIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const error = ref('')
const actualizando = ref(false)

const user = ref({})
const deposito = ref(null)

// Métricas e historial simulado a partir de llamadas
const metricas = ref({
  ingresos: 0,
  inspecciones: 0,
  solicitudes: 0
})

const cargandoHistorial = ref(true)
const historial = ref([])

const cargarDatosUsuario = async () => {
  try {
    loading.value = true
    const userId = route.params.id
    
    // 1. Obtener usuario
    const userRes = await clienteAxios.get(`usuarios/${userId}/`)
    user.value = userRes.data
    
    // 2. Si tiene depósito, buscar detalles adicionales (si no venían pre-poblados)
    if (user.value.id_deposito) {
       try {
           const depRes = await clienteAxios.get(`depositos/${user.value.id_deposito}/`)
           deposito.value = depRes.data
       } catch (e) {
           console.warn('No se pudo cargar detalles del deposito', e)
           // Usamos lo que venga en id_deposito_detalles si existe
           deposito.value = user.value.id_deposito_detalles || null
       }
    }

    // 3. Cargar actividad/métricas cruzando con endpoints globales (Filtro manual por ID)
    await compilarHistorial(userId)

  } catch (err) {
    console.error(err)
    error.value = "No se pudo localizar la información del usuario en el servidor o ha sido eliminado."
  } finally {
    loading.value = false
  }
}

const compilarHistorial = async (userId) => {
  cargandoHistorial.value = true
  const userNum = Number(userId)
  historial.value = []
  
  try {
    // Para no romper la UI si un endpoint falla, manejamos promesas con try-catch internos o Promise.allSettled
    const fetchSafe = async (url) => {
      try {
        const res = await clienteAxios.get(url)
        return res.data.results ? res.data.results : res.data
      } catch (e) {
        return []
      }
    }

    const [ingresos, solicitudes, inspecciones] = await Promise.all([
      fetchSafe('ingresos/'),
      fetchSafe('solicitudes-edicion/'),
      fetchSafe('inspecciones/')
    ])

    // Filtrar todo por el ID de este usuario
    const misIngresos = ingresos.filter(i => i.id_usuario === userNum || i.usuario_relacionado === userNum || (i.id_usuario && i.id_usuario.id === userNum))
    const misSolis = solicitudes.filter(s => s.id_usuario === userNum || (s.id_usuario && s.id_usuario.id === userNum))
    const misInspecciones = inspecciones.filter(ins => ins.id_usuario === userNum || (ins.id_usuario && ins.id_usuario.id === userNum))

    // Asignar métricas
    metricas.value = {
      ingresos: misIngresos.length,
      solicitudes: misSolis.length,
      inspecciones: misInspecciones.length
    }

    // Compilar un "feed" (tomar maximo 5-10 de cada uno y ordenarlos)
    let feed = []

    misIngresos.slice(-4).forEach(ing => {
      feed.push({
        tipo: 'Ingreso',
        referencia: 'Folio: ' + (ing.folio || ing.id || 'N/A'),
        estado: 'Registrado',
        fecha: ing.fecha_ingreso || 'N/D',
        rawDate: new Date(ing.fecha_ingreso || 0),
        icon: TruckIcon,
        bgIcon: 'bg-primario/10', textColor: 'text-primario',
        statusBadge: 'bg-primario/5 text-primario border-primario/20'
      })
    })

    misSolis.slice(-4).forEach(soli => {
      feed.push({
        tipo: 'Edición',
        referencia: 'Campo: ' + (soli.campo_editado || 'Datos'),
        estado: soli.estatus || 'ENVIADO',
        fecha: soli.fecha_solicitud || 'N/D',
        rawDate: new Date(soli.fecha_solicitud || 0),
        icon: PencilSquareIcon,
        bgIcon: 'bg-amber-50', textColor: 'text-amber-500',
        statusBadge: 'bg-amber-50 text-amber-600 border-amber-200'
      })
    })

    misInspecciones.slice(-4).forEach(ins => {
      feed.push({
        tipo: 'Inspección',
        referencia: 'Doc ID: ' + (ins.id || 'N/A'),
        estado: ins.estado_dictamen || 'COMPLETADO',
        fecha: ins.fecha_inspeccion || 'N/D',
        rawDate: new Date(ins.fecha_inspeccion || 0),
        icon: ShieldCheckIcon,
        bgIcon: 'bg-indigo-50', textColor: 'text-indigo-500',
        statusBadge: 'bg-indigo-50 text-indigo-600 border-indigo-200'
      })
    })

    // Ordenar mixto por fecha lo más reciente arriba
    feed.sort((a, b) => b.rawDate - a.rawDate)
    
    historial.value = feed.slice(0, 8) // Mostrar ultimos 8

  } catch (error) {
    console.warn("Falla al compilar el historial detallado", error)
  } finally {
    cargandoHistorial.value = false
  }
}

const cambiarEstatus = async () => {
    if(!confirm(`¿Seguro que deseas ${user.value.estatus_user === 'ACTIVO' ? 'suspender' : 'reactivar'} el acceso a @${user.value.username}?`)) return
    
    actualizando.value = true
    const nuevoEstado = user.value.estatus_user === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO'
    
    try {
        await clienteAxios.patch(`usuarios/${user.value.id}/`, { estatus_user: nuevoEstado })
        user.value.estatus_user = nuevoEstado
    } catch (e) {
        alert('Ocurrió un error al intentar cambiar el nivel de acceso del usuario.')
    } finally {
        actualizando.value = false
    }
}

onMounted(() => {
  cargarDatosUsuario()
})
</script>
