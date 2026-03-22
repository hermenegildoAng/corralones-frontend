<template>
  <div class="bg-white p-6 rounded-3xl shadow-md">
    <h2 class="text-xl font-black mb-4">Vehículos por Depósito (%)</h2>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import clienteAxios from '../api/axios'

const chartRef = ref(null)
let chartInstance = null

const cargarDatos = async () => {
  try {
    const res = await clienteAxios.get('ingresos/')
    const ingresos = res.data

    if (!ingresos.length) {
      console.warn('No hay datos para la gráfica')
      return
    }

    // 🔹 Agrupar por depósito
    const conteo = {}

    ingresos.forEach(i => {
      const nombre = i.nombre_deposito || 'Sin depósito'
      conteo[nombre] = (conteo[nombre] || 0) + 1
    })

    // 🔹 CORRECCIÓN DE ACENTOS 🔥
    const labels = Object.keys(conteo).map(n => {
      try {
        return decodeURIComponent(escape(n))
      } catch {
        return n
      }
    })

    const valores = Object.values(conteo)

    const total = valores.reduce((a, b) => a + b, 0)

    const porcentajes = valores.map(v =>
      parseFloat(((v / total) * 100).toFixed(2))
    )

    crearGrafica(labels, porcentajes)

  } catch (error) {
    console.error('Error cargando datos:', error.response?.data || error)
  }
}

const crearGrafica = (labels, data) => {
  // 🔹 Evitar duplicar gráfica
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          label: '% Vehículos',
          data
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}%`
          }
        }
      }
    }
  })
}

onMounted(() => {
  cargarDatos()
})
</script>