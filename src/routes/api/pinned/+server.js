import client from '$lib/db.js'

export async function GET() {
  const result = await client.execute(
    'SELECT * FROM pinned ORDER BY order_index',
  )
  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST({ request }) {
  const { repo_name, order_index } = await request.json()
  await client.execute({
    sql: 'INSERT INTO pinned (repo_name, order_index) VALUES (?, ?)',
    args: [repo_name, order_index],
  })
  return new Response(JSON.stringify({ success: true }))
}

export async function DELETE({ request }) {
  const { repo_name } = await request.json()
  await client.execute({
    sql: 'DELETE FROM pinned WHERE repo_name = ?',
    args: [repo_name],
  })
  return new Response(JSON.stringify({ success: true }))
}
