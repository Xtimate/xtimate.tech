import client from '$lib/db.js'
import { redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
const PASSWORD = env.ADMIN_PASSWORD

export async function load({ fetch, cookies }) {
  const auth = cookies.get('admin_auth')
  if (auth !== PASSWORD) throw redirect(303, '/admin/login')

  const repoRes = await fetch('api/github')
  const repos = await repoRes.json()

  const pinnedRes = await fetch('api/pinned')
  const pinned = await pinnedRes.json()

  const postRes = await fetch('api/posts')
  const posts = await postRes.json()

  return {
    repos,
    pinned,
    posts,
  }
}
