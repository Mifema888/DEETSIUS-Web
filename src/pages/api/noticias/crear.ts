import type { APIRoute } from 'astro';
import { db, Noticias } from 'astro:db';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verificación de sesión administrativa
  const sessionToken = cookies.get('session_token')?.value;
  if (!sessionToken) {
    return new Response(
      JSON.stringify({ message: 'No autorizado.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { titulo, subtitulo, categoria, contenido, resumen, urlImagen, destacada, autor } = body;

    if (!titulo?.trim() || !contenido?.trim()) {
      return new Response(
        JSON.stringify({ message: 'El título y el contenido son obligatorios.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generar automáticamente un resumen corto si no se proporciona uno
    const resumenAuto = resumen?.trim() || (contenido.trim().slice(0, 140) + '...');

    await db.insert(Noticias).values({
      titulo: titulo.trim(),
      subtitulo: subtitulo?.trim() || null,
      categoria: categoria?.trim() || 'Aviso',
      contenido: contenido.trim(),
      resumen: resumenAuto,
      urlImagen: urlImagen?.trim() || null,
      destacada: Boolean(destacada),
      autor: autor?.trim() || 'Delegación de Estudiantes',
    });

    return new Response(
      JSON.stringify({ message: 'Noticia o aviso publicado correctamente.' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al publicar noticia:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno al guardar la noticia.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};