import pool from '@/lib/database';

export async function GET(req) {
  const url = new URL(req.url);
  const document_number = url.searchParams.get('document_number');

  console.log('Received document_number:', document_number); // Log para verificar el document_number recibido

  if (!document_number) {
    return new Response(JSON.stringify({ error: 'Document number is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE document_number = ?', [document_number]);
    console.log('Query result:', rows); // Log para verificar el resultado de la consulta
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error querying database:', error); // Log para verificar cualquier error en la consulta
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}