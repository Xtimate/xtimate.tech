import client from "$lib/db.js";

export async function GET() {
  console.log("GET /api/posts hit");
  const result = await client.execute(
    "SELECT * FROM posts ORDER BY created_at DESC",
  );
  console.log("fetched posts:", result.rows);
  return new Response(JSON.stringify(result.rows), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  const { title, content } = await request.json();
  await client.execute({
    sql: "INSERT INTO posts (title, content) VALUES (?, ?)",
    args: [title, content],
  });
  return new Response(JSON.stringify({ success: true }));
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  await client.execute({
    sql: "DELETE FROM posts WHERE id = ?",
    args: [id],
  });
  return new Response(JSON.stringify({ success: true }));
}
