<script>
    let { data } = $props();

    const gradients = [
        "bg-gradient-to-br from-[#1a0040] to-[#0a0020]",
        "bg-gradient-to-tr from-[#2d0060] to-[#0d0030]",
        "bg-gradient-to-bl from-[#1f0050] to-[#080018]",
        "bg-gradient-to-r from-[#3a0070] to-[#100025]",
        "bg-gradient-to-tl from-[#150035] to-[#0a001a]",
        "bg-gradient-to-br from-[#0d0030] to-[#2a0055]",
        "bg-gradient-to-tr from-[#200045] to-[#050010]",
        "bg-gradient-to-b from-[#2a0058] to-[#0a0022]",
        "bg-gradient-to-bl from-[#350068] to-[#0f0028]",
        "bg-gradient-to-r from-[#110030] to-[#3d0075]",
        "bg-gradient-to-tl from-[#1c0042] to-[#080015]",
        "bg-gradient-to-br from-[#280055] to-[#0c001f]",
        "bg-gradient-to-tr from-[#0e0028] to-[#320065]",
        "bg-gradient-to-bl from-[#220048] to-[#09001c]",
        "bg-gradient-to-r from-[#300062] to-[#110028]",
    ];

    const getGradient = (id) => gradients[id % gradients.length];
</script>

<main>
    <h1 class="text-white text-4xl font-bold flex justify-center">
        Xtimate.tech
    </h1>
    <div class="flex flex-wrap gap-4 justify-center">
        {#each data.repos as repo (repo.id)}
            <div
                class="{getGradient(
                    repo.id,
                )} repo-card text-white bg-gradient-to-br rounded-2xl border border-slate-400/30 hover:border-purple-500/40 p-3 w-80"
            >
                <a href={repo.html_url} target="_blank" rel="noreferrer"
                    >{repo.name}</a
                >
                <h2>{repo.language}</h2>
                <i class="devicon-{repo.language?.toLowerCase()}-plain"></i>
                <p>{repo.description || "No description"}</p>
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    class="text-blue-400">View on GitHub</a
                >
                <span class="text-white/60 text-sm"
                    >⭐ {repo.stargazers_count}</span
                >
            </div>
        {/each}
    </div>
</main>
