export async function load({ fetch }) {
  const response = await fetch(
    'https://api.github.com/users/Xtimate/repos?sort=updated&per_page=20',
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    },
  )

  console.log('status:', response.status)
  const repos = await response.json()
  console.log('first repo:', repos[0]?.name)

  return { repos }
}
