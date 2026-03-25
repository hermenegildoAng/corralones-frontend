<template>
  <div class="p-4 md:p-10">
    <div class="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
      
      <header class="bg-primario p-10 text-white relative overflow-hidden">
        <div class="relative z-10">
          <span class="text-[10px] font-black text-rosa-comp uppercase tracking-[0.3em]">Protocolo de Recepción MSYT</span>
          <h1 class="text-3xl font-black tracking-tighter uppercase mt-2">Nuevo Ingreso Oficial</h1>
          
          <div class="flex items-center mt-10 gap-4">
            <div v-for="n in 4" :key="n" class="flex items-center gap-2">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 border-2',
                step >= n ? 'bg-white text-primario border-white' : 'bg-transparent text-white/40 border-white/20'
              ]">
                <span v-if="step > n">✓</span>
                <span v-else>{{ n }}</span>
              </div>
              <div v-if="n < 4" :class="['w-12 h-1 mx-1 rounded-full', step > n ? 'bg-white' : 'bg-white/20']"></div>
            </div>  
          </div>
        </div>
      </header>

      <div class="p-8 md:p-12 bg-white">
        <transition name="slide-fade" mode="out-in">
          
          <div v-if="step === 1" key="step1" class="space-y-8">
            <div class="border-l-4 border-primario pl-4 mb-8">
              <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight">1. Identificación de la Unidad</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Placas *</label>
                <input v-model="form.placas" placeholder="ABC-123" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
            erroresCampos.placas ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">VIN (Número de Serie) *</label>
                <input v-model="form.num_serie" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                  erroresCampos.placas ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Marca *</label>
                <input v-model="form.marca" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                                  erroresCampos.placas ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Submarca</label>
                <input v-model="form.submarca" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-3 font-bold uppercase" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Modelo *</label>
                <input v-model="form.modelo" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                                    erroresCampos.placas ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Año *</label>
                <input v-model.number="form.anio" type="number" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                                erroresCampos.placas ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Color Original *</label>
                <input v-model="form.color_original" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                                  erroresCampos.placas ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Color Actual</label>
                <input v-model="form.color_actual" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-3 font-bold" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Número de Motor *</label>
                <input v-model="form.numero_motor" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                            erroresCampos.placas ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Tipo de Vehículo *</label>
                <input v-model="form.tipo_vehiculo" placeholder="Ej. Sedán, SUV, Motocicleta" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                        erroresCampos.placas ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
              </div>
              
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Estatus REPUVE </label>
                <select v-model="form.repuve" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-3 font-black text-xs uppercase text-slate-700">
                  <option value="SIN REPORTE DE ROBO">Sin Reporte de Robo</option>
                  <option value="CON REPORTE DE ROBO">Con Reporte de Robo</option>
                  <option value="RECUPERADO">Recuperado</option>
                  <option value="DESCONOCIDO">Desconocido</option>
                </select>
              </div>
            </div>
          </div>

          <div v-else-if="step === 2" key="step2" class="space-y-8">
            <div class="border-l-4 border-rosa-comp pl-4 mb-8">
              <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight">2. Detalles de Ingreso</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Tipo de Registro *</label>
                <select v-model="form.tipo_registro" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black">
                  <option value="NUEVO">INGRESO ORDINARIO (NUEVO)</option>
                  <option value="INVENTARIO">CARGA DE INVENTARIO ACTUAL</option>
                </select>
              </div>
              <div class="space-y-2" v-if="form.tipo_registro === 'INVENTARIO'">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Folio Manual *</label>
                <input v-model="form.folio" placeholder="Ej. INV-2026-0001" class="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-black uppercase" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Autoridad que remite *</label>
                <input v-model="form.autoridad_ingreso" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                        erroresCampos.autoridad_ingreso ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
                      </div>
              <div class="space-y-2" v-if="form.tipo_registro === 'INVENTARIO'">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Fecha de Ingreso Original *</label>
                <input v-model="form.fecha_ingreso" type="date" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Lugar del Siniestro / Recolección *</label>
              <input v-model="form.lugar_siniestro" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                        erroresCampos.lugar_siniestro ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Motivo de Ingreso *</label>
              <input v-model="form.motivo_ingreso" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                        erroresCampos.motivo_ingreso ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
            </div>

            <div class="bg-slate-50 p-6 rounded-4xl space-y-4">
                <div class="flex items-center gap-4">
                  <input type="checkbox" v-model="form.presencia_factura" class="w-6 h-6 accent-primario" />
                  <span class="text-sm font-black text-slate-700 uppercase">¿Se entrega factura original?</span>
                </div>

                <div v-if="form.presencia_factura" class="animate-in fade-in slide-in-from-top-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-4">Cargar Archivo de Factura (PDF/Imagen)</label>
                  
                  <div class="relative group mt-2">
                    <div :class="[
                      'w-full p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 cursor-pointer',
                      form.factura_original ? 'border-green-500 bg-green-50/50' : 'border-slate-200 bg-white hover:border-primario/50'
                    ]">
                      <div :class="form.factura_original ? 'text-green-500' : 'text-slate-300'">
                          <svg v-if="form.factura_original" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                      </div>

                      <p :class="form.factura_original ? 'text-green-700' : 'text-slate-500'" class="text-[10px] font-black uppercase tracking-widest text-center">
                        {{ form.factura_original ? `Archivo: ${form.factura_original.name}` : 'Seleccionar archivo' }}
                      </p>
                      
                      <input 
                        type="file" 
                        @change="handleFactura" 
                        class="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*,application/pdf"
                      />
                    </div>
                    
                    <button 
                      v-if="form.factura_original" 
                      @click="form.factura_original = null" 
                      class="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>


            <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Servicio *</label>
                <select v-model="form.tipo_servicio" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                        erroresCampos.tipo_servicio ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']">
                  <option value="PARTICULAR">PARTICULAR</option>
                  <option value="PUBLICO">PÚBLICO</option>
                  <option value="ESPECIALIZADO">ESPECIALIZADO</option>
                </select>
              </div>
              <div class="border-t border-slate-100 pt-8 mt-8 space-y-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primario text-white flex items-center justify-center text-xs font-black">
                    <DocumentCheckIcon class="w-4 h-4 " />
                  </div>
                  <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Documentación Jurídica</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Condición Jurídica *</label>
                    <input v-model="form.condicion_juridica" type="text" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                        erroresCampos.condicion_juridica ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']">
                  
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Número de Oficio *</label>
                    <input v-model="form.num_oficio" placeholder="Ej. PGR/TLX/123/2026" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                        erroresCampos.num_oficio ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Fecha del Oficio *</label>
                    <input v-model="form.fecha_oficio" type="date" :class="['w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none uppercase',
                        erroresCampos.fecha_oficio ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primario/20']" />
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Cargar Documento *</label>
                    <div :class="[
                        'relative w-full rounded-2xl p-4 flex items-center gap-4 border border-dashed transition-all',
                        form.documento_oficio ? 'bg-green-50 border-green-500' : 'bg-slate-50 border-slate-200 hover:border-primario'
                      ]">
                      <input type="file" @change="handleDocumentoOficio" class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <DocumentIcon :class="['w-6 h-6', form.documento_oficio ? 'text-green-500' : 'text-slate-300']" />
                      <span class="text-[10px] font-black uppercase" :class="form.documento_oficio ? 'text-green-700' : 'text-slate-500'">
                        {{ form.documento_oficio ? form.documento_oficio.name : 'Seleccionar Oficio' }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Observaciones Legales</label>
                  <textarea v-model="form.observaciones" rows="2" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm outline-none resize-none" placeholder="Detalles adicionales del estatus legal..."></textarea>
                </div>
              </div>
          </div>

          <div v-else-if="step === 3" key="step3" class="space-y-8">
            <div class="border-l-4 border-amber-500 pl-4 mb-8">
              <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight">3. Estado Físico y Daños</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div v-for="l in ['aceite_motor', 'anticongelante', 'combustible']" :key="l" class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Nivel {{ l.replace('_', ' ') }}</label>
                  <select v-model="form['estatus_'+l]" class="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest">
                    <option v-for="opt in NIVEL_CHOICES" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Bolsas de Aire</label>
                  
                  <select v-model="form.estatus_bolsas_aire" class="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black">
                  <option value="INTACTAS">Intactas</option>
                  <option value="ACTIVADAS">Activadas </option>
                  <option value="NO_TIENE">No tiene</option>
                  <option value="DAÑADAS">Dañadas</option>
                </select>
                </div>
                
             </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-4xl">
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Carroceria</label>
                <select v-model="form.estatus_carroceria" class="w-full bg-white rounded-xl py-2 text-[10px] font-black"><option v-for="o in ESTADO_CHOICES" :key="o" :value="o">{{o}}</option></select>
              </div>
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Motor</label>
                <select v-model="form.estado_motor" class="w-full bg-white rounded-xl py-2 text-[10px] font-black"><option v-for="o in ESTADO_CHOICES" :key="o" :value="o">{{o}}</option></select>
              </div>
             <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Cristaeles</label>
                <select v-model="form.estatus_cristales" class="w-full bg-white rounded-xl py-2 text-[10px] font-black"><option v-for="o in ESTADO_CHOICES" :key="o" :value="o">{{o}}</option></select>
              </div>
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Espejos</label>
                <select v-model="form.estatus_espejos" class="w-full bg-white rounded-xl py-2 text-[10px] font-black"><option v-for="o in ESTADO_CHOICES" :key="o" :value="o">{{o}}</option></select>
              </div>
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Asientos</label>
                <select v-model="form.estado_asientos" class="w-full bg-white rounded-xl py-2 text-[10px] font-black"><option v-for="o in ESTADO_CHOICES" :key="o" :value="o">{{o}}</option></select>
              </div>
             
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Transmicion</label>
                <select v-model="form.tipo_transmision" class="w-full bg-white rounded-xl py-2 text-[10px] font-black"><option value="MANUAL">Manual</option><option value="AUTOMATICA">Automatica</option><option value="SEMIAUTOMATICA">Semi-automática</option></select>
              </div>
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Odometro</label>
                <select v-model="form.estatus_odometro" class="w-full bg-white rounded-xl py-2 text-[10px] font-black"><option value="FUNCIONAL">FUNCIONAL</option><option value="ROTO">ROTO</option><option value="SIN_PANTALLA">SIN PANTALLA</option><option value="ILEGIBLE">ILEGIBLE</option></select>
              </div>
              
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Kilometraje</label>
                <input type="number" v-model="form.kilometraje_odometro" class="w-full bg-white rounded-xl py-2 text-center text-xs font-black">
              </div>
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Cilindros</label>
                <input type="number" v-model="form.cilindros" class="w-full bg-white rounded-xl py-2 text-center text-xs font-black">
              </div>
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Asientos</label>
                <input type="number" v-model="form.cantidad_asientos" class="w-full bg-white rounded-xl py-2 text-center text-xs font-black">
              </div>
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Combustible (Tipo)</label>
                <select v-model="form.tipo_combustible" class="w-full bg-white rounded-xl py-2 text-[10px] font-black uppercase tracking-widest text-slate-700">
                  <option value="GASOLINA">Gasolina</option>
                  <option value="DIESEL">Diésel</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="ELECTRICO">Eléctrico</option>
                  <option value="GAS">Gas / LP</option>
                </select>
              </div>
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Llantas Del.</label>
                <input v-model.number="form.cant_llantas_delanteras" type="number" class="w-full bg-white rounded-xl py-2 text-center text-xs font-black" />
              </div>
              <div class="space-y-1"><label class="text-[9px] font-black text-slate-400 uppercase">Llantas Tras.</label>
                <input v-model.number="form.cant_llantas_traseras" type="number" class="w-full bg-white rounded-xl py-2 text-center text-xs font-black" />
              </div>
        
              <div class="space-y-1">
                <label class="text-[9px] font-black text-slate-400 uppercase">Cuenta con batería</label>
                <div class="w-full bg-white rounded-xl py-2 flex items-center justify-center gap-2 text-xs font-black border border-slate-100">
                  <input 
                    v-model="form.presencia_bateria" 
                    type="checkbox" 
                    class="w-5 h-5 accent-primario cursor-pointer"
                  />
                  <span :class="form.presencia_bateria ? 'text-green-600' : 'text-red-500'">
                    {{ form.presencia_bateria ? 'SÍ' : 'NO' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <input type="checkbox" v-model="form.vehiculo_sin_danos" class="w-5 h-5 accent-primario" />
                  <span class="text-sm font-black text-slate-700 uppercase">¿El vehículo NO presenta daños?</span>
                </div>
                <button v-if="!form.vehiculo_sin_danos" @click="addDano" type="button" class="text-[10px] font-black bg-primario text-white px-4 py-2 rounded-xl">+ AGREGAR DAÑO ESPECÍFICO</button>
              </div>

              <div v-if="!form.vehiculo_sin_danos" class="space-y-4">
                <div v-for="(dano) in listaDanos" :key="dano.id" class="bg-white border-2 border-slate-50 p-6 rounded-3xl relative animate-in fade-in zoom-in">
                  <button @click="removeDano(dano.id)" class="absolute top-4 right-4 text-red-400 hover:text-red-600">✕</button>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-2">
                      <label class="text-[9px] font-black text-slate-400 uppercase">Parte Afectada</label>
                      <input v-model="dano.parte_vehiculo" placeholder="Ej. Parabrisas" class="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold" />
                    </div>

                    <div class="space-y-2">
                      <label class="text-[9px] font-black text-slate-400 uppercase">Descripción</label>
                      <input v-model="dano.descripcion" placeholder="Ej. Fisura de 10cm" class="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold" />
                    </div>

                    <div class="space-y-2">
                      <label class="text-[9px] font-black text-slate-400 uppercase text-center block">Evidencia del Daño</label>
                      <div 
                        :class="[
                          'relative w-full h-10 rounded-xl flex items-center justify-center cursor-pointer border transition-all duration-300',
                          previewsDanos[dano.id] ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-100 hover:bg-slate-200'
                        ]"
                      >
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment"
                          class="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                          @change="e => handleDanoFile(e, dano.id)" 
                        />
                        
                        <CheckCircleIcon v-if="previewsDanos[dano.id]" class="w-6 h-6 text-green-500" />
                        <CameraIcon v-else class="w-5 h-5 text-slate-400" />
                        
                        <img v-if="previewsDanos[dano.id]" :src="previewsDanos[dano.id]" class="absolute right-1 w-6 h-6 object-cover rounded-lg opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="step === 4" key="step4" class="space-y-10">
                  <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div v-for="(label, key) in camposFotos" :key="key" class="group relative">
                      <label class="text-[9px] font-black text-primario uppercase block mb-1 text-center">{{ label }}</label>
                      <div :class="[
                                  'aspect-square border-2 border-dashed rounded-3xl flex items-center justify-center overflow-hidden cursor-pointer transition-all relative',
                                  previews[key] ? 'bg-green-50 border-green-400' : fotosFaltantes.includes(key) ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-slate-200 hover:border-primario'
                                ]">
                        <input type="file" accept="image/*" capture="environment" class="absolute inset-0 opacity-0 z-10 cursor-pointer" @change="e => handleFile(e, key)" />
                        <img v-if="previews[key]" :src="previews[key]" class="w-full h-full object-cover" />
                        <span v-else class="text-2xl opacity-20 group-hover:opacity-100"><CameraIcon class="w-5 h-5" /></span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-sm">
                    <div class="flex justify-between items-center mb-8">
                      <div>
                        <h3 class="font-black text-slate-800 uppercase text-sm tracking-widest">Inventario de Objetos</h3>
                        <p class="text-[9px] font-bold text-slate-400 uppercase">Pertenencias encontradas</p>
                      </div>
                      <button @click="addObjeto" type="button" class="bg-primario text-white px-6 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-primario/20">
                        + REGISTRAR OBJETO
                      </button>
                    </div>

                    <div v-for="(obj, index) in listaObjetos" :key="obj.id" class="p-6 bg-white border border-slate-100 rounded-3xl mb-4 shadow-sm relative animate-in slide-in-from-right-4">
                      <button @click="removeObjeto(obj.id)" class="absolute top-4 right-4 text-red-300 hover:text-red-500">✕</button>
                      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div class="md:col-span-5 space-y-2">
                          <label class="text-[9px] font-black text-slate-400 uppercase ml-2">Descripción</label>
                          <input v-model="obj.descripcion" class="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold" />
                        </div>
                        <div class="md:col-span-2 space-y-2">
                          <label class="text-[9px] font-black text-slate-400 uppercase text-center block">Cant.</label>
                          <input v-model.number="obj.cantidad" type="number" class="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-center" />
                        </div>
                        <div class="md:col-span-3 space-y-2">
                          <label class="text-[9px] font-black text-slate-400 uppercase ml-2">Estado</label>
                          <select v-model="obj.estado_objeto" class="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase">
                            <option value="BUENO">BUENO</option>
                            <option value="REGULAR">REGULAR</option>
                            <option value="MALO">MALO</option>
                          </select>
                        </div>
                        <div class="md:col-span-2 space-y-2">
                          <label class="text-[9px] font-black text-slate-400 uppercase text-center block">Foto</label>
                          <div class="md:col-span-2 space-y-2">
                            <label class="text-[9px] font-black text-slate-400 uppercase text-center block">Foto</label>
                            <div :class="[
                              'relative w-full h-10 rounded-xl flex items-center justify-center cursor-pointer border transition-all duration-300 overflow-hidden',
                              previewsObjetos[obj.id] ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-100'
                            ]">
                              <input 
                                type="file" 
                                accept="image/*" 
                                class="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                                @change="e => handleObjetoFile(e, obj.id)" 
                              />
                              
                              <template v-if="previewsObjetos[obj.id]">
                                <CheckCircleIcon class="w-5 h-5 text-green-500" />
                                <img :src="previewsObjetos[obj.id]" class="absolute right-1 w-7 h-7 object-cover rounded-lg shadow-sm" />
                              </template>
                              
                              <CameraIcon v-else class="w-5 h-5 text-slate-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                          
        </transition>

        <div class="flex justify-between items-center mt-12 pt-8 border-t border-slate-100">
          <button v-if="step > 1" @click="step--" class="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">← Atrás</button>
          <div v-else></div>

          <div class="flex gap-4">
            <button @click="cancelar" class="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors">Cancelar</button>
            <button v-if="step < 4" @click="siguientePaso" class="bg-primario text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primario/20">Siguiente Paso</button>
            <button v-else @click="submitForm" :disabled="loading" class="bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">
              {{ loading ? 'Sincronizando...' : 'Finalizar Registro' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import clienteAxios from '../api/axios'
import { CameraIcon, CheckCircleIcon, PhotoIcon } from '@heroicons/vue/24/solid'
import { DocumentCheckIcon, DocumentIcon } from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2'
const auth = useAuthStore()
const router = useRouter()
const step = ref(1)
const loading = ref(false)
const cancelar = () => router.push('/inventario')
// --- CONSTANTES PARA SELECTS ---
const NIVEL_CHOICES = ['LLENO', 'MEDIO', 'BAJO', 'VACIO']
const ESTADO_CHOICES = ['BUENO', 'REGULAR', 'MALO', 'DAÑADO']
// --- ESTADOS DE IMÁGENES ---
const fotosArchivos = ref({})

const previewsObjetos = ref({})
const previewsDanos = ref({})

// --- LISTAS DINÁMICAS ---
const listaObjetos = ref([{ id: Date.now(), descripcion: '', cantidad: 1, foto_objeto: null }])
const listaDanos = ref([])

// --- FORMULARIO ---
const form = ref({
  // Paso 1: Vehículo
  vehiculo: null, 
  marca: '', submarca: '', modelo: '', anio: 2026, color_actual: '', color_original: '',
  num_serie: '', placas: '', numero_motor: '', tipo_servicio: 'PARTICULAR', tipo_vehiculo: '', repuve: 'SIN REPORTE DE ROBO',
  
  // Paso 2: Datos de Ingreso
  tipo_registro: 'NUEVO', folio: '', autoridad_ingreso: '', fecha_ingreso: '', 
  lugar_siniestro: '', motivo_ingreso: '', presencia_factura: false,
  
  // Paso 3: Detalles Mecánicos (Estos son los que iban en N/A)
  estatus_carroceria: 'BUENO', estatus_cristales: 'BUENO', estatus_espejos: 'BUENO', 
  estado_asientos: 'BUENO', presencia_bateria: true, tipo_transmision: 'MANUAL',
  estado_motor: 'BUENO', estatus_odometro: 'FUNCIONAL', kilometraje_odometro: 0,
  cant_llantas_delanteras: 2, cant_llantas_traseras: 2, cilindros: 4, cantidad_asientos: 5, tipo_combustible: 'GASOLINA',
  estatus_aceite_motor: 'MEDIO', estatus_anticongelante: 'MEDIO', estatus_combustible: 'MEDIO',
  estatus_bolsas_aire: 'INTACTAS', vehiculo_sin_danos: true, factura_original: null,

  // Estatus Legal
  condicion_juridica: '', num_oficio: '', documento_oficio: null, fecha_oficio: '', observaciones: ''
})
const fotosFaltantes = ref([])

const previews = ref({
  evidencia_foto_frontal: null,
  evidencia_foto_lateral_izquierda: null,
  evidencia_foto_lateral_derecha: null,
  evidencia_foto_interior: null,
  evidencia_foto_capo: null,
  evidencia_foto_trasera: null
})

// Agrega esto en tu script setup
const camposFotos = {
  evidencia_foto_frontal: 'Frontal',
  evidencia_foto_lateral_izquierda: 'Lateral Izq.',
  evidencia_foto_lateral_derecha: 'Lateral Der.',
  evidencia_foto_interior: 'Interior',
  evidencia_foto_capo: 'Motor / Capó' , 
  evidencia_foto_trasera: 'Trasera'
} 





const erroresCampos = ref({})

const validarPaso = (paso) => {
  const errores = {}

  if (paso === 1) {
    if (!form.value.placas)        errores.placas = true
    if (!form.value.num_serie)     errores.num_serie = true
    if (!form.value.marca)         errores.marca = true
    if (!form.value.modelo)        errores.modelo = true
    if (!form.value.anio)          errores.anio = true
    if (!form.value.numero_motor)  errores.numero_motor = true
    if (!form.value.tipo_vehiculo) errores.tipo_vehiculo = true
    if (!form.value.color_original) errores.color_original = true
  }

  if (paso === 2) {
    if (!form.value.autoridad_ingreso)  errores.autoridad_ingreso = true
    if (!form.value.lugar_siniestro)    errores.lugar_siniestro = true
    if (!form.value.motivo_ingreso)     errores.motivo_ingreso = true
    if (!form.value.condicion_juridica) errores.condicion_juridica = true
    if (!form.value.num_oficio)         errores.num_oficio = true
    if (!form.value.fecha_oficio)       errores.fecha_oficio = true
    
    if (form.value.tipo_registro === 'INVENTARIO' && !form.value.folio) errores.folio = true
    if (form.value.tipo_registro === 'INVENTARIO' && !form.value.fecha_ingreso) errores.fecha_ingreso = true
  }

  erroresCampos.value = errores
  return Object.keys(errores).length === 0
}

const siguientePaso = () => {
  if (validarPaso(step.value)) {
    step.value++
  } else {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor llena todos los campos obligatorios.' })
  }
}
















// --- FUNCIONES DE CARGA DE ARCHIVOS ---
const handleFile = (e, key) => {
  const file = e.target.files[0]
  if (file) {
    previews.value[key] = URL.createObjectURL(file)
    fotosArchivos.value[key] = file
  }
}

const handleObjetoFile = (e, id) => {
  const file = e.target.files[0]
  if (file) {
    previewsObjetos.value[id] = URL.createObjectURL(file)
    const obj = listaObjetos.value.find(o => o.id === id)
    if (obj) obj.foto_objeto = file
  }
}

const handleDanoFile = (e, id) => {
  const file = e.target.files[0]
  if (file) {
    previewsDanos.value[id] = URL.createObjectURL(file)
    const dano = listaDanos.value.find(d => d.id === id)
    if (dano) dano.foto_evidencia = file
  }
}

const handleDocumentoOficio = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.documento_oficio = file
  }
}

const handleFactura = (e) => {
  const file = e.target.files[0]
  if (file) form.value.factura_original = file
}
// --- GESTIÓN DE LISTAS ---
const addObjeto = () => listaObjetos.value.push({ id: Date.now() + Math.random(), descripcion: '', cantidad: 1, foto_objeto: null })
const removeObjeto = (id) => {
  listaObjetos.value = listaObjetos.value.filter(obj => obj.id !== id)
  delete previewsObjetos.value[id]
}

const addDano = () => listaDanos.value.push({ id: Date.now() + Math.random(), parte_vehiculo: '', descripcion: '', foto_evidencia: null })
const removeDano = (id) => {
  listaDanos.value = listaDanos.value.filter(d => d.id !== id)
  delete previewsDanos.value[id]
}

// --- ENVÍO FINAL ---
const submitForm = async () => {
  loading.value = true
  const formData = new FormData()

  // 1. Separar datos de mecánica para el Serializer
  const datosMecanica = {
    estatus_carroceria: form.value.estatus_carroceria,
    estatus_cristales: form.value.estatus_cristales,
    estatus_espejos: form.value.estatus_espejos,
    estado_asientos: form.value.estado_asientos,
    presencia_bateria: form.value.presencia_bateria,
    tipo_transmision: form.value.tipo_transmision,
    estado_motor: form.value.estado_motor,
    estatus_odometro: form.value.estatus_odometro,
    kilometraje_odometro: form.value.kilometraje_odometro,
    cant_llantas_delanteras: form.value.cant_llantas_delanteras,
    cant_llantas_traseras: form.value.cant_llantas_traseras,
    cilindros: form.value.cilindros,
    cantidad_asientos: form.value.cantidad_asientos,
    tipo_combustible: form.value.tipo_combustible,
    estatus_aceite_motor: form.value.estatus_aceite_motor,
    estatus_anticongelante: form.value.estatus_anticongelante,
    estatus_combustible: form.value.estatus_combustible,
    estatus_bolsas_aire: form.value.estatus_bolsas_aire,
    vehiculo_sin_danos: form.value.vehiculo_sin_danos
  }



Object.entries(form.value).forEach(([key, valor]) => {
  if (key in datosMecanica) return
  
  
  // Vehículo se crea automático si no existe
  if (key === 'vehiculo' && !valor) return

  // Fecha automática en registros nuevos
  if (form.value.tipo_registro === 'NUEVO' && key === 'fecha_ingreso') return

  // Archivos vacíos no se mandan
  if (valor instanceof File === false && (valor === '' || valor === null || valor === undefined)) return

  // Booleanos como string (DRF los entiende mejor en multipart)
  if (typeof valor === 'boolean') {
    formData.append(key, valor ? 'true' : 'false')
    return
  }

  formData.append(key, valor)
})
  if (form.value.documento_oficio) {
    formData.append('documento_oficio', form.value.documento_oficio)
  }
  formData.append('detalles_auto', JSON.stringify(datosMecanica))

  

  // 4. Fotos del vehículo
  Object.keys(fotosArchivos.value).forEach(key => {
    formData.append(key, fotosArchivos.value[key])
  })

  // 5. Objetos Personales
  const objetosJSON = listaObjetos.value.map(obj => ({
    descripcion: obj.descripcion,
    cantidad: obj.cantidad,
    estado_objeto: 'BUENO'
  }))
  formData.append('objetos_data', JSON.stringify(objetosJSON))
  listaObjetos.value.forEach((obj, i) => {
    if (obj.foto_objeto) formData.append(`foto_objeto_${i}`, obj.foto_objeto)
  })

  // 6. Daños
  const danosJSON = listaDanos.value.map(d => ({
    parte_vehiculo: d.parte_vehiculo,
    descripcion: d.descripcion
  }))
  formData.append('danos_data', JSON.stringify(danosJSON))
  listaDanos.value.forEach((d, i) => {
    if (d.foto_evidencia) formData.append(`foto_dano_${i}`, d.foto_evidencia)
  })


  const fotasFaltantes = Object.keys(camposFotos).filter(key => !fotosArchivos.value[key])
  if (fotasFaltantes.length > 0) {
    Swal.fire({ icon: 'warning', title: 'Fotos incompletas', text: 'Las 6 fotografías del vehículo son obligatorias.' })
    fotosFaltantes.value = fotasFaltantes
    loading.value = false
    return
  }
  fotosFaltantes.value = []


  try {
  const response = await clienteAxios.post('ingresos/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // <-- ESTO ES LO QUE FALTA
    }
  })
  Swal.fire({ icon: 'success', title: 'Registro Exitoso', timer: 2000, showConfirmButton: false })
  router.push('/inventario')
  
} catch (error) {
    console.error("Error al registrar:", error.response?.data || error)
    Swal.fire({ icon: 'error', title: 'Error al registrar', text: error.response?.data?.detail || 'Verifica los campos' })
  } finally {
    loading.value = false
  }
}
</script>