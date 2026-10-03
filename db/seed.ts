import { db, Prestamos, EstadoDelegacion } from 'astro:db';

export default async function seed() {
  // 1. Comprobar si ya existen registros de inventario en la base de datos
  const inventarioExistente = await db.select().from(Prestamos);

  // Solo si la tabla está completamente vacía se insertan los datos por primera vez
  if (inventarioExistente.length === 0) {
    await db.insert(Prestamos).values([
      { nombre: 'Bata de Laboratorio', icono: '🥼', total: 10, disponibles: 10 },
      { nombre: 'Calculadora Científica', icono: '🧮', total: 5, disponibles: 5 },
      { nombre: 'Gafas de Protección', icono: '🥽', total: 8, disponibles: 8 },
      { nombre: 'Juego de dibujo técnico', icono: '📐', total: 4, disponibles: 4 },
    ]);
    console.log('🌱 Seed inicial de inventario ejecutado correctamente.');
  }

  // 2. Comprobar si existe el registro inicial del estado de la delegación
  const estadoExistente = await db.select().from(EstadoDelegacion);
  if (estadoExistente.length === 0) {
    await db.insert(EstadoDelegacion).values({
      abierto: true,
      actualizadoEl: new Date(),
    });
  }
}