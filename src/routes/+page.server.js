import client from "$lib/db.js";

export async function load({ fetch }) {
  const response = await fetch(
    "https://api.github.com/users/Xtimate/repos?sort=updated&per_page=20",
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  const repos = await response.json();
  const result = await client.execute(
    "SELECT * FROM posts ORDER BY created_at DESC",
  );
  const posts = result.rows;
  return { repos, posts };
}
