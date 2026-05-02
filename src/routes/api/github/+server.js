export async function GET() {
  const respons = await fetch(
    'https://api.github.com/users/Xtimate/repos?sort=updated&per_page=20',
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    },
  )

  const repos = await respons.json()

  return new Response(JSON.stringify(repos), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
