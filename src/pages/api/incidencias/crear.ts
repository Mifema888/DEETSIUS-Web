import type { APIRoute } from 'astro';
import { db, Incidencias } from 'astro:db';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // 1. Verificación de seguridad (solo miembros autenticados)
  const sessionToken = cookies.get('session_token')?.value;
  if (!sessionToken) {
    return new Response(
      JSON.stringify({ message: 'No autorizado para realizar esta acción.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { alumno, dni, objeto, tipoObjeto, motivo } = body;

    // 2. Validación de campos obligatorios
    if (!alumno?.trim() || !dni?.trim()) {
      return new Response(
        JSON.stringify({ message: 'El nombre del alumno y el DNI/UVUS son obligatorios.' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Normalización de valores por defecto
    const motivoFinal = motivo?.trim() || `No devuelto: ${objeto || 'Material de préstamo'}`;
    const tipoFinal = tipoObjeto?.trim() || 'Sanción Manual';

    // 4. Inserción en Astro DB
    await db.insert(Incidencias).values({
      alumno: alumno.trim(),
      dni: dni.trim().toUpperCase(),
      tipoElemento: tipoFinal,
      motivo: motivoFinal,
    });

    return new Response(
      JSON.stringify({ message: 'Incidencia registrada con éxito.' }), 
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al registrar incidencia:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor al guardar la incidencia.' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};