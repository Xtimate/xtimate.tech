import client from "$lib/db.js";

export async function load({ fetch }) {
  const repoRes = await fetch("api/github");
  const repos = await repoRes.json();

  const pinnedRes = await fetch("api/pinned");
  const pinned = await pinnedRes.json();

  const postRes = await fetch("api/posts");
  const posts = await postRes.json();

  return {
    repos,
    pinned,
    posts,
  };
}
