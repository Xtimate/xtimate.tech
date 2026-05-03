<script>
    let { data } = $props();

    let title = $state("");
    let content = $state("");
    let posts = $state(data.posts);
    let repos = $state(data.repos);
    let pinned = $state(data.pinned);

    const pinnedNames = $derived(pinned.map((p) => p.repo_name));

    async function togglePin(repoName) {
        const isPinned = pinnedNames.includes(repoName);
        await fetch("/api/pinned", {
            method: isPinned ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repo_name: repoName, order_index: 0 }),
        });
        if (isPinned) {
            pinned = pinned.filter((p) => p.repo_name !== repoName);
        } else {
            pinned = [...pinned, { repo_name: repoName }];
        }
    }

    async function submitPost() {
        if (!title || !content) return;
        await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });
        const res = await fetch(`/api/posts?t=${Date.now()}`);
        const freshPosts = await res.json();
        console.log("freshPosts:", freshPosts);
        console.log("is array:", Array.isArray(freshPosts));
        posts = freshPosts;
        title = "";
        content = "";
    }

    async function deletePost(id) {
        await fetch("/api/posts", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        posts = posts.filter((p) => p.id !== id);
    }
</script>

<main class="text-white p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Admin</h1>

    <section class="mb-12">
        <h2 class="text-xl font-semibold mb-4">Pin Repos</h2>
        <div class="flex flex-col gap-2">
            {#each data.repos as repo (repo.id)}
                <div
                    class="flex justify-between items-center border border-white/10 rounded-lg p-3"
                >
                    <span>{repo.name}</span>
                    <button
                        onclick={() => togglePin(repo.name)}
                        class="px-3 py-1 rounded text-sm {pinnedNames.includes(
                            repo.name,
                        )
                            ? 'bg-purple-600'
                            : 'bg-white/10'}"
                    >
                        {pinnedNames.includes(repo.name) ? "Pinned" : "Pin"}
                    </button>
                </div>
            {/each}
        </div>
    </section>

    <section>
        <h2 class="text-xl font-semibold mb-4">New Devlog Post</h2>
        <div class="flex flex-col gap-4">
            <input
                bind:value={title}
                placeholder="Title"
                class="bg-white/10 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30"
            />
            <textarea
                bind:value={content}
                placeholder="Write your devlog entry..."
                rows="6"
                class="bg-white/10 border border-white/10 rounded-lg p-3 text-white"
            ></textarea>
            <button
                onclick={submitPost}
                class="bg-purple-600 hover:bg-purple-700 rounded-lg p-3 font-semibold transition-colors"
            >
                Post
            </button>
        </div>

        <h2 class="text-xl font-semibold mt-8 mb-4">Past Posts</h2>
        <div class="flex flex-col gap-3">
            {#each posts as post (post.id)}
                <div
                    class="border border-white/10 rounded-lg p-4 flex justify-between items-start"
                >
                    <div>
                        <h3 class="font-bold">{post.title}</h3>
                        <p class="text-white/60 text-sm mt-1">{post.content}</p>
                        <span class="text-white/30 text-xs"
                            >{post.created_at}</span
                        >
                    </div>
                    <button
                        onclick={() => deletePost(post.id)}
                        class="text-red-400 hover:text-red-300 text-sm ml-4"
                    >
                        Delete
                    </button>
                </div>
            {/each}
        </div>
    </section>
</main>
