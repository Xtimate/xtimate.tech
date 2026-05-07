import client from '$lib/db.js'

export async function GET() {
  const result = await client.execute(`
    SELECT * FROM guestbook
    ORDER BY created_at DESC
  `)
  return new Response(JSON.stringify(result.rows), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function POST({ request }) {
  const { name, message } = await request.json()
  await client.execute({
    sql: `INSERT INTO guestbook (name, message) VALUES (?, ?)`,
    args: [name, message],
  })
  return new Response(JSON.stringify({ success: true }))
}
