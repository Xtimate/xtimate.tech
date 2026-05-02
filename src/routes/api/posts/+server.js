import client from '$lib/db.js'

export async function GET() {
  const result = await client.execute(
    'SELECT * FROM posts ORDER BY created_at DESC',
  )
  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST({ request }) {
  const { title, content } = await request.json()
  await client.execute({
    sql: 'INSERT INTO posts (title, content) VALUES (?, ?)',
    args: [title, content],
  })
  return new Response(JSON.stringify({ success: true }))
}
