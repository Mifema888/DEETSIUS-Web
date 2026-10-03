import { defineDb, defineTable, column, NOW } from 'astro:db';

// 1. SISTEMA DE NOTICIAS Y AVISOS
export const Noticias = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    titulo: column.text(),
    subtitulo: column.text({ optional: true }),
    categoria: column.text({ default: 'Aviso' }), // Ej: 'Aviso', 'Académico', 'Evento', 'Becas'
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
    dni: column.text(),
    telefono: column.text({ optional: true }),
    curso: column.text({ optional: true }),
    tipoElemento: column.text(),
    fechaPrestamo: column.date({ default: NOW }),
    estado: column.text({ default: 'Activo' }),
  },
});

// 3. OBJETOS EN CUSTODIA (Objetos reales que tiene la Delegación)
export const ObjetosCustodiados = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    objeto: column.text(),                         // Qué es (Ej: Mochila negra)
    lugar: column.text(),                          // Dónde se encontró (PRIVADO: Solo para el Dashboard)
    fechaRecepcion: column.date({ default: NOW }), // Cuándo se encontró (PRIVADO: Solo para el Dashboard)
    rasgos: column.text({ optional: true }),       // Descripción pública (Visible en Servicios y Dashboard)
    estado: column.text({ default: 'En Custodia' }),// 'En Custodia' | 'Devuelto'
  },
});

// 4. REPORTES DE OBJETOS PERDIDOS (Enviados por los alumnos desde la web)
export const ReportesObjetosPerdidos = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    nombreAlumno: column.text(),
    telefono: column.text(),
    objeto: column.text(),                         // Qué objeto busca
    lugar: column.text({ optional: true }),        // Dónde cree que lo perdió
    fechaPerdida: column.text({ optional: true }),  // Cuándo lo perdió aproximadamente
    rasgos: column.text({ optional: true }),       // Detalles para identificarlo
    fechaReporte: column.date({ default: NOW }),
    estado: column.text({ default: 'Pendiente' }), // 'Pendiente' | 'Contactado' | 'Resuelto'
  },
});

// 5. SANCIONES E INCIDENCIAS (Lista Negra)
export const Incidencias = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    alumno: column.text(),
    dni: column.text(),
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
  },
});