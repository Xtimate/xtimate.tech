<script>
    let password = $state("");

    async function login() {
        const res = await fetch("/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        if (res.ok) {
            window.location.href = "/admin";
        } else {
            alert("Invalid password");
        }
    }
</script>

<main
    class="text-white flex flex-col items-center justify-center min-h-screen gap-4"
>
    <h1 class="text-2xl font-bold">Admin Login</h1>
    <input
        type="text"
        bind:value={password}
        placeholder="Password"
        class="bg-white/10 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30"
    />
    <button
        onclick={login}
        class="bg-purple-600 hover:bg-purple-700 rounded-lg px-6 py-3 font-semibold"
    >
        Login
    </button>
</main>
