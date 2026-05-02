<script>
  let { data } = $props()
  console.log(data.repos)
</script>

{#each data.repos as repo (repo.id)}
  <div class="repo-card">
    <h2>{repo.name}</h2>
    <p>{repo.description || 'No description'}</p>
    <a href={repo.html_url} target="_blank" rel="noreferrer">View on GitHub</a>
  </div>
{/each}
