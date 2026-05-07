<script>
    import { tick, onMount } from "svelte";
    let { data } = $props();
    let totalStars = $derived(
        data.taggedRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    );
    let displayed = $state("");
    let done = $state(false);
    let activePost = $state(null);
    let activeTab = $state("home");
    let pillEl;
    let homeEl
    let hackatime = $state(null)
    let statsEl;
    let viewCounts = $state({});
    let guestbook = $state([])
    let guestName = $state('')
    let guestMessage = $state('')
    let guestSubmitting = $state(false)
    let hackatimeExpanded = $state(false)

    const switchTab = (tab) => {
        konamiActivated = false;
        activeTab = tab;
    };
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning, I'm Xtimate  ";
        if (hour < 18) return "Good afternoon, I'm Xtimate  ";
        return "Good evening, I'm Xtimate";
    };
    const text = getGreeting();

    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    let konamiIndex = $state(0)
    let konamiActivated = $state(false)

    function handleKeydown(e) {
      console.log('key:', e.key, 'index:', konamiIndex)
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex = konamiIndex + 1
        if (konamiIndex === konamiCode.length) {
          console.log('konami activated')
          konamiActivated = true
          konamiIndex = 0
        }
      } else {
        konamiIndex = 0
      }
    }

    let totalRepos = $derived(data.taggedRepos.length);

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
        console.log("effect running");
        let i = 0;
        const interval = setInterval(() => {
            displayed = displayed + text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                done = true;
            }
        }, 80);
    });

    const languageBreakdown = $derived(
      Object.entries(
        data.taggedRepos
          .filter(repo => repo.language)
          .reduce((acc, repo) => {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
            return acc;
          }, {})
      ).sort((a, b) => b[1] - a[1])
    );

    const lastActive = $derived(
      (() => {
        const mostRecent = data.taggedRepos.find(repo => repo.isNowBuilding)
        if (!mostRecent) return "unknown"

        const diff = Date.now() - new Date(mostRecent.updated_at).getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (days > 0) return `${days}d ${hours}h ${minutes}m ago`
        if (hours > 0) return `${hours}h ${minutes}m ago`
        return `${minutes}m ago`
      })()
    )

    const totalForks = $derived(
      data.taggedRepos.reduce((sum, repo) => sum + repo.forks_count, 0)
    )

    async function fetchHackatime() {
     const res = await fetch("/api/hackatime")
     hackatime = await res.json()
     console.log("hackatime", hackatime)
    }

    async function fetchAndIncrementView(repo_name) {
      const res = await fetch(`/api/views/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_name })
      })
      const { count } = await res.json()
      viewCounts = { ...viewCounts, [repo_name]: count}
    }

    async function fetchGuestbook() {
      const res = await fetch("/api/guestbook")
      guestbook = await res.json()
    }

    async function submitGuest() {
      if (!guestName.trim() || !guestMessage.trim()) return
      guestSubmitting = true
      await fetch("/api/guestbook", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName, message: guestMessage })
      })
      guestName = ''
      guestMessage = ''
      guestSubmitting = false
      await fetchGuestbook()
    }

    onMount(() => {
      fetchHackatime()
      const interval = setInterval(fetchHackatime, 60000)
      data.taggedRepos.forEach(repo => fetchAndIncrementView(repo.name))
      fetchGuestbook()
      return () => clearInterval(interval)
    })

    $effect(() => {
        if (!pillEl || !homeEl || !statsEl) return;
        const target = activeTab === "home" ? homeEl : statsEl;
        pillEl.style.width = `${target.offsetWidth}px`;
        pillEl.style.left = `${target.offsetLeft}px`;
    });

    let contactDelay = $derived(4.8 + data.posts.length * 0.8);
    const getGradient = (id) => gradients[id % gradients.length];

    let copied = $state(false);

    const copyDiscord = async () => {
        const el = document.createElement("textarea");
        el.value = ".xtimate";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        copied = true;
        await tick();
        setTimeout(() => (copied = false), 2000);
    };

    function tilt(node) {
        node.style.transition = "transform 0.05s ease";
        const handleMove = (e) => {
            node.style.transition = "transform 0.05s ease";
            const rect = node.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            node.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        };


        const handleLeave = () => {
            node.style.transition = "transform 0.3s ease";
            node.style.transform =
                "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
        };

        node.addEventListener("mousemove", handleMove);
        node.addEventListener("mouseleave", handleLeave);

        return {
            destroy() {
                node.removeEventListener("mousemove", handleMove);
                node.removeEventListener("mouseleave", handleLeave);
            },
        };
    }
</script>
<svelte:window on:keydown={handleKeydown} />
<main>
    <div class="relative flex justify-center gap-2 pt-4">
        <div
            class="relative flex bg-purple-500/10 border border-purple-500/20 rounded-full p-1"
        >
            <button
                bind:this={homeEl}
                onclick={() => switchTab("home")}
                class="relative z-10 px-4 py-2 rounded-full text-sm transition-colors duration-200 {activeTab ===
                'home'
                    ? 'text-white'
                    : 'text-purple-300'}"
            >
                Home
            </button>
            <button
                bind:this={statsEl}
                onclick={() => switchTab("stats")}
                class="relative z-10 px-4 py-2 rounded-full text-sm transition-colors duration-200 {activeTab ===
                'stats'
                    ? 'text-white'
                    : 'text-purple-300'}"
            >
                Stats
            </button>
            <div
                bind:this={pillEl}
                class="absolute top-1 left-1 h-[calc(100%-8px)] bg-purple-500 rounded-full transition-all duration-300 ease-in-out"
            ></div>
        </div>
    </div>
    {#if konamiActivated}
    <div class="{getGradient(5)} fixed inset-0 w-full h-full z-50 flex items-center justify-center">
        <div class="{getGradient(9)} flex-wrap w-fit p-3 rounded-2xl border border-1 border-color-slate-400/30 justify-center items-center">
            <button class="text-purple-300 text-sm" onclick={() => switchTab("home")}>Go back to homepage</button>
        </div>
        <div class="flex flex-col p-3">
            <p class="text-purple-300">Congratulations! You found my secret page!</p>
            <p class="text-purple-300 text-sm">Now hire me.</p>
        </div>
    </div>
    {/if}
    {#if activeTab === "home"}
        <h1 class="text-white text-5xl font-bold flex justify-center pt-5">
            Xtimate.tech
        </h1>
        <div class="text-white flex justify-center gap-1 pt-5">
            <span>></span>
            <h1 class="flex justify-center gap-1">
                {displayed}
                <span class="cursor-blink text-white">▌</span>
            </h1>
        </div>
        {#if done}
            <div
                class="opacity-0 w-3/4 mx-auto border-t-2 border-purple-500/20 my-8 animate-fade-up"
                style="animation-delay: 0.2s;"
            ></div>
            <div class="flex flex-wrap gap-4 justify-center">
                {#each data.taggedRepos as repo, index (repo.id)}
                    <div class="relative animate-fade-up opacity-0" style="animation-delay: {0.4 + index * 0.8}s">
                    <div
                        class="animate-fade-up opacity-0"
                        style="animation-delay: {0.8 + index * 0.8}s"
                    >
                        <div
                            use:tilt
                            class="{getGradient(
                                repo.id,
                            )} repo-card text-white bg-gradient-to-br rounded-2xl border border-slate-400/30 hover:border-purple-500/40 p-3 w-80 transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                            style="animation-delay: {0.4 + index * 0.8}s"
                        >
                            {#if repo.isNowBuilding}
                            <div
                                class="opacity-0 z-10 animate-fade-up absolute top-3 right-3 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm px-2 py-1 rounded-2xl flex items-center gap-1"
                                style="animation-delay: {0.8 + index * 0.8}s"
                            >
                                <span>Now building</span>
                            </div>
                            {/if}
                            <a
                                class="text-white font-bold text-lg hover:text-purple-300 transition-colors duration-200"
                                href={repo.html_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {repo.name}
                            </a>
                            <div class="flex items-center gap-2 pt-3">
                                <h2>{repo.language}</h2>
                                <i
                                    class="devicon-{repo.language?.toLowerCase()}-plain"
                                ></i>
                            </div>
                            <p>{repo.description || "No description"}</p>
                            <div class="flex items-center gap-3 mt-1">
                                <span class="flex items-center gap-1 text-white/60 text-xs">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                    {repo.stargazers_count}
                                </span>
                                <span class="flex items-center gap-1 text-white/60 text-xs">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                    </svg>
                                    {viewCounts[repo.name] ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
            <div
                class="opacity-0 w-3/4 mx-auto border-t-2 border-purple-500/20 my-8 animate-fade-up"
                style="animation-delay: 2.4s;"
            ></div>
            <div
                class="opacity-0 px-10 animate-fade-up"
                style="animation-delay: 3.2s;"
            >
                <div
                    class="{getGradient(
                        12,
                    )} p-5 border border-slate-400/30 rounded-2xl"
                >
                    <p class="text-white">
                        Hello, I'm Xtimate. I am a teenage developer from the
                        Netherlands. I primarily build machine learning systems
                        and my focus is making functional apps that actually
                        have a real life application.
                    </p>
                    <p class="text-white mt-3">
                        I code because I find that this is a nice way for me to
                        be artistic in a way; I've never been good with a pencil
                        and paper and coding gives me the oppertunity to express
                        myself creatively.
                    </p>
                    <p class="text-white/70 text-sm mt-3">
                        Currently learning SvelteKit and full-stack development.
                    </p>
                    <div class="flex flex-wrap gap-2 mt-4">
                        {#each [{ name: "Python", icon: "python" }, { name: "JavaScript", icon: "javascript" }, { name: "SvelteKit", icon: "svelte" }] as skill (skill.name)}
                            <span
                                class="bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                            >
                                <i class="devicon-{skill.icon}-plain"></i>
                                {skill.name}
                            </span>
                        {/each}
                    </div>
                </div>
            </div>
            <div
                class="opacity-0 w-3/4 mx-auto border-t-2 border-purple-500/20 my-8 animate-fade-up"
                style="animation-delay: 4s;"
            ></div>
            <div class="flex flex-wrap gap-4 justify-center">
                {#each data.posts as post, index (post.id)}
                    <div
                        class="animate-fade-up opacity-0"
                        style="animation-delay: {4.8 + index * 0.8}s"
                    >
                        <button
                            onclick={() => (activePost = post)}
                            class="bg-[#000080] text-white px-4 py-3 w-64 text-left border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 cursor-pointer hover:brightness-110 active:border-t-gray-500 active:border-l-gray-500 active:border-b-white active:border-r-white"
                        >
                            <div class="flex items-center gap-2 mb-1">
                                <span>📄</span>
                                <span class="font-bold text-sm"
                                    >{post.title}</span
                                >
                            </div>
                            <span class="text-xs text-gray-300"
                                >{post.created_at}</span
                            >
                        </button>
                    </div>
                {/each}
            </div>
            <div
                class="opacity-0 w-3/4 mx-auto border-t-2 border-purple-500/20 my-8 animate-fade-up"
                style="animation-delay: {1.6 + contactDelay}s;"
            ></div>
            <div
                class="animate-fade-up opacity-0 px-10 pb-10"
                style="animation-delay: {1.6 + contactDelay}s"
            >
                <div class="{getGradient(3)} p-5 border border-slate-400/30 rounded-2xl">
                    <h2 class="text-white font-bold text-lg mb-4">Guestbook</h2>
                    <div class="flex flex-col gap-2 mb-4">
                        <input
                            bind:value={guestName}
                            placeholder="Your name"
                            class="bg-purple-500/10 border border-purple-500/30 text-white placeholder-white/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500/60"
                        />
                        <textarea
                            bind:value={guestMessage}
                            placeholder="Leave a message..."
                            rows="3"
                            class="bg-purple-500/10 border border-purple-500/30 text-white placeholder-white/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500/60 resize-none"
                        ></textarea>
                        <button
                            onclick={submitGuest}
                            disabled={guestSubmitting}
                            class="self-start bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm px-4 py-2 rounded-full hover:bg-purple-500/40 transition-colors duration-200 disabled:opacity-50"
                        >
                            {guestSubmitting ? 'Signing...' : 'Sign guestbook'}
                        </button>
                    </div>
                    <div class="flex flex-col gap-3 mt-4">
                        {#each guestbook as entry (entry.id)}
                            <div class="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-purple-300 text-sm font-bold">{entry.name}</span>
                                    <span class="text-white/40 text-xs">{entry.created_at}</span>
                                </div>
                                <p class="text-white/80 text-sm">{entry.message}</p>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
            <div
                class="opacity-0 w-3/4 mx-auto border-t-2 border-purple-500/20 my-8 animate-fade-up"
                style="animation-delay: {contactDelay}s;"
            ></div>
            <div
                class="animate-fade-up flex justify-center opacity-0 px-10 pb-10"
                style="animation-delay: {0.8 + contactDelay}s"
            >
                <div
                    class="{getGradient(
                        7,
                    )} p-5 border border-slate-400/30 rounded-2xl"
                >
                    <h2 class="text-white font-bold text-lg mb-4">Contact</h2>
                    <div class="flex gap-4">
                        <a
                            href="https://github.com/Xtimate"
                            target="_blank"
                            rel="noreferrer"
                            class="flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm px-3 py-2 rounded-full hover:bg-purple-500/40 transition-colors duration-200"
                        >
                            <i class="devicon-github-original"></i>
                            GitHub
                        </a>
                        <button
                            onclick={copyDiscord}
                            class="flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm px-3 py-2 rounded-full hover:bg-purple-500/40 transition-colors duration-200"
                        >
                            <svg
                                class="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.02.06.03.09.02c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
                                />
                            </svg>
                            {copied ? "Copied!" : "Discord"}
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    {/if}
    {#if activeTab === "stats"}
        <div
            class="{getGradient(5)} mt-4 animate-fade-up opacity-0 rounded-2xl border border-slate-400/30 px-8 py-6 w-3/4 mx-auto"
        >
            <div class="flex flex-wrap justify-center items-end gap-4">
                <div class="p-4 rounded-2xl text-center min-w-32">
                    <p class="text-purple-300 text-2xl font-bold">{totalRepos}</p>
                    <p class="text-white/60 text-sm">Repos</p>
                </div>
                <div class="p-4 rounded-2xl text-center min-w-32">
                    <p class="text-purple-300 text-2xl font-bold">{totalStars}</p>
                    <p class="text-white/60 text-sm">Stars</p>
                </div>
                <div class="p-4 rounded-2xl text-center min-w-32">
                    <div class="h-9 flex flex-wrap justify-center items-center gap-2">
                        {#each languageBreakdown as [lang] (lang)}
                            <div class="flex items-center gap-1">
                                <i class="devicon-{lang.toLowerCase()}-plain text-purple-300"></i>
                                <span class="text-purple-300 text-sm">{lang}</span>
                            </div>
                        {/each}
                    </div>
                    <p class="text-white/60 text-sm">Top Languages</p>
                </div>
                <div
                    class="opacity-0 w-3/4 mx-auto border-t-2 border-purple-500/10 my-2 animate-fade-up"
                    style="animation-delay: .1s;"
                ></div>
            {#if hackatime}
                    {#if hackatime.today}
                    <div class="py-2 px-4 rounded-2xl text-center min-w-32">
                        <div class="text-purple-300 text-2xl font-bold">{hackatime.today}</div>
                        <p class="text-white/60 text-sm">Time coded today</p>
                    </div>
                    {/if}
                    {#if hackatime.allTime}
                    <div class="py-2 px-4 rounded-2xl text-center min-w-32">
                        <div class="text-purple-300 text-2xl font-bold">{hackatime.allTime}</div>
                        <p class="text-white/60 text-sm">All time</p>
                    </div>
                    {/if}
                    {#if hackatime.streak}
                    <div class="py-2 px-4 rounded-2xl text-center min-w-32">
                        <div class="flex items-center justify-center gap-2">
                            <div class="text-purple-300 text-2xl font-bold">{hackatime.streak}</div>
                            <svg class="w-5 h-5 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
                            </svg>
                        </div>
                        <p class="text-white/60 text-sm">Current streak</p>
                    </div>
                    {/if}
                    {#if hackatime.currentFile}
                    <div class="p-4 rounded-2xl min-w-32 w-full">
                        <button
                            onclick={() => hackatimeExpanded = !hackatimeExpanded}
                            class="flex items-center justify-center w-full text-left"
                        >
                            <div class="text-center">
                                <p class="text-purple-300 text-2xl font-bold">{hackatime.currentProject}</p>
                                <p class="text-white/60 text-sm">Currently working on</p>
                            </div>
                            <svg
                                class="w-4 h-4 text-purple-300 transition-transform duration-300 {hackatimeExpanded ? 'rotate-180' : ''}"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                            >
                                <path d="M6 9l6 6 6-6"/>
                            </svg>
                        </button>
                        <div
                            class="overflow-hidden transition-all duration-300 ease-in-out {hackatimeExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}"
                        >
                            <div class="mt-3 pt-3 border-t border-purple-500/20 flex flex-col items-center justify-center gap-4">
                                <div class="flex gap-2">
                                    <span class="text-purple-300 font-bold text-xl">File:</span>
                                    <span class="text-white/60 text-xl">{hackatime.currentRelativePath}</span>
                                </div>
                                <div class="flex gap-2">
                                    <span class="text-purple-300 font-bold text-xl">Language:</span>
                                    <span class="text-white/60 text-xl">{hackatime.currentLanguage}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/if}
                    {:else}
                    <div class="p-4 rounded-2xl text-center min-w-32">
                        <p class="text-purple-300 text-2xl font-bold">{lastActive}</p>
                        <p class="text-white/60 text-sm">Last active</p>
                    </div>
                    {/if}
                </div>
            </div>
    {/if}
</main>

{#if activePost}
    <!-- backdrop -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onclick={() => (activePost = null)}
        onkeydown={(e) => e.key === "Escape" && (activePost = null)}
        role="dialog"
        tabindex="-1"
    >
        <!-- window -->
        <div
            class="w-[480px] max-w-[90vw] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 bg-[#c0c0c0]"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="presentation"
        >
            <!-- title bar -->
            <div
                class="bg-[#000080] flex items-center justify-between px-2 py-1"
            >
                <div class="flex items-center gap-2">
                    <span>📄</span>
                    <span class="text-white text-sm font-bold"
                        >{activePost.title}</span
                    >
                </div>
                <div class="flex gap-1">
                    <button
                        class="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-xs flex items-center justify-center"
                        >_</button
                    >
                    <button
                        class="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-xs flex items-center justify-center"
                        >□</button
                    >
                    <button
                        onclick={() => (activePost = null)}
                        class="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-xs flex items-center justify-center font-bold hover:bg-red-500 hover:text-white"
                        >✕</button
                    >
                </div>
            </div>
            <!-- menu bar -->
            <div
                class="bg-[#c0c0c0] border-b border-gray-400 px-2 py-0.5 flex gap-4"
            >
                <span
                    class="text-xs text-black hover:bg-[#000080] hover:text-white px-1 cursor-default"
                    >File</span
                >
                <span
                    class="text-xs text-black hover:bg-[#000080] hover:text-white px-1 cursor-default"
                    >Edit</span
                >
                <span
                    class="text-xs text-black hover:bg-[#000080] hover:text-white px-1 cursor-default"
                    >View</span
                >
            </div>
            <!-- content -->
            <div
                class="bg-white m-2 p-3 min-h-32 border border-t-gray-500 border-l-gray-500 border-b-white border-r-white"
            >
                <p class="text-black text-sm whitespace-pre-wrap">
                    {activePost.content}
                </p>
            </div>
            <!-- status bar -->
            <div class="bg-[#c0c0c0] border-t border-gray-400 px-2 py-0.5">
                <span class="text-xs text-black">{activePost.created_at}</span>
            </div>
        </div>
    </div>
{/if}
