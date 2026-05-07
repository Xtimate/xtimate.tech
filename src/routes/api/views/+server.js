import client from '$lib/db.js'

export async function GET() {
  const result = await client.execute(`SELECT * FROM views`)
  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST({ request }) {
  const { repo_name } = await request.json()
  await client.execute({
    sql: `INSERT INTO views (repo_name, count) VALUES (?, 1)
          ON CONFLICT (repo_name) DO UPDATE SET count = count + 1`,
    args: [repo_name],
  })
  const result = await client.execute({
    sql: `SELECT count FROM views WHERE repo_name = ?`,
    args: [repo_name],
  })
  return new Response(JSON.stringify({ count: result.rows[0].count }))
}
