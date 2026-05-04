<script>
    let { data } = $props();

    let displayed = $state("");
    let done = $state(false);
    const text = "Hello, I'm Xtimate";
    let activePost = $state(null);

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
    const getGradient = (id) => gradients[id % gradients.length];

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

<main>
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
        <div class="flex flex-wrap gap-4 justify-center pt-6">
            {#each data.repos as repo, index (repo.id)}
                <div
                    class="animate-fade-up opacity-0"
                    style="animation-delay: {0.4 + index * 0.8}s"
                >
                    <div
                        use:tilt
                        class="{getGradient(
                            repo.id,
                        )} repo-card text-white bg-gradient-to-br rounded-2xl border border-slate-400/30 hover:border-purple-500/40 p-3 w-80 transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                        style="animation-delay: {0.4 + index * 0.8}s"
                    >
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
                        <span class="text-white/60 text-sm"
                            >⭐ {repo.stargazers_count}</span
                        >
                    </div>
                </div>
            {/each}
        </div>
        <div
            class="opacity-0 p-10 animate-fade-up"
            style="animation-delay: 2s;"
        >
            <div
                class="{getGradient(
                    12,
                )} p-5 border border-slate-400/30 rounded-2xl"
            >
                <p class="text-white">
                    Hello, I'm Xtimate. I am a teenage developer from the
                    Netherlands. I primarily build machine learning systems and
                    my focus is making functional apps that actually have a real
                    life application.
                </p>
                <p class="text-white mt-3">
                    I code because I find that this is a nice way for me to be
                    artistic in a way; I've never been good with a pencil and
                    paper and coding gives me the freedom to express myself
                    creatively.
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
        <div class="flex flex-wrap gap-4 justify-center pt-6">
            {#each data.posts as post, index (post.id)}
                <div
                    class="animate-fade-up opacity-0"
                    style="animation-delay: {2.8 + index * 0.8}s"
                >
                    <button
                        onclick={() => (activePost = post)}
                        class="bg-[#000080] text-white px-4 py-3 w-64 text-left border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 cursor-pointer hover:brightness-110 active:border-t-gray-500 active:border-l-gray-500 active:border-b-white active:border-r-white"
                    >
                        <div class="flex items-center gap-2 mb-1">
                            <span>📄</span>
                            <span class="font-bold text-sm">{post.title}</span>
                        </div>
                        <span class="text-xs text-gray-300"
                            >{post.created_at}</span
                        >
                    </button>
                </div>
            {/each}
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
