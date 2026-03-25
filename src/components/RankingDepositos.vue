<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <UsersIcon class="w-6 h-6 text-indigo-600" />
        <h2 class="text-lg font-black text-slate-800 uppercase tracking-tight">
          Personal por Depósito
        </h2>
      </div>
      <div class="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
        <ShieldCheckIcon class="w-3.5 h-3.5 text-green-500" />
        SISTEMA GLOBAL
      </div>
    </div>

    <div v-if="estaCargando" class="flex flex-col items-center justify-center py-20 text-slate-400">
      <ArrowPathIcon class="w-10 h-10 animate-spin mb-3 text-indigo-500" />
      <p class="text-sm font-medium">Cruzando datos de inventario...</p>
    </div>

    <div v-show="!estaCargando" class="relative flex-grow min-h-[300px]">
      <canvas ref="chartRef"></canvas>
    </div>

    <div v-if="!estaCargando" class="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-50">
      <div class="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50">
        <p class="text-[10px] uppercase font-bold text-indigo-400 leading-none mb-1">Activos</p>
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-black text-indigo-700">{{ stats.activos }}</span>
          <span class="text-[10px] text-indigo-400 font-medium">sedes</span>
        </div>
      </div>
      <div class="bg-red-50/50 p-3 rounded-2xl border border-red-100/50">
        <p class="text-[10px] uppercase font-bold text-red-400 leading-none mb-1">Inactivos</p>
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-black text-red-700">{{ stats.inactivos }}</span>
          <span class="text-[10px] text-red-400 font-medium">sedes</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import Chart from 'chart.js/auto'
import clienteAxios from '../api/axios'
import { UsersIcon, ArrowPathIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

const chartRef = ref(null)
const estaCargando = ref(true)
const stats = reactive({ activos: 0, inactivos: 0 })
let chartInstance = null

// Paleta de colores profesionales (Tailwind 600)
const coloresDisponibles = [
  '#4f46e5', // Indigo
  '#0891b2', // Cyan
  '#0d9488', // Teal
  '#7c3aed', // Violet
  '#2563eb', // Blue
  '#db2777', // Pink
  '#ea580c', // Orange
];

onMounted(async () => {
  try {
    estaCargando.value = true
    const [resDep, resIng] = await Promise.all([
      clienteAxios.get('depositos/'),
      clienteAxios.get('ingresos/')
    ])

    const mapa = {}
    resDep.data.forEach(d => { mapa[d.nombre] = new Set() })

    resIng.data.forEach(i => {
      const nombre = i.nombre_deposito || i.deposito_detalle?.nombre
      const user = i.usuario || i.id
      if (nombre && mapa[nombre]) mapa[nombre].add(user)
    })

    const labels = Object.keys(mapa)
    const counts = labels.map(l => mapa[l].size)

    stats.activos = counts.filter(c => c > 0).length
    stats.inactivos = counts.filter(c => c === 0).length

    // Generar colores dinámicos
    const backgroundColors = counts.map((c, index) => {
      if (c === 0) return 'rgba(239, 68, 68, 0.15)'; // Rojo suave para inactivos
      return coloresDisponibles[index % coloresDisponibles.length]; // Rotar colores de la paleta
    });

    const borderColors = counts.map((c, index) => {
      if (c === 0) return '#ef4444'; // Rojo fuerte para inactivos
      return coloresDisponibles[index % coloresDisponibles.length];
    });

    if (chartInstance) chartInstance.destroy()

    chartInstance = new Chart(chartRef.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: counts.map(c => c > 0 ? 0 : 2),
          borderRadius: 10,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            callbacks: {
              label: (ctx) => ctx.raw === 0 ? ' Sin actividad reciente' : ` ${ctx.raw} usuario(s) activos`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              font: { size: 10, weight: '600' },
              color: '#64748b'
            }
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 10 } },
            grid: { color: '#f8fafc' }
          }
        },
        layout: { padding: { bottom: 10 } }
      }
    })
  } catch (e) {
    console.error(e)
  } finally {
    estaCargando.value = false
  }
})
</script>