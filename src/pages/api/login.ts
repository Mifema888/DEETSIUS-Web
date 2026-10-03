import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { db, SesionesLog, eq } from 'astro:db';

export const prerender = false;

function signValue(value: string, secret: string): string {
  const signature = crypto.createHmac('sha256', secret).update(value).digest('hex');
  return `${value}.${signature}`;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  let uvus = '';

  // 1. Lectura del cuerpo de la petición
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      uvus = body.uvus?.toString().trim() || '';
    } else {
      const data = await request.formData();
      uvus = data.get('uvus')?.toString().trim() || '';
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Formato de solicitud no válido' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. Validación de variables de entorno (limpiando espacios)
  const allowedUvus = (import.meta.env.ALLOWED_UVUS || '')
    .split(',')
    .map((u: string) => u.trim());
    
  const adminSecret = import.meta.env.ADMIN_SECRET || process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return new Response(JSON.stringify({ error: 'Configuración de servidor incompleta (falta ADMIN_SECRET)' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (uvus && allowedUvus.includes(uvus)) {
    try {
      const ahora = new Date();

      // 3. Cerrar sesiones anteriores colgadas
      const sesionesPrevias = await db.select().from(SesionesLog).where(eq(SesionesLog.uvus, uvus));
      for (const sesion of sesionesPrevias) {
        if (!sesion.finSesion) {
          await db.update(SesionesLog)
            .set({ finSesion: ahora })
            .where(eq(SesionesLog.id, sesion.id));
        }
      }

      // 4. Registrar la nueva sesión en BD
      const numeroSesion = sesionesPrevias.length + 1;
      const sessionId = `${uvus}-${numeroSesion}`;

      await db.insert(SesionesLog).values({
        sessionId,
        uvus,
        inicioSesion: ahora,
        ultimaActividad: ahora,
      });

      // 5. Configurar cookie adaptándose a HTTPS de Cloudflare Tunnel
      const cookiePayload = `${uvus}:${sessionId}`;
      const signedValue = signValue(cookiePayload, adminSecret);

      const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.url.startsWith('https://');

      cookies.set('admin_session', signedValue, {
        path: '/',
        httpOnly: true,
        secure: isHttps, // Se activa si el túnel usa HTTPS
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 día
      });

      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (dbError) {
      // Si la BD falla, devolvemos un JSON limpio en lugar de romper el servidor
      console.error("Error en base de datos al iniciar sesión:", dbError);
      return new Response(JSON.stringify({ error: 'Error al conectar con la base de datos.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'UVUS no autorizado' }), { 
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
};