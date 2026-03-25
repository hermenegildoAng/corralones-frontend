<template>


    <div v-if="loading" class="flex flex-col justify-center items-center h-screen gap-4">
          <div class="w-12 h-12 border-4 border-primario border-t-transparent rounded-full animate-spin"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sincronizando Expediente...</p>
        </div>

  <div v-else-if="!loading && vehiculo && ingreso" class="flex min-h-screen bg-slate-50 font-sans relative overflow-x-hidden">
  

    
    <button @click="router.back()" class="absolute top-4 left-6 md:top-6 md:left-10 z-20 flex items-center gap-2 text-slate-500 hover:text-primario transition-colors bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
            <ArrowLeftIcon class="w-4 h-4" />
            <span class="text-[10px] font-black uppercase tracking-widest">Regresar</span>
          </button>


    <transition name="drawer-left">
      <aside v-if="drawerSolicitud" class="fixed left-0 top-0 h-screen w-112.5 bg-white border-r border-slate-200 shadow-2xl z-70 flex flex-col p-10 overflow-y-auto">
  
          <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
            <p class="text-xs font-black text-primario animate-pulse uppercase tracking-[0.3em]">Procesando Solicitud...</p>
          </div>

          <div class="flex justify-between items-start mb-10">
            <div>
              <span class="text-[9px] font-black text-primario uppercase tracking-[0.4em]">
                {{ modoFormulario === 'EDICION_NORMAL' ? 'Propuesta de Cambio' : 'Añadir Registro' }}
              </span>
              <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase mt-1">
                <span v-if="modoFormulario === 'FOTO_EXTRA'">Añadir Evidencia</span>
                <span v-else-if="modoFormulario === 'NUEVO_DANO'">Reportar Daño</span>
                <span v-else-if="modoFormulario === 'NUEVO_OBJETO'">Registrar Objeto</span>
                <span v-else>Corregir Registro</span>
              </h2>
            </div>
            <button @click="cerrarEditor" class="p-2 hover:bg-slate-50 rounded-xl transition-all">✕</button>
          </div>

          <div class="space-y-8">
            <div class="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Acción Seleccionada</p>
              <p class="text-xs font-black text-slate-800 uppercase">{{ campoAEditar.label }}</p>
            </div>

            <div v-if="modoFormulario === 'FOTO_EXTRA'" class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre / Etiqueta de la Foto</label>
                <input v-model="formEdicion.valor_nuevo" type="text" class="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase text-slate-700 outline-none" placeholder="Ej. Detalle de llanta ponchada" />
              </div>
            </div>

            <div v-else-if="modoFormulario === 'NUEVO_OBJETO'" class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre del Objeto</label>
                <input v-model="formNuevoObjeto.descripcion" type="text" class="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase text-slate-700 outline-none" placeholder="Ej. Gato Hidráulico" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Cantidad</label>
                  <input v-model="formNuevoObjeto.cantidad" type="number" min="1" class="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase text-slate-700 outline-none" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Estado</label>
                  <select v-model="formNuevoObjeto.estado" class="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase text-slate-700 outline-none">
                    <option value="BUENO">Bueno</option>
                    <option value="REGULAR">Regular</option>
                    <option value="MALO">Malo</option>
                    <option value="DAÑADO">Dañado</option>
                  </select>
                </div>
              </div>
            </div>

            <div v-else-if="modoFormulario === 'NUEVO_DANO'" class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Parte Afectada</label>
                <input v-model="formNuevoDano.parte_vehiculo" type="text" class="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase text-slate-700 outline-none" placeholder="Ej. Puerta Izquierda" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Descripción del Daño</label>
                <textarea v-model="formNuevoDano.descripcion" rows="3" class="w-full bg-slate-50 border-none rounded-4xl p-5 text-xs text-slate-700 outline-none resize-none" placeholder="Detalle la abolladura o rayón..."></textarea>
              </div>
            </div>

            <div v-else-if="modoFormulario === 'EDICION_NORMAL'" class="space-y-4">
              <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-4">
                <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Valor Actual Registrado</span>
                <span class="text-sm font-bold text-slate-700 uppercase">{{ campoAEditar.valor }}</span>
              </div>

              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nuevo Valor Propuesto</label>
              <input 
                v-if="['text', 'number'].includes(campoAEditar.tipo)"
                v-model="formEdicion.valor_nuevo" 
                :type="campoAEditar.tipo" 
                class="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-5 text-xs font-black uppercase focus:border-primario/20 outline-none transition-all text-slate-700"
              />
              <select 
                v-else-if="campoAEditar.tipo === 'select'"
                v-model="formEdicion.valor_nuevo"
                class="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase outline-none text-slate-700"
              >
                <option v-for="opt in campoAEditar.opciones" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <div v-else-if="modoFormulario === 'NUEVO_DOCUMENTO'" class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tipo de Documento</label>
                <select v-model="formEdicion.valor_nuevo" class="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase text-slate-700 outline-none focus:ring-2 focus:ring-primario/20 transition-all">
                  <option value="Factura Original">Factura / Carta Factura</option>
                  <option value="Oficio Legal">Oficio de Autoridad / Liberación</option>
                  <option value="Identificación">Identificación Oficial (INE/Pasaporte)</option>
                  <option value="Otro">Otro Documento</option>
                </select>
              </div>
              
              <div class="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                <DocumentTextIcon class="w-6 h-6 text-amber-500 shrink-0" />
                <p class="text-[10px] font-bold text-amber-700 uppercase tracking-wide leading-relaxed">
                  Asegúrese de que el documento sea legible. Puede subir formato PDF o Imagen (JPG/PNG).
                </p>
              </div>
            </div>

            <div class="space-y-4 mt-4">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                {{ modoFormulario === 'FOTO_EXTRA' ? 'Subir Fotografía Obligatoria' : 'Foto de Evidencia (Opcional)' }}
              </label>
              <div class="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-8 text-center hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden group">
                <input type="file" class="absolute inset-0 opacity-0 cursor-pointer z-10" @change="handleEvidencia" accept="image/*, application/pdf" />
                <div v-if="!evidenciaPreview" class="space-y-2">
                  <PhotoIcon class="w-10 h-10 text-slate-200 mx-auto group-hover:text-primario/40 transition-colors" />
                  <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">Click para seleccionar imagen</p>
                </div>
                <div v-else class="relative">
                  <img :src="evidenciaPreview" class="w-full h-48 object-cover rounded-2xl shadow-lg" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <p class="text-[10px] font-black text-white uppercase tracking-widest">Cambiar Imagen</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!['NUEVO_OBJETO', 'NUEVO_DANO'].includes(modoFormulario)" class="space-y-4">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Justificación Técnica</label>
              <textarea v-model="formEdicion.justificacion" rows="4" class="w-full bg-slate-50 border-none rounded-4xl p-6 text-sm outline-none italic resize-none text-slate-600" placeholder="Explique por qué se requiere este registro o cambio"></textarea>
            </div>

            <button @click="enviarSolicitud" class="w-full py-6 bg-primario text-white rounded-4xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primario/20 active:scale-95 transition-all">
              Enviar Solicitud
            </button>
          </div>
        </aside>
    </transition>

    <div :class="['transition-all duration-500 flex-1 p-4 md:p-10 space-y-10', drawerSolicitud ? 'ml-112.5' : '', drawerInspeccion ? 'mr-100' : '']">
      <div class="max-w-7xl mx-auto">
        
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-slate-100 pb-8">
          <div>
            <span class="text-[10px] font-black text-primario uppercase tracking-[0.3em]">Expediente Maestro</span>
            <h1 class="text-4xl font-black text-slate-800 tracking-tighter uppercase mt-2">
              {{ vehiculo.marca }} {{ vehiculo.modelo }} <span class="text-slate-300 font-light">{{ vehiculo.anio }}</span>
            </h1>
            <p class="text-slate-400 font-medium text-sm mt-1 italic">Folio: <span class="text-primario font-black">{{ ingreso.folio }}</span></p>
          </div>

          <div class="flex items-center gap-6">
            

            <div class="flex flex-col gap-4 bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 h-full justify-center">
              <div v-if="auth.rol === 'OPERADOR'" class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Modo Edición</span>
                <button @click="modoEdicion = !modoEdicion" :class="['w-14 h-7 rounded-full relative transition-all duration-500', modoEdicion ? 'bg-primario shadow-lg shadow-primario/30' : 'bg-slate-200']">
                  <div :class="['absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm', modoEdicion ? 'left-8' : 'left-1']"></div>
                </button>
              </div>

              <div class="flex gap-3 pt-2">
                <button v-if="auth.rol === 'ADMIN'" @click="drawerInspeccion = !drawerInspeccion" :class="['p-4 rounded-2xl transition-all shadow-sm w-full flex justify-center items-center', drawerInspeccion ? 'bg-slate-800 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-primario hover:text-white']">
                  <ClipboardDocumentCheckIcon class="w-6 h-6" />
                </button>
                <button class="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 shadow-sm transition-all w-full flex justify-center items-center">
                  <DocumentArrowDownIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <section class="flex flex-col gap-4 mb-10 w-full">
          
          <div class="w-full aspect-21/9   md:aspect-3/1 bg-slate-50 rounded-[3rem] p-2 border border-slate-200 shadow-sm relative overflow-hidden group cursor-zoom-in flex items-center justify-center">
            
            <img 
              v-if="galeriaFotos.length > 0" 
              :src="urlMedia(fotoPrincipal.foto)" 
              class="w-full h-full object-cover rounded-[2.5rem]" 
              @click="abrirModalImg(urlMedia(fotoPrincipal.foto), fotoPrincipal.nombre || 'Vista Detalle')" 
            />
            
            <div v-else class="flex flex-col items-center text-slate-400">
              <PhotoIcon class="w-12 h-12 mb-2 opacity-50" />
              <p class="text-[10px] font-black uppercase tracking-widest">Sin fotos registradas</p>
            </div>
            
            <div v-if="fotoPrincipal.nombre" class="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
              {{ fotoPrincipal.nombre }}
            </div>

            <button 
              v-if="modoEdicion" 
              @click.stop="abrirEditorNuevaFoto()"
              class="absolute top-6 right-6 p-3 px-5 bg-primario hover:bg-primario-dark text-white rounded-2xl shadow-xl font-black text-[10px] uppercase tracking-widest transition-all transform hover:scale-105"
            >
              + Añadir Evidencia Extra
            </button>
          </div>

          <div class="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            
            <div 
              v-for="(img, index) in galeriaFotos" 
              :key="index" 
              @click="fotoPrincipal = img"
              :class="[
                'relative group bg-white p-1 rounded-2xl border shadow-sm transition-all overflow-hidden aspect-square cursor-pointer',
                fotoPrincipal.id === img.id ? 'border-primario ring-2 ring-primario/30 scale-105' : 'border-slate-200 hover:border-primario/50'
              ]"
            >
              <img :src="urlMedia(img.foto)" class="w-full h-full object-cover rounded-xl" />
              
              <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-xl backdrop-blur-sm">
                <span class="text-white text-[8px] font-bold uppercase tracking-wider text-center px-1">
                  {{ img.nombre }}
                </span>
              </div>
            </div>

          </div>
        </section>

        <div class="grid lg:grid-cols-2 gap-8 items-stretch">
          
          <div class="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-center">
            <h3 class="text-[10px] font-black text-primario uppercase tracking-[0.3em] mb-8">Datos de Unidad (Vehiculo)</h3>
            <div class="grid grid-cols-2 gap-y-10 gap-x-6">
              <div v-for="campo in camposVehiculo" :key="campo.label">
                <p class="text-[9px] text-primario font-black uppercase tracking-widest mb-1 transition-colors"
                  >
                  {{ campo.titulo }}
                </p>
                <button
                  @click="abrirEditorNormal(campo.label, vehiculo[campo.label], vehiculo.id, campo.tabla)"
                  :disabled="!modoEdicion"
                  :class="['w-full text-left p-3 rounded-xl text-xs font-black uppercase transition-all duration-300',
                          modoEdicion
                            ? 'bg-primario/5 text-primario border border-dashed border-primario/40 shadow-sm hover:bg-primario/10 scale-[1.02] cursor-pointer'
                            : 'bg-slate-50 text-slate-600 border border-transparent cursor-default']"
                >
                  {{ vehiculo[campo.label] || 'N/A' }}
                </button>
              </div>
            </div>
          </div>
          
          <CodigoQr :contenido="vehiculo.num_serie" class="hidden lg:flex w-full" />

          <div class="lg:col-span-2 space-y-8">
            
            <div class="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-center">
              <h3 class="text-[10px] font-black text-primario uppercase tracking-[0.3em] mb-8">
                Datos de Ingreso
              </h3>
              
              <div class="grid grid-cols-2 gap-y-8 gap-x-6">
                <div v-for="campo in camposIngreso" :key="campo.label" class="relative group">
                  <p class="text-[9px] font-black text-primario uppercase tracking-widest mb-2 flex justify-between items-center"
                     >
                    {{ campo.titulo }}
                    
                    
                  </p>

                  <div class="w-full text-left p-3 rounded-xl text-xs font-black uppercase transition-all duration-300 bg-slate-50 text-slate-600 border border-transparent cursor-default">
                    {{ ingreso[campo.label] || 'N/A' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado Físico y Mecánico -->
          <!-- Estado Físico y Mecánico -->
            <div class="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-center">
              <h3 class="text-[10px] font-black text-primario uppercase tracking-[0.3em] mb-8">Estado Físico y Mecánico</h3>
              <div class="grid grid-cols-2 gap-y-10 gap-x-8">
                <div v-for="campo in camposMecanica" :key="campo.label">
                  <p class="text-[9px] text-primario font-black uppercase tracking-widest mb-1 transition-colors"
                    >
                    {{ campo.titulo }}
                  </p>
                  <button
                    @click="abrirEditorNormal(campo.label, mecanica[campo.label], ingreso.id, campo.tabla)"
                    :disabled="!modoEdicion"
                    :class="['w-full text-left p-3 rounded-xl text-xs font-black uppercase transition-all duration-300',
                            modoEdicion
                              ? 'bg-primario/5 text-primario border border-dashed border-primario/40 shadow-sm hover:bg-primario/10 scale-[1.02] cursor-pointer'
                              : 'bg-slate-50 text-slate-600 border border-transparent cursor-default']"
                  >
                    {{ mecanica[campo.label] || 'N/A' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Niveles de Líquidos y Seguridad -->
            <div class="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-center">
              <h3 class="text-[10px] font-black text-primario uppercase tracking-[0.3em] mb-8">Niveles de Líquidos y Seguridad</h3>
              <div class="grid grid-cols-2 gap-y-10 gap-x-8">
                <div v-for="campo in camposLiquidos" :key="campo.label">
                  <p class="text-[9px] text-primario font-black uppercase tracking-widest mb-1 transition-colors"
                    >
                    {{ campo.titulo }}
                  </p>
                  <button
                    @click="abrirEditorNormal(campo.label, mecanica[campo.label], ingreso.id, campo.tabla)"
                    :disabled="!modoEdicion"
                    :class="['w-full text-left p-3 rounded-xl text-xs font-black uppercase transition-all duration-300',
                            modoEdicion
                              ? 'bg-primario/5 text-primario border border-dashed border-primario/40 shadow-sm hover:bg-primario/10 scale-[1.02] cursor-pointer'
                              : 'bg-slate-50 text-slate-600 border border-transparent cursor-default']"
                  >
                    {{ mecanica[campo.label] || 'N/A' }}
                  </button>
                </div>
              </div>
            </div>

          <!-- Bloque Estatus Legal Nuevo -->
          <div class="lg:col-span-2 bg-indigo-50/50 rounded-[3rem] p-10 border border-indigo-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-indigo-50 flex items-center justify-center">
              <ScaleIcon class="w-16 h-16 text-indigo-400" />
            </div>
            <div class="flex-1 space-y-4 w-full">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Documentación Jurídica</h3>
                  <p class="text-xl font-black text-slate-800 uppercase mt-1">{{ estatusLegal.condicion }}</p>
                </div>
                <!-- 
                <button v-if="modoEdicion" @click="abrirEditor('Condición Jurídica', estatusLegal.condicion)" class="text-[8px] font-black text-primario uppercase bg-white px-3 py-1 rounded-full border border-primario/20">Editar</button>
                -->
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-2xl border border-indigo-50">
                  <p class="text-[8px] font-black text-primario uppercase tracking-widest">Núm. Oficio</p>
                  <p class="font-bold text-slate-700 uppercase mt-1 text-sm">{{ estatusLegal.oficio }}</p>
                </div>
                <div class="bg-white p-4 rounded-2xl border border-indigo-50">
                  <p class="text-[8px] font-black text-primario uppercase tracking-widest">Fecha Oficio</p>
                  <p class="font-bold text-primario uppercase mt-1 text-sm">{{ estatusLegal.fecha }}</p>
                </div>
              </div>

              <div class="bg-white p-4 rounded-2xl border border-indigo-50 relative group">
                <p class="text-[8px] font-black text-primario uppercase tracking-widest">Observaciones</p>
                <p class="font-medium text-primario text-xs mt-1 italic leading-relaxed">{{ estatusLegal.observaciones }}</p>
                 <!-- 
                <button v-if="modoEdicion" @click="abrirEditor('Obs. Legales', estatusLegal.observaciones)" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-primario transition-all"><PencilSquareIcon class="w-4 h-4"/></button>
              -->
              </div>
            </div>
          </div>


          <div class="lg:col-span-2">
            <div class="flex justify-between items-center mb-6 ml-6 pr-6">
              <h3 class="text-[10px] font-black text-primario uppercase tracking-[0.3em]">Inventario de Objetos</h3>
              
              <button v-if="modoEdicion" @click="abrirEditorNuevoObjeto('Añadir Objeto', '')" class="text-[9px] font-black text-primario uppercase tracking-widest border-b border-primario/30">+ Reportar nuevo objeto</button>
           
              
               </div>

            <div v-if="objetos.length === 0" class="bg-white p-10 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
              <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">No se registraron pertenencias en el inventario</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div v-for="obj in objetos" :key="obj.id" class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4 group transition-all hover:border-primario/20">
                
                <div class="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 relative shrink-0">
                  <img :src="obj.foto_objeto || 'https://via.placeholder.com/150?text=OBJ'" 
                      class="w-full h-full object-cover cursor-zoom-in hover:opacity-80 transition-opacity" 
                      @click.stop="abrirModalImg(obj.foto_objeto, obj.descripcion)" />
                  <!--
                      <button v-if="modoEdicion" 
                          @click.stop="abrirEditorNuevoObjeto('Foto: ' + obj.descripcion, obj.foto_objeto, true, obj.id, 'ObjetoPersonal')"class="absolute inset-0 bg-primario/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-black uppercase">
                    Cambiar
                  </button>
                -->
                  
                </div>

                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-primario uppercase truncate">{{ obj.descripcion }}</p>
                  <p class="text-[9px] font-bold text-primario uppercase mt-1">
                    {{ obj.cantidad }} PZA • <span class="text-primario/60">{{ obj.estado || 'BUENO' }}</span>
                  </p>
                </div>

                <!--
                  <button v-if="modoEdicion" 
                        @click="abrirEditor('Objeto: ' + obj.descripcion, obj.estado, false, obj.id, 'ObjetoPersonal')"
                        class="p-1 text-primario bg-primario/5 rounded-lg hover:bg-primario/10 transition-all">
                  <PencilSquareIcon class="w-4 h-4" />
                </button>
                -->
                
              </div>
            </div>
          </div>


          <div class="lg:col-span-2">
            <div class="flex justify-between items-center mb-6 ml-6 pr-6">
              <h3 class="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">Daños y Siniestros Registrados</h3>
              <button v-if="modoEdicion" @click="abrirEditorNuevoDano('Añadir Daño', '')" class="text-[9px] font-black text-primario uppercase tracking-widest border-b border-primario/30">+ Reportar nuevo daño</button>
            </div>
            
            <div v-if="danos.length === 0" class="bg-white p-10 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
              <p class="text-[10px] font-black text-primario uppercase tracking-widest">Sin daños físicos reportados</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="dano in danos" :key="dano.id" class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start gap-5 group relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div>

                <div class="w-24 h-24 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0 relative">
                  <img :src="dano.foto_evidencia || 'https://via.placeholder.com/150?text=Sin+Foto'" 
                      class="w-full h-full object-cover cursor-zoom-in hover:opacity-80 transition-opacity" 
                      @click.stop="abrirModalImg(dano.foto_evidencia, dano.parte_vehiculo)"/>
                  
                  <button v-if="modoEdicion" 
                         @click.stop="abrirEditorNuevoDano('Evidencia Daño: ' + dano.parte_vehiculo, dano.foto_evidencia, true, dano.id, 'RegistroDano')"
                          class="absolute inset-0 bg-primario/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-black uppercase">
                    Sustituir
                  </button>
                </div>

                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <p class="text-xs font-black text-primario uppercase">{{ dano.parte_vehiculo }}</p>
                    <button v-if="modoEdicion" @click="abrirEditor('Daño: ' + dano.parte_vehiculo, dano.descripcion, false, dano.id, 'RegistroDano')"
                       class="p-1 text-primario bg-primario/5 rounded-lg hover:bg-primario/10 transition-all">
                      <PencilSquareIcon class="w-4 h-4" />
                    </button>
                  </div>

                  <p class="text-[11px] text-primario font-medium leading-relaxed mt-2 italic">"{{ dano.descripcion }}"</p>
                  
                  <p class="text-[10px] font-black text-primario uppercase mt-3 tracking-tighter italic">
                    Registrado: {{ dano.fecha_registro ? new Date(dano.fecha_registro).toLocaleDateString() : 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2">
            <div class="flex justify-between items-center mb-6 ml-6 pr-6">
              <h3 class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Documentos Indexados</h3>
              <button v-if="modoEdicion" @click="abrirEditorDocumento('Subir Documento', '', true)" class="text-[9px] font-black text-primario uppercase tracking-widest border-b border-primario/30">+ Indexar nuevo archivo</button>
            </div>
            
            <div v-if="documentos.length === 0" class="bg-white p-10 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
              <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin documentos indexados</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="doc in documentos" :key="doc.id" class="bg-white p-4 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                
                <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-400">
                  <DocumentTextIcon v-if="doc.nombre_documento.toLowerCase().includes('oficio') || doc.nombre_documento.toLowerCase().includes('factura')" class="w-6 h-6" />
                  <PhotoIcon v-else class="w-6 h-6" />
                </div>

                <div class="flex-1 overflow-hidden">
                  <p class="text-[10px] font-black text-slate-700 uppercase truncate" :title="doc.nombre_documento">
                    {{ doc.nombre_documento || 'Documento sin nombre' }}
                  </p>
                  <p class="text-[8px] font-bold text-slate-400 uppercase mt-1">
                    {{ doc.tipo || 'Archivo' }}
                  </p>
                </div>

                <button 
                  v-if="doc.archivo?.toLowerCase().endsWith('.pdf')" 
                  @click="abrirPDF(doc.archivo)" 
                  class="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <ArrowTopRightOnSquareIcon class="w-4 h-4" />
                </button>
                
                <button 
                  v-else 
                  @click="abrirModalImg(doc.archivo, doc.nombre_documento)" 
                  class="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <MagnifyingGlassPlusIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          

        </div>
      </div>
    </div>

    <transition name="drawer">
      <aside v-if="drawerInspeccion" class="fixed right-0 top-0 h-screen w-100 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col p-10 overflow-y-auto">
        <div class="flex justify-between items-start mb-10">
          <div>
            <span class="text-[9px] font-black text-primario uppercase tracking-[0.4em]">Auditoría de Sede</span>
            <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase mt-1">Dictamen Final</h2>
          </div>
          <button @click="drawerInspeccion = false" class="p-2 hover:bg-slate-50 rounded-xl transition-all">✕</button>
        </div>

        <div class="space-y-10">
          <div v-for="check in checksInspeccion" :key="check.model" class="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100">
            <span class="text-[10px] font-black text-slate-600 uppercase">{{ check.label }}</span>
            <button @click="formInspeccion[check.model] = !formInspeccion[check.model]" :class="['w-10 h-5 rounded-full relative transition-all', formInspeccion[check.model] ? 'bg-primario' : 'bg-slate-200']">
              <div :class="['absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm', formInspeccion[check.model] ? 'left-6' : 'left-1']"></div>
            </button>
          </div>

          <div class="space-y-4">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Veredicto</label>
            <div class="grid grid-cols-1 gap-2">
              <button v-for="res in RESULTADOS_INS" :key="res.value" @click="formInspeccion.resultado = res.value" :class="['py-4 px-6 rounded-2xl text-[9px] font-black uppercase border-2 transition-all text-left flex justify-between items-center', formInspeccion.resultado === res.value ? 'bg-primario  text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200']">
                {{ res.label }}
              </button>
            </div>
          </div>

          <textarea v-model="formInspeccion.observaciones_admin" rows="5" class="w-full bg-slate-50 border-none rounded-4xl p-8 text-sm outline-none resize-none" placeholder="Observaciones del admin"></textarea>
          <button 
            @click="guardarInspeccion"
            class="w-full py-6 bg-primario text-white rounded-4xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
            Firmar Inspección
          </button>
        </div>
      </aside>
    </transition>

   
    <!-- Elemento Modal para Zoom de Imágenes -->
    <transition name="fade">
      <div v-if="modalImagen.show" class="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex items-center justify-center p-4" @click="modalImagen.show = false">
        <button @click="modalImagen.show = false" class="absolute top-10 right-10 text-white/50 hover:text-white transition-colors p-4 bg-white/5 rounded-full backdrop-blur">✕</button>
        <img :src="modalImagen.url" class="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10 select-none" @click.stop />
        <span class="absolute bottom-10 bg-black/50 px-6 py-2 rounded-full text-white/70 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur">{{ modalImagen.titulo }}</span>
      </div>
    </transition>

    

      
  </div>  
 </div> 
<div v-else class="flex justify-center items-center h-screen">
          <p class="animate-pulse font-black text-slate-300">CARGANDO EXPEDIENTE...</p>
    </div>
</template> 

<script setup>

import { useAuthStore } from '../stores/auth'
import CodigoQr from '../components/CodigoQR.vue'
import {ArrowLeftIcon, PencilSquareIcon, ClipboardDocumentCheckIcon,
   DocumentArrowDownIcon, MagnifyingGlassPlusIcon, ScaleIcon, PhotoIcon, DocumentTextIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2'



import { ref, computed, onMounted } from 'vue'
 
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

import clienteAxios from '../api/axios'

const loading = ref(true)
const datosIngreso = ref(null)

const auth = useAuthStore()
const modoEdicion = ref(false)
const drawerSolicitud = ref(false)
const drawerInspeccion = ref(false)
const fotoPrincipal = ref({ foto: '', nombre: '', id: null });
const modoFormulario = ref('EDICION_NORMAL')
const modalImagen = ref({ show: false, url: '', titulo: '' })
const abrirModalImg = (url, titulo) => { modalImagen.value = { show: true, url, titulo } }

const campoAEditar = ref({ label: '', valor: '', tipo: 'text', opciones: [] })
const formEdicion = ref({ valor_nuevo: '', justificacion: '' })
const evidenciaPreview = ref(null)

const formNuevoObjeto = ref({ descripcion: '', cantidad: 1, estado: 'BUENO' })
const formNuevoDano = ref({ parte_vehiculo: '', descripcion: '' })


const abrirPDF = (url) => { if (url !== '#') window.open(url, '_blank'); else alert('Abriendo PDF Simulado') }

const abrirEditorNuevaFoto = () => {
  modoEdicion.value = true
  modoFormulario.value = 'FOTO_EXTRA'
  campoAEditar.value = { label: 'Nueva Evidencia Fotográfica' }
  evidenciaPreview.value = null
  formEdicion.value = { valor_nuevo: '', justificacion: '', evidencia: null }
  drawerSolicitud.value = true
}

// La función para abrir el cajón en modo Documento
const abrirEditorDocumento = () => {
  modoEdicion.value = true
  modoFormulario.value = 'NUEVO_DOCUMENTO'
  campoAEditar.value = { label: 'Añadir Documento al Expediente' }
  // Usaremos valor_nuevo para guardar qué tipo de documento eligió en el select
  formEdicion.value = { valor_nuevo: 'Factura Original', justificacion: '', evidencia: null } 
  evidenciaPreview.value = null
  drawerSolicitud.value = true
}

const abrirEditorNuevoDano = () => {
  modoEdicion.value = true
  modoFormulario.value = 'NUEVO_DANO'
  campoAEditar.value = { label: 'Reporte de Daño Físico', tabla: 'RegistroDano' }
  formNuevoDano.value = { parte_vehiculo: '', descripcion: '' }
  evidenciaPreview.value = null
  formEdicion.value = { justificacion: '', evidencia: null }
  drawerSolicitud.value = true
}

const abrirEditorNuevoObjeto = () => {
  modoEdicion.value = true
  modoFormulario.value = 'NUEVO_OBJETO'
  campoAEditar.value = { label: 'Registro de Objeto Personal', tabla: 'ObjetoPersonal' }
  formNuevoObjeto.value = { descripcion: '', cantidad: 1, estado: 'BUENO' }
  evidenciaPreview.value = null
  formEdicion.value = { justificacion: '', evidencia: null }
  drawerSolicitud.value = true
}

// Y tu vieja función abrirEditor, pero ahora le decimos que es el Modo Normal:
const abrirEditorNormal = (label, valorOriginal, idRelacionado = null, tablaDestino = null) => {
  if (!modoEdicion.value) return
  modoFormulario.value = 'EDICION_NORMAL'
  evidenciaPreview.value = null
  formEdicion.value = { 
    valor_nuevo: valorOriginal, 
    justificacion: '', 
    evidencia: null 
  }
 

  campoAEditar.value = { 
    label, // 🚨 Este ahora será 'estado_motor', 'color_actual', etc.
    titulo: obtenerEtiquetaBonita(label), // Una función simple que retorne "Motor" si recibe "estado_motor"
    valor: valorOriginal, 
    // Detección de tipo más robusta
    tipo: OPCIONES_MAP[label] ? 'select' : (CAMPOS_NUMERICOS.includes(label) ? 'number' : 'text'),
    opciones: OPCIONES_MAP[label] || [],
    id_especifico: idRelacionado,
    tabla: tablaDestino
  }

  drawerSolicitud.value = true
}





const OPCIONES_MAP = {
  'estatus_carroceria':    ['BUENO', 'REGULAR', 'MALO', 'DAÑADO'],
  'estatus_cristales':     ['BUENO', 'REGULAR', 'MALO', 'DAÑADO'],
  'estatus_espejos':       ['BUENO', 'REGULAR', 'MALO', 'DAÑADO'],
  'estado_motor':          ['BUENO', 'REGULAR', 'MALO', 'DAÑADO'],
  'estado_asientos':       ['BUENO', 'REGULAR', 'MALO', 'DAÑADO'],
  'tipo_transmision':      ['MANUAL', 'AUTOMATICA', 'SEMIAUTOMATICA'],
  'estatus_aceite_motor':  ['LLENO', 'MEDIO', 'BAJO', 'VACIO'],
  'estatus_combustible':   ['LLENO', 'MEDIO', 'BAJO', 'VACIO'],
  'estatus_anticongelante':['LLENO', 'MEDIO', 'BAJO', 'VACIO'],
  'tipo_combustible':      ['GASOLINA', 'DIESEL', 'HIBRIDO', 'ELECTRICO', 'GAS'],
  'estatus_odometro':      ['FUNCIONAL', 'ROTO', 'SIN_PANTALLA', 'ILEGIBLE'],
  'estatus_bolsas_aire':   ['INTACTAS', 'ACTIVADAS', 'NO_TIENE', 'DAÑADAS'],
  'presencia_bateria':     ['SÍ', 'NO'],
  'repuve':                ['SIN REPORTE DE ROBO', 'CON REPORTE DE ROBO', 'RECUPERADO', 'DESCONOCIDO'],
}

const CAMPOS_NUMERICOS = [
  'anio', 'cilindros', 'cantidad_asientos', 
  'cant_llantas_delanteras', 'cant_llantas_traseras', 
  'kilometraje_odometro'
]
// Ejemplo de cómo estructurar los datos para que el Modal sepa qué campo es en la DB
const camposVehiculo = [
  { label: 'marca', titulo: 'Marca', tabla: 'Vehiculo' },
  { label: 'submarca', titulo: 'Submarca', tabla: 'Vehiculo' },
  { label: 'modelo', titulo: 'Modelo', tabla: 'Vehiculo' },
  { label: 'anio', titulo: 'Año', tabla: 'Vehiculo' },
  { label: 'color_original', titulo: 'Color Original', tabla: 'Vehiculo' },
  { label: 'color_actual', titulo: 'Color Actual', tabla: 'Vehiculo' },
  { label: 'placas', titulo: 'Placas', tabla: 'Vehiculo' },
  { label: 'num_serie', titulo: 'Serie (VIN)', tabla: 'Vehiculo' },
  { label: 'numero_motor', titulo: 'Número Motor', tabla: 'Vehiculo' },
  { label: 'repuve', titulo: 'Repuve', tabla: 'Vehiculo' },
];

const camposMecanica = [
  { label: 'estatus_carroceria', titulo: 'Carroceria', tabla: 'DetallesAuto' },
  { label: 'estatus_cristales', titulo: 'Cristales', tabla: 'DetallesAuto' },
  { label: 'estatus_espejos', titulo: 'Espejos', tabla: 'DetallesAuto' },
  { label: 'estado_motor', titulo: 'Motor', tabla: 'DetallesAuto' },
  { label: 'cant_llantas_delanteras', titulo: 'Llantas Del.', tabla: 'DetallesAuto' },
  { label: 'cant_llantas_traseras', titulo: 'Llnastas Tras.', tabla: 'DetallesAuto' },
  { label: 'estado_asientos', titulo: 'Estado Asientos', tabla: 'DetallesAuto' },
  { label: 'cilindros', titulo: 'Cilindros', tabla: 'DetallesAuto' },
  { label: 'cantidad_asientos', titulo: 'Asientos', tabla: 'DetallesAuto' },
  { label: 'tipo_combustible', titulo: 'Tipo Combustible', tabla: 'DetallesAuto' },
  { label: 'presencia_bateria', titulo: 'Tiene bateria?', tabla: 'DetallesAuto' },
  




];

const camposIngreso = [
  { label: 'folio', titulo: 'Folio', tabla: 'Ingreso' },
  { label: 'tipo_registro', titulo: 'Tipo Registro', tabla: 'Ingreso' },
  { label: 'tipo_servicio', titulo: 'Tipo Servicio', tabla: 'Ingreso' },

  { label: 'autoridad_ingreso', titulo: 'Autoridad Ingreso', tabla: 'Ingreso' },

  { label: 'lugar_siniestro', titulo: 'Lugar Siniestro', tabla: 'Ingreso' },
  { label: 'motivo_ingreso', titulo: 'Motivo Ingreso', tabla: 'Ingreso' },
  { label: 'fecha_ingreso', titulo: 'Fecha de Ingreso', tabla: 'Ingreso' },
]

const camposLiquidos = [
  { label: 'estatus_aceite_motor', titulo: 'Aceite', tabla: 'DetallesAuto' },
  { label: 'estatus_anticongelante', titulo: 'Anticongelante', tabla: 'DetallesAuto' },
  { label: 'estatus_combustible', titulo: 'Estatus Combustible', tabla: 'DetallesAuto' },
  { label: 'estatus_bolsas_aire', titulo: 'Estatus Bolsas de Aire', tabla: 'DetallesAuto' },
]


const vehiculo = ref({ marca: '', submarca: '', modelo: '', anio: '', placas: '', num_serie: '', numero_motor: '', color_original: '', color_actual:'', repuve: '' })
const ingreso = ref({ folio: '', fecha_ingreso: '', tipo_registro: '', tipo_servicio: '', autoridad_ingreso: '', motivo_ingreso: '' , lugar_siniestro: '', })
const mecanica = ref({
  estatus_carroceria: 'N/A', estado_motor: 'N/A', tipo_transmision: 'N/A', estatus_aceite_motor: 'N/A', 
  estatus_combustible: 'N/A', estatus_anticongelante: 'N/A', presencia_bateria: 'N/A', estado_espejos: 'BUENO',
  tipo_combustible: 'N/A', cilindros: 0, cantidad_asientos: 0, estado_asientos: 'N/A',  estatus_bolsas_aire: 'N/A', 
  cant_llantas_delanteras: 0, cant_llantas_traseras: 0, estatus_cristales: 'N/A', estatus_espejos: 'N/A', 
  estatus_odometro: 'N/A', kilometraje_odometro: 0 
})
const objetos = ref([])
const danos = ref([])
const documentos = ref([])
const bitacora = ref([])
const estatusLegal = ref({})
const galeriaFotos = ref([])


const MAPA_CAMPOS_BD = {
  // Datos Vehículo
  'Marca': 'marca',
  'Submarca': 'submarca',
  'Modelo': 'modelo',
  'Año': 'anio',
  'Placas': 'placas',
  'Serie (VIN)': 'num_serie',
  'Número Motor': 'numero_motor', // Corregido
  'Color Actual': 'color_actual',
  'Color Original': 'color_original',
  'Estatus REPUVE': 'repuve',

  // Mecánica
  'Carrocería': 'estatus_carroceria',
  'Cristales': 'estatus_cristales',
  'Espejos': 'estatus_espejos',
  'Motor': 'estado_motor', // Corregido (en el modelo es estado_motor)
  'Cilindros': 'cilindros',
  'Transmisión': 'tipo_transmision',
  'Tipo Combustible': 'tipo_combustible',
  'Asientos': 'cantidad_asientos',
  'Estado Asientos': 'estado_asientos',
  'Estado Asientos': 'estado_asientos',
  'Llantas Del.': 'cant_llantas_delanteras', // Corregido
  'Llantas Tras.': 'cant_llantas_traseras', // Corregido
  'Odómetro': 'estatus_odometro',
  'Kilometraje': 'kilometraje_odometro',

 // Líquidos
  'Aceite': 'estatus_aceite_motor', // Corregido
  'Anticongelante': 'estatus_anticongelante', // Corregido
  'Nivel Comb.': 'estatus_combustible', // Corregido
  'Bolsas de Aire': 'estatus_bolsas_aire',
  'Batería': 'presencia_bateria',

  //fotod
  'Foto Frontal': 'evidencia_foto_frontal',
  'Foto Lateral Izquierda': 'evidencia_foto_lateral_izquierda',
  'Foto Lateral Derecha': 'evidencia_foto_lateral_derecha',
  'Foto Interior': 'evidencia_foto_interior',
  'Foto Capó': 'evidencia_foto_capo',
  'Foto Trasera': 'evidencia_foto_trasera'
}

const urlMedia = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${path}`
}

const cargarDatos = async () => {
  try {
    const id = route.params.id
    const { data } = await clienteAxios.get(`ingresos/${id}/`)
    datosIngreso.value = data
    

    
    console.log("--- SCANNER DE DATOS ---")
    console.log("¿Qué llaves mandó Django?:", Object.keys(data))
    console.log("Contenido de objetos:", data.objetos_personales)
    console.log("--- SCANNER DE MECÁNICA ---")
    console.log("Datos de detalles_auto:", data.detalles_auto)
   
    console.log("Estatus legal raw:", data.estatus_legales)
    console.log("Factura:", data.factura_original)
    console.log("fotos", data.fotos_evidencia)

    if (data.estatus_legales?.length) {
      console.log("Primer estatus:", data.estatus_legales[0])
      console.log("Oficio archivo:", data.estatus_legales[0].documento_oficio)
    }

    // 1. Mapeo de Vehículo
    if (data.vehiculo_detalle) {
      vehiculo.value = {
        id: data.vehiculo_detalle.id,
        marca: data.vehiculo_detalle.marca,
        submarca: data.vehiculo_detalle.submarca,
        modelo: data.vehiculo_detalle.modelo,
        anio: data.vehiculo_detalle.anio,
        placas: data.vehiculo_detalle.placas,
        num_serie: data.vehiculo_detalle.num_serie,
        numero_motor: data.vehiculo_detalle.numero_motor || 'S/N',
        color_actual: data.vehiculo_detalle.color_actual,    
        color_original: data.vehiculo_detalle.color_original, 
        repuve: data.vehiculo_detalle.repuve
      }
    }

    // 2. Mapeo de Ingreso
    ingreso.value = {
      id: data.id,                    // ← necesario para el editor
      folio: data.folio,
      fecha_ingreso: new Date(data.fecha_ingreso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      tipo_registro: data.tipo_registro,
      tipo_servicio: data.tipo_servicio,
      autoridad_ingreso: data.autoridad_ingreso,   // ← antes era 'autoridad'
      lugar_siniestro: data.lugar_siniestro,        // ← faltaba
      motivo_ingreso: data.motivo_ingreso,          // ← antes era 'motivo'
    }

    // 3. Mapeo de Mecánica (Tomando el primer elemento del set)
    if (data.detalles_auto) {
      const d = data.detalles_auto
      galeriaFotos.value = data.fotos_evidencia || [];

      if (galeriaFotos.value.length > 0) {
        fotoPrincipal.value = galeriaFotos.value[0]; // Le pasamos el objeto completo, no solo la URL
      }


     // REEMPLAZA mecanica.value = { ... } por esto:
      mecanica.value = {
        estatus_carroceria: d.estatus_carroceria || '',    // ← antes era 'carroceria'
        estatus_cristales: d.estatus_cristales || '',
        estatus_espejos: d.estatus_espejos || '',
        estado_motor: d.estado_motor || '',
        tipo_transmision: d.tipo_transmision || '',
        estatus_aceite_motor: d.estatus_aceite_motor || '',
        estatus_combustible: d.estatus_combustible || '',
        estatus_anticongelante: d.estatus_anticongelante || '',
        presencia_bateria: d.presencia_bateria ? 'SÍ' : 'NO',
        tipo_combustible: d.tipo_combustible || '',
        cilindros: d.cilindros || '',
        cantidad_asientos: d.cantidad_asientos || '',
        cant_llantas_delanteras: d.cant_llantas_delanteras || '',
        cant_llantas_traseras: d.cant_llantas_traseras || '',   // ← ojo: el campo en camposMecanica tiene 'cants_' con s
        estado_asientos: d.estado_asientos || '',
        estatus_bolsas_aire: d.estatus_bolsas_aire || '',
        estatus_odometro: d.estatus_odometro || '',
        kilometraje_odometro: d.kilometraje_odometro || 0
      }
    }

    // 4. Listas de Objetos y Daños (Asegúrate que los nombres coincidan con tu Serializer)
    // Cambia esto:
    objetos.value = data.objetos_personales || [];
    danos.value = data.registros_danos || []
    bitacora.value = data.historial_set || [];

    // 5. Unificación de Documentos
    const listaDocs = []

    // 1️⃣ Estatus Legal (primero se obtiene)
    const estatus = data.estatus_legales?.[0]

    // 2️⃣ Factura
    if (data.factura_original) {
      listaDocs.push({ 
        id: 'factura', 
        nombre_documento: 'Factura Original', 
        archivo: data.factura_original, 
        tipo: 'PDF' 
      })
    }

    // 3️⃣ Oficio legal (si existe)
    if (estatus?.documento_oficio) {
      listaDocs.push({
        id: 'oficio',
        nombre_documento: 'Oficio Legal',
        archivo: estatus.documento_oficio,
        tipo: 'PDF'
      })
    }

    // 4️⃣ Mapear datos de estatus legal
    if (estatus) {
      estatusLegal.value = {
        condicion: estatus.condicion_juridica,
        oficio: estatus.num_oficio,
        fecha: new Date(estatus.fecha_oficio).toLocaleDateString('es-MX'),
        observaciones: estatus.observaciones || 'Sin observaciones'
      }
    }

    // 5️⃣ Guardar documentos
    documentos.value = listaDocs
    

    
     /*if (data.vehiculo_detalle?.foto_principal) {
        fotoPrincipal.value = data.vehiculo_detalle.foto_principal
      }*/
    

  } catch (error) {
    console.error("Error al cargar:", error)
    Swal.fire({
      icon: 'error',
      title: 'Error al cargar',
      text: error?.response?.data?.message || error.message || 'Error desconocido'
    })
  } finally {
    loading.value = false
  }
}
onMounted(cargarDatos)



const cerrarEditor = () => { drawerSolicitud.value = false }


const obtenerEtiquetaBonita = (label) => {
  const todos = [...camposVehiculo, ...camposMecanica, ...camposLiquidos, ...camposIngreso]
  const encontrado = todos.find(c => c.label === label)
  return encontrado?.titulo || label
}



// Y asegúrate de tener el manejador de la imagen
const handleEvidencia = (e) => {
  const file = e.target.files[0]
  if (file) {
    evidenciaPreview.value = URL.createObjectURL(file)
    formEdicion.value.evidencia = file // Aquí guardamos el archivo para el POST de Axios
  }
}
const enviarSolicitud = async () => {
  // 1. Validaciones básicas
  const requiereJustificacion = ['EDICION_NORMAL', 'FOTO_EXTRA', 'NUEVO_DOCUMENTO']
  if (requiereJustificacion.includes(modoFormulario.value) && !formEdicion.value.justificacion) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo obligatorio',
      text: 'Por favor, ingresa una justificación para este movimiento.'
    })
    return;
  }
  // Si es una foto extra o un documento, el archivo es obligatorio
  if ((modoFormulario.value === 'FOTO_EXTRA' || modoFormulario.value === 'NUEVO_DOCUMENTO') && !formEdicion.value.evidencia) {
    Swal.fire({
      icon: 'warning',
      title: 'Archivo obligatorio',
      text: 'Para este registro, la foto o documento es obligatorio.'
    })
    return;
  }

  loading.value = true;
  const formData = new FormData();

  // 2. Empaquetamos los datos comunes
  formData.append('ingreso_id', route.params.id);
  formData.append('justificacion', formEdicion.value.justificacion);
  formData.append('modo', modoFormulario.value); // Le avisamos al backend qué estamos haciendo

  // 3. Empaquetamos según el MODO seleccionado
  if (modoFormulario.value === 'FOTO_EXTRA') {
    formData.append('nombre_foto', formEdicion.value.valor_nuevo); // El nombre que le puso el usuario
    formData.append('archivo', formEdicion.value.evidencia);

  } else if (modoFormulario.value === 'NUEVO_DANO') {
    formData.append('parte_vehiculo', formNuevoDano.value.parte_vehiculo);
    formData.append('descripcion', formNuevoDano.value.descripcion);
    if (formEdicion.value.evidencia) formData.append('archivo', formEdicion.value.evidencia);

  } else if (modoFormulario.value === 'NUEVO_OBJETO') {
    formData.append('descripcion', formNuevoObjeto.value.descripcion);
    formData.append('cantidad', formNuevoObjeto.value.cantidad);
    formData.append('estado', formNuevoObjeto.value.estado);
    if (formEdicion.value.evidencia) formData.append('archivo', formEdicion.value.evidencia);

  } else if (modoFormulario.value === 'NUEVO_DOCUMENTO') {
    formData.append('tipo_documento', formEdicion.value.valor_nuevo); // Factura, Oficio, etc.
    formData.append('archivo', formEdicion.value.evidencia);

  } else {
    // MODO: EDICION_NORMAL (El que ya tenías)
    formData.append('campo', campoAEditar.value.label);
    formData.append('valor_nuevo', formEdicion.value.valor_nuevo);
    formData.append('tabla', campoAEditar.value.tabla || '');
    formData.append('id_especifico', campoAEditar.value.id_especifico || '');
    if (formEdicion.value.evidencia) formData.append('archivo', formEdicion.value.evidencia);
  }

  try {
    // 4. Disparamos la petición al backend
    // Nota: Asegúrate de tener esta ruta en tu urls.py del backend
    const response = await clienteAxios.post('ingresos/crear-solicitud-cambio/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Usamos la variable imprimiéndola:
    console.log("Éxito desde Django:", response.data);

    await Swal.fire({
      icon: 'success',
      title: 'Solicitud enviada',
      text: 'El administrador la revisará pronto.',
      confirmButtonText: 'Entendido'
    })
    cerrarEditor();
    // Opcional: recargar los datos para ver los cambios si el usuario es Admin
    // cargarDatos(); 
    
  } catch (error) {
     // ← agregar
    await Swal.fire({
      icon: 'error',
      title: 'Error al procesar',
      text: 'Hubo un problema al procesar la solicitud.'
    })
} finally {
    loading.value = false;
  }
};


const obtenerFotoPrincipal = computed(() => {
  // Si el ingreso tiene fotos registradas, usa la primera, si no, usa la de Unsplash
  return datosIngreso.value?.fotos?.length > 0 
    ? datosIngreso.value.fotos[0].imagen 
    : 'https://images.unsplash.com/photo-1590362891175-9a744426d6b2?w=1000'
})



const formInspeccion = ref({
  identificacion_ok: true,
  inventario_ok: true,
  estado_fisico_ok: true,
  documentacion_ok: true,
  resultado: 'APROBADO',
  observaciones_admin: ''
})


const checksInspeccion = [{ model: 'identificacion_ok', label: 'Datos ID (Placas/VIN) correctos' }, 
  { model: 'inventario_ok', label: 'Inventario físico verificado' }, { model: 'estado_fisico_ok', label: 'Daños físicos validados con fotos' },
   {model: 'documentacion_ok', label: 'Documentación legible'}]

const RESULTADOS_INS = [{ value: 'APROBADO', label: 'Aprobado' }, { value: 'RECHAZADO', label: 'Rechazado' }, { value: 'OBSERVADO', label: 'Aprobado con Obs.' }]

const guardarInspeccion = async () => {
  try {
    // 1. Obtener y limpiar el ID del ingreso
    const idIngreso = Array.isArray(route.params.id) 
      ? route.params.id[0] 
      : route.params.id

    if (!idIngreso) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de sistema',
        text: 'No hay ID de ingreso'
      })
      return
    }
    if (!auth.user_id) {
      await Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'No hay usuario logueado'
      })
      return
    }

    // 2. Validar si ya existe (para evitar duplicados en OneToOne)
    const res = await clienteAxios.get(`/inspecciones/?ingreso=${idIngreso}`);
    if (res.data.length > 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Inspección duplicada',
        text: 'Ya existe una inspección para este ingreso'
      })
      return;
    }

    // 3. Construir el Payload LIMPIO (Sin el operador spread ...)
    // Esto asegura que Django reciba exactamente lo que espera
    const payload = {
      ingreso: Number(idIngreso),     // Nombre estándar
      ingreso_id: Number(idIngreso),  // Nombre explícito para la DB
      administrador: Number(auth.user_id),
      resultado: formInspeccion.value.resultado,
      observaciones_admin: formInspeccion.value.observaciones_admin,
      identificacion_ok: formInspeccion.value.identificacion_ok,
      inventario_ok: formInspeccion.value.inventario_ok,
      estado_fisico_ok: formInspeccion.value.estado_fisico_ok, 
      documentacion_ok: formInspeccion.value.documentacion_ok
    };

    

    // 4. Único envío a la API
    await clienteAxios.post('/inspecciones/', payload);

    // 5. Éxito
    drawerInspeccion.value = false;
    await Swal.fire({
        icon: 'success',
        title: 'Inspección guardada',
        text: 'La inspección se guardó y firmó correctamente.',
        confirmButtonText: 'Aceptar'
      })

  } catch (e) {
    console.error("Error detallado:", e.response?.data);
    // Si Django nos dice qué campo falta, lo mostramos
    const errorMsg = e.response?.data ? JSON.stringify(e.response.data) : 'Error de conexión';
    await Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: errorMsg ?? 'Ocurrió un problema inesperado'
    })
  }
};
</script>

<style scoped>
.drawer-left-enter-active, .drawer-left-leave-active { transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-left-enter-from, .drawer-left-leave-to { transform: translateX(-100%); }
.drawer-enter-active, .drawer-leave-active { transition: transform 0.4s ease; }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
</style>