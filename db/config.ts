import { defineDb, defineTable, column, NOW } from 'astro:db';

// 1. SISTEMA DE NOTICIAS Y AVISOS
export const Noticias = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    titulo: column.text(),
    subtitulo: column.text({ optional: true }),
    categoria: column.text({ default: 'Aviso' }),
    contenido: column.text(),
    resumen: column.text({ optional: true }),
    urlImagen: column.text({ optional: true }),
    posicionImagen: column.text({ optional: true, default: 'center' }),
    destacada: column.boolean({ default: false }),
    autor: column.text({ default: 'Delegación de Estudiantes' }),
    fechaPublicacion: column.date({ default: NOW }),
  },
});

// 2. SISTEMA DE PRÉSTAMOS DE MATERIAL
export const Prestamos = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    nombre: column.text(),
    total: column.number({ default: 0 }),
    disponibles: column.number({ default: 0 }),
    icono: column.text({ default: '📦' }),
  },
});

export const RegPrestamos = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    alumno: column.text(),
    telefono: column.text(),
    curso: column.text({ optional: true }),
    tipoElemento: column.text(),
    numeroObjeto: column.text(), // Identificador de la bata/objeto numerado
    fechaPrestamo: column.date({ default: NOW }),
    estado: column.text({ default: 'Activo' }),
  },
});

// 3. OBJETOS EN CUSTODIA
export const ObjetosCustodiados = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    objeto: column.text(),                    
    lugar: column.text(),                     
    fechaRecepcion: column.date({ default: NOW }), 
    rasgos: column.text({ optional: true }),      
    estado: column.text({ default: 'En Custodia' }),
  },
});

// 4. REPORTES DE OBJETOS PERDIDOS
export const ReportesObjetosPerdidos = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    nombreAlumno: column.text(),
    telefono: column.text(),
    objeto: column.text(),                    
    lugar: column.text({ optional: true }),        
    fechaPerdida: column.text({ optional: true }),  
    rasgos: column.text({ optional: true }),      
    fechaReporte: column.date({ default: NOW }),
    estado: column.text({ default: 'Pendiente' }), 
  },
});

// 5. SANCIONES E INCIDENCIAS (Lista Negra por Teléfono y Objeto)
export const Incidencias = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    alumno: column.text(),
    telefono: column.text(), // El bloqueo por lista negra ahora actúa por teléfono
    numeroObjeto: column.text({ optional: true }), // Guarda el número de la bata perdida
    tipoElemento: column.text({ default: 'Sanción Manual' }),
    motivo: column.text(),
    fechaRegistro: column.date({ default: NOW }),
  },
});

// 6. ESTADO EN TIEMPO REAL DE LA DELEGACIÓN
export const EstadoDelegacion = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    abierto: column.boolean({ default: false }),
    actualizadoEl: column.date({ default: NOW }),
  },
});

// 7. AUDITORÍA Y CONTROL DE ACCESOS
export const SesionesLog = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    sessionId: column.text(),
    uvus: column.text(),
    inicioSesion: column.date({ default: NOW }),
    ultimaActividad: column.date({ default: NOW }),
    finSesion: column.date({ optional: true }),
  },
});

export const Documentos = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    titulo: column.text(),
    categoria: column.text(),
    descripcion: column.text(),
    urlDescarga: column.text(),
    tamano: column.text({ optional: true }),
  }
});

export const EventosAgenda = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    titulo: column.text(),
    tipo: column.text(),
    fecha: column.date(),
    horaInicio: column.text({ optional: true }),
    lugar: column.text({ optional: true }),
    descripcion: column.text({ optional: true }),
  }
});

export const FAQs = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    pregunta: column.text(),
    respuesta: column.text(),
    categoria: column.text({ default: 'General' }),
  }
});

export default defineDb({
  tables: {
    Noticias,
    Prestamos,
    RegPrestamos,
    ObjetosCustodiados,
    ReportesObjetosPerdidos,
    Incidencias,
    EstadoDelegacion,
    SesionesLog,
    Documentos,
    EventosAgenda,
    FAQs
  },
});