<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
    <h2 class="text-lg font-black text-slate-800 mb-4">
      🚗 Vehículos por Tipo
    </h2>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import clienteAxios from '../api/axios'

const chartRef = ref(null)

// ─── Icono emoji por tipo de vehículo ────────────────────────
const iconoPorTipo = (tipo) => {
  const t = tipo.toLowerCase()
  if (t.includes('moto'))       return '🏍️'
  if (t.includes('camion'))     return '🚛'
  if (t.includes('camioneta'))  return '🛻'
  if (t.includes('pickup'))     return '🛻'
  if (t.includes('sedan'))      return '🚗'
  if (t.includes('suv'))        return '🚙'
  if (t.includes('hatchback'))  return '🚘'
  if (t.includes('deportivo'))  return '🏎️'
  if (t.includes('autobus'))    return '🚌'
  if (t.includes('van'))        return '🚐'
  if (t.includes('trailer'))    return '🚚'
  if (t.includes('electrico'))  return '⚡'
  return '🚗'
}

onMounted(async () => {
  try {
    const res = await clienteAxios.get('ingresos/')
    const ingresos = res.data

    const conteo = {}
    ingresos.forEach(i => {
      const tipo = i.vehiculo_detalle?.tipo_vehiculo || 'SIN CLASIFICAR'
      if (!conteo[tipo]) conteo[tipo] = 0
      conteo[tipo]++
    })

    const ordenado = Object.entries(conteo).sort((a, b) => b[1] - a[1])

    // Labels con icono incluido
    const labels = ordenado.map(([tipo]) => `${iconoPorTipo(tipo)}  ${tipo}`)
    const data   = ordenado.map(([, cant]) => cant)

    new Chart(chartRef.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Vehículos',
          data,
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
          borderRadius: 8,
        }]
      },
      options: {
        indexAxis: 'y',       // ✅ barras horizontales
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total   = ctx.dataset.data.reduce((a, b) => a + b, 0)
                const percent = ((ctx.raw / total) * 100).toFixed(1)
                return `  ${ctx.raw} unidades (${percent}%)`
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 13 }
            }
          }
        }
      }
    })

  } catch (error) {
    console.error('Error gráfica tipos:', error)
  }
})
</script>