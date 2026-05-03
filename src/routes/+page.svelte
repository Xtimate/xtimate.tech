<script>
    let { data } = $props();

    let displayed = $state('');
    let done = $state(false);
    const text = 'Hello, I\'m Xtimate';

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
    $effect(() => {
      console.log('effect running')
      let i = 0
      const interval = setInterval(() => {
        displayed = displayed + text[i]
        i++
        if (i >= text.length) {
          clearInterval(interval)
          done = true
        }
      }, 80)
    })
    const getGradient = (id) => gradients[id % gradients.length];

    function tilt(node) {
      node.style.transition = 'transform 0.05s ease'
      const handleMove = (e) => {
        node.style.transition = 'transform 0.05s ease'
        const rect = node.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10
        node.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
      }

      const handleLeave = () => {
        node.style.transition = 'transform 0.3s ease'
        node.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
      }

      node.addEventListener('mousemove', handleMove)
      node.addEventListener('mouseleave', handleLeave)

      return {
        destroy() {
          node.removeEventListener('mousemove', handleMove)
          node.removeEventListener('mouseleave', handleLeave)
        }
      }
    }
</script>

<main>
    <h1 class="text-white text-5xl font-bold flex justify-center pt-5">
        Xtimate.tech
    </h1>
    <div class="text-white flex justify-center gap-1 pt-5">
        <span>></span>
        <h1 class="flex justify-center gap-1">{displayed}
            <span class="cursor-blink text-white">▌</span>
        </h1>
    </div>
    {#if done}
        <div class="flex flex-wrap gap-4 justify-center pt-6">
            {#each data.repos as repo, index (repo.id)}
                <div class="animate-fade-up opacity-0" style="animation-delay: {0.4 + index * 0.8}s">
                    <div
                        use:tilt
                        class="{getGradient(
                            repo.id,
                        )} repo-card text-white bg-gradient-to-br rounded-2xl border border-slate-400/30 hover:border-purple-500/40 p-3 w-80 transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                        style="animation-delay: {0.4 + index * 0.8}s"
                    >
                        <div class="flex items-center gap-2 pt-3">
                            <h2>{repo.language}</h2>
                            <i class="devicon-{repo.language?.toLowerCase()}-plain"></i>
                        </div>
                        <p>{repo.description || "No description"}</p>
                        <span class="text-white/60 text-sm"
                            >⭐ {repo.stargazers_count}</span
                        >
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>
