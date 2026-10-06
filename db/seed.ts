import { db, Prestamos, EstadoDelegacion, Documentos, EventosAgenda } from 'astro:db';

export default async function seed() {
  // 1. Comprobar e insertar inventario
  const inventarioExistente = await db.select().from(Prestamos);
  if (inventarioExistente.length === 0) {
    await db.insert(Prestamos).values([
      { nombre: 'Bata de Laboratorio', icono: '🥼', total: 10, disponibles: 10 },
      { nombre: 'Calculadora Científica', icono: '🧮', total: 5, disponibles: 5 },
      { nombre: 'Gafas de Protección', icono: '🥽', total: 8, disponibles: 8 },
      { nombre: 'Juego de dibujo técnico', icono: '📐', total: 4, disponibles: 4 },
    ]);
    console.log('🌱 Seed inicial de inventario ejecutado correctamente.');
  }

  // 2. Comprobar e insertar estado de la delegación
  const estadoExistente = await db.select().from(EstadoDelegacion);
  if (estadoExistente.length === 0) {
    await db.insert(EstadoDelegacion).values({
      abierto: true,
      actualizadoEl: new Date(),
    });
    console.log('🌱 Seed inicial de estado de delegación ejecutado.');
  }

  // 3. Comprobar e insertar documentos iniciales
  const docsExistentes = await db.select().from(Documentos);
  if (docsExistentes.length === 0) {
    await db.insert(Documentos).values([
      {
        titulo: "Estatutos de la universidad (BOJA)",
        categoria: "Normativa General",
        descripcion: 'Los Estatutos son la "constitución" de la universidad: la norma suprema que define su estructura de gobierno y marco general, sobre la que luego se apoyan reglamentos específicos como el RGE o los proyectos docentes.',
        urlDescarga: "https://www.juntadeandalucia.es/boja/2025/508/BOJA25-508-00085-6229-01_00319829.pdf",
        tamano: "PDF Oficial US"
      },
      {
        titulo: "Reglamento General de Estudiantes",
        categoria: "Estudiantes",
        descripcion: "Marco regulador principal de los derechos y deberes de los alumnos, así como los órganos de representación estudiantil de la US.",
        urlDescarga: "https://www.us.es/sites/default/files/2019-05/2009_03_19_CU_RG_ESTUDIANTES.pdf",
        tamano: "PDF Oficial US"
      },
      {
        titulo: "Reglamento General de Actividades Docentes (RGAD)",
        categoria: "Profesorado",
        descripcion: "Guía oficial que regula todo lo relacionado con tus clases y asignaturas: desde cómo se organizan los horarios y los exámenes hasta las normas de evaluación y la convocatoria de llamamientos.",
        urlDescarga: "https://www.us.es/sites/default/files/2019-05/RGAD_consolidado.pdf",
        tamano: "PDF Oficial US"
      }
    ]);
    console.log('🌱 Seed inicial de documentos ejecutado correctamente.');
  }

// 4. Comprobar e insertar eventos iniciales
  const eventosExistentes = await db.select().from(EventosAgenda);
  if (eventosExistentes.length === 0) {
    await db.insert(EventosAgenda).values([
      {
        titulo: "Reunión interna de la Delegación",
        tipo: "Trabajo Interno",
        fecha: new Date("2026-10-05"),
        horaInicio: "18:30 - 19:30",
        lugar: "Sede Delegación",
        descripcion: "Coordinación de nuevas herramientas para el portal del estudiante."
      },
      {
        titulo: "Sesión abierta: Reforma Normativa Académica",
        tipo: "Junta de Escuela",
        fecha: new Date("2026-10-06"),
        horaInicio: "18:30 - 19:30",
        lugar: "Salón de Grados ETSI",
        descripcion: "Debate abierto con alumnos para recoger propuestas de cambios en reglamentos."
      },
      {
        titulo: "Pleno Ordinario del CADUS",
        tipo: "CADUS",
        fecha: new Date("2026-10-15"),
        horaInicio: "16:30 - 19:30",
        lugar: "Rectorado / Teams",
        descripcion: "Debate sobre presupuestos de representación y propuestas de mejora."
      },
      {
        titulo: "Congreso del CEET",
        tipo: "Sectorial",
        fecha: new Date("2026-10-22"),
        horaInicio: "10:00 - 14:00",
        lugar: "Salón de Actos",
        descripcion: "Encuentro interuniversitario para coordinar posturas en titulaciones de ingeniería."
      }
    ]);
    console.log('🌱 Seed inicial de eventos ejecutado correctamente.');
  }
}