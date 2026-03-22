<template>
  <div class="p-4 md:p-10 space-y-8">
    <div class="max-w-7xl mx-auto">
      
      <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
        <div>
          <span class="text-[10px] font-black text-rosa-comp uppercase tracking-[0.2em]">Expediente de Vehículo</span>
          <h1 class="text-4xl font-black text-slate-800 tracking-tighter uppercase">
            {{ datos.vehiculo.marca }} {{ datos.vehiculo.modelo }} 
            <span class="text-slate-300 font-light">{{ datos.vehiculo.anio }}</span>
          </h1>
        </div>
        <div class="flex gap-2">
          <span class="px-4 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
            ID: #{{ datos.vehiculo.num_serie.slice(-6) }}
          </span>
        </div>
      </header>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-8">
          
          <section class="bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div class="aspect-video w-full overflow-hidden rounded-[2rem] bg-slate-100 mb-2">
              <img src="https://images.unsplash.com/photo-1590362891175-9a744426d6b2?auto=format&fit=crop&q=80&w=1000" 
                   class="w-full h-full object-cover" alt="Vehículo" />
            </div>
            <div class="grid grid-cols-5 gap-2 p-1">
              <div v-for="i in 5" :key="i" class="aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primario transition-all">
                <img :src="`https://picsum.photos/seed/${i+20}/200`" class="object-cover w-full h-full opacity-80 hover:opacity-100" />
              </div>
            </div>
          </section>

          <section class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div class="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h2 class="font-black text-slate-700 uppercase text-xs tracking-widest">Ficha Técnica</h2>
              <span class="text-[10px] font-bold text-primario">DATOS VERIFICADOS</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="(item, index) in tablaDetalles" :key="index" class="group hover:bg-slate-50/50 transition-colors">
                    <td class="px-8 py-4 font-bold text-slate-400 uppercase text-[10px] w-1/3 tracking-wider">{{ item.label }}</td>
                    <td class="px-8 py-4 text-slate-700 font-black">{{ item.valor }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
            <h2 class="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">Información del Propietario</h2>
            <div class="flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2rem]">
              <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-white mb-4">👤</div>
              <p class="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Sin propietario vinculado al folio</p>
            </div>
          </section>
        </div>

        <div class="space-y-8">
          
          <section class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-primario/5 rounded-full -mr-12 -mt-12"></div>
            
            <h3 class="text-slate-400 text-[10px] uppercase tracking-widest font-black mb-1">Días en Resguardo</h3>
            <p class="text-6xl font-black text-slate-800 tracking-tighter mb-6">39</p>
            
            <div class="mb-10">
              <span class="text-[10px] uppercase font-black text-slate-300 block mb-2 tracking-widest">Estatus de Unidad</span>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 border border-green-100 rounded-xl text-[10px] font-black uppercase tracking-widest">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {{ datos.vehiculo.estatus_actual }}
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <button class="w-full py-4 bg-primario text-white rounded-2xl hover:bg-primario/90 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primario/20">
                Solicitar edición
              </button>
              <button class="w-full py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Exportar registro
              </button>

              <!-- ✅ Botón suspender/activar corralón -->
              <button 
                @click="toggleEstatusDeposito"
                :disabled="loadingSuspender"
                :class="[
                  'w-full py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
                  estatusDeposito === 'ACTIVO'
                    ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white border border-green-100'
                ]"
              >
                <span v-if="loadingSuspender" class="animate-spin">◌</span>
                <span v-else>{{ estatusDeposito === 'ACTIVO' ? '🚫 Suspender Corralón' : '✅ Reactivar Corralón' }}</span>
              </button>

              <button class="w-full py-4 bg-rosa-comp/10 text-rosa-comp rounded-2xl hover:bg-rosa-comp hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em]">
                Generar orden de salida
              </button>
            </div>
          </section>

          <section class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 class="font-black text-slate-800 uppercase text-xs tracking-widest mb-8">Historial</h2>
            <div class="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:w-0.5 before:bg-slate-100">
              <div class="relative pl-10 group">
                <div class="absolute left-0 top-1 w-4 h-4 bg-white border-4 border-primario rounded-full z-10"></div>
                <p class="font-black text-[11px] text-slate-800 uppercase tracking-tight">Ingreso al Depósito</p>
                <p class="text-[10px] text-slate-400 font-bold">15 MAR 2022 • 09:45 AM</p>
              </div>
              <div class="relative pl-10 group">
                <div class="absolute left-0 top-1 w-4 h-4 bg-white border-4 border-slate-300 rounded-full z-10 group-hover:border-primario transition-colors"></div>
                <p class="font-black text-[11px] text-slate-800 uppercase tracking-tight">Inspección de Daños</p>
                <p class="text-[10px] text-slate-400 font-bold">10 NOV 2023</p>
              </div>
              <div class="relative pl-10 group">
                <div class="absolute left-0 top-1 w-4 h-4 bg-white border-4 border-rosa-comp rounded-full z-10"></div>
                <p class="font-black text-[11px] text-slate-800 uppercase tracking-tight">Edición de Registro</p>
                <p class="text-[10px] text-slate-400 font-bold">05 ENE 2024</p>
                <p class="text-[9px] text-rosa-comp mt-1 font-bold italic uppercase">Corrección de VIN</p>
              </div>
            </div>
          </section>

          <section class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 class="font-black text-slate-800 uppercase text-xs tracking-widest mb-4">Observaciones</h2>
            <div class="w-full p-6 bg-slate-50 border border-slate-50 rounded-2xl text-xs text-slate-500 font-medium leading-relaxed italic">
              "{{ datos.detalles.observaciones_detalladas }}"
            </div>
          </section>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import clienteAxios from '../api/axios'
import Swal from 'sweetalert2'

const route = useRoute()

// ✅ Estado reactivo del estatus del depósito
const estatusDeposito = ref('ACTIVO')
const loadingSuspender = ref(false)

// ── Datos del vehículo (estáticos por ahora) ─────────────────────────────────
const datos = {
  vehiculo: {
    marca: "Toyota",
    modelo: "Hilux",
    anio: 2020,
    placas: "EW-92-212",
    num_serie: "7G56S46548",
    numero_motor: "46S46448S4",
    color_actual: "Blanco Perla",
    estatus_actual: "RESGUARDADO"
  },
  ingreso: {
    fecha_ingreso: "10/02/2026",
    presencia_factura: false,
    deposito_id: route.params.id  // ✅ ID del depósito desde la ruta
  },
  detalles: {
    kilometraje_odometro: 65000,
    tipo_transmision: "Automática",
    observaciones_detalladas: "Cuenta con un golpe en el lateral izquierdo, facia delantera desprendida un 10%."
  }
}

const tablaDetalles = [
  { label: 'Placas Oficiales',      valor: datos.vehiculo.placas },
  { label: 'Número de Serie (VIN)', valor: datos.vehiculo.num_serie },
  { label: 'Número de motor',       valor: datos.vehiculo.numero_motor },
  { label: 'Kilometraje',           valor: datos.detalles.kilometraje_odometro.toLocaleString() + ' KM' },
  { label: 'Color Actual',          valor: datos.vehiculo.color_actual },
  { label: 'Fecha de ingreso',      valor: datos.ingreso.fecha_ingreso },
  { label: 'Factura Original',      valor: datos.ingreso.presencia_factura ? 'SÍ' : 'NO' },
  { label: 'Transmisión',           valor: datos.detalles.tipo_transmision }
]

// ✅ Toggle suspender / reactivar corralón
// ✅ Toggle suspender / reactivar corralón con validación de registros
const toggleEstatusDeposito = async () => {
  const nuevoEstatus = estatusDeposito.value === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO'
  const accion = nuevoEstatus === 'SUSPENDIDO' ? 'suspender' : 'reactivar'

  // ✅ Solo validar si se va a SUSPENDER (reactivar siempre se permite)
  if (nuevoEstatus === 'SUSPENDIDO') {
    try {
      const res = await clienteAxios.get(`ingresos/?deposito=${datos.ingreso.deposito_id}`)
      const registros = res.data

      // ✅ Filtramos solo vehículos que siguen DENTRO
      const vehiculosDentro = registros.filter(r => r.vehiculo_detalle?.estatus_actual === 'DENTRO')

      if (vehiculosDentro.length > 0) {
        await Swal.fire({
          title: '🚫 No se puede suspender',
          html: `
            <p class="text-sm text-slate-600">
              Este corralón tiene 
              <span class="font-black text-red-500">${vehiculosDentro.length} vehículo(s) activo(s)</span> 
              en resguardo.
            </p>
            <p class="text-xs text-slate-400 mt-2">
              Libera o transfiere los vehículos antes de suspender el corralón.
            </p>
          `,
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#6366f1',
          customClass: {
            popup: 'rounded-[2rem] shadow-2xl',
            confirmButton: 'rounded-xl font-black text-[10px] uppercase tracking-widest px-6 py-3',
          }
        })
        return // ← Corta aquí, no continúa
      }

    } catch (err) {
      console.error('Error verificando registros:', err)
      await Swal.fire({
        title: 'Error de verificación',
        text: 'No se pudieron verificar los registros del corralón.',
        icon: 'error',
        customClass: { popup: 'rounded-[2rem] shadow-2xl' }
      })
      return
    }
  }

  // ── Confirmación normal ──────────────────────────────────────────────────
  const confirmacion = await Swal.fire({
    title: `¿${nuevoEstatus === 'SUSPENDIDO' ? 'Suspender' : 'Reactivar'} corralón?`,
    text: `Esta acción ${accion === 'suspender' ? 'bloqueará el acceso al corralón' : 'restaurará el acceso al corralón'}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: `Sí, ${accion}`,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: nuevoEstatus === 'SUSPENDIDO' ? '#ef4444' : '#22c55e',
    customClass: {
      popup: 'rounded-[2rem] shadow-2xl',
      confirmButton: 'rounded-xl font-black text-[10px] uppercase tracking-widest',
      cancelButton: 'rounded-xl font-black text-[10px] uppercase tracking-widest',
    }
  })

  if (!confirmacion.isConfirmed) return

  loadingSuspender.value = true
  try {
    await clienteAxios.patch(`depositos/${datos.ingreso.deposito_id}/`, {
      estatus_deposito: nuevoEstatus
    })

    estatusDeposito.value = nuevoEstatus

    Swal.fire({
      title: nuevoEstatus === 'SUSPENDIDO' ? '¡Corralón Suspendido!' : '¡Corralón Reactivado!',
      icon: nuevoEstatus === 'SUSPENDIDO' ? 'warning' : 'success',
      timer: 2000,
      showConfirmButton: false,
      customClass: { popup: 'rounded-[2rem] shadow-2xl' }
    })

  } catch (err) {
    console.error(err)
    Swal.fire({
      title: 'Error',
      text: 'No se pudo cambiar el estatus del corralón.',
      icon: 'error',
      customClass: { popup: 'rounded-[2rem] shadow-2xl' }
    })
  } finally {
    loadingSuspender.value = false
  }
}
</script>