<script>
    import "../app.css";
    import favicon from "$lib/assets/favicon.svg";
    let { children } = $props();

    let cursorEl;

    $effect(() => {
        let cursorX = 0;
        let cursorY = 0;
        let velX = 0;
        let velY = 0;

        window.addEventListener("mousemove", (e) => {
            velX += (e.clientX - cursorX) * 0.02;
            velY += (e.clientY - cursorY) * 0.02;
        });

        const animate = () => {
            velX *= 0.8;
            velY *= 0.8;
            cursorX += velX;
            cursorY += velY;
            cursorEl.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            document.body.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
        });
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="blobs"></div>
<div class="grid-bg"></div>
<div class="cursor" bind:this={cursorEl}></div>
{@render children()}
