import { json } from '@sveltejs/kit'

export async function GET({ url }) {
  const code = url.searchParams.get('code')
  return json({ code })
}
