<script>
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  let { children } = $props();

  const TRAIL_LENGTH = 8;
  let trail = $state(Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 })));
  let mouse = { x: 0, y: 0 };
  let mouseHistory = Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }));

  $effect(() => {
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      document.body.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    });

    const animate = () => {
      // shift history
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        mouseHistory[i].x = mouseHistory[i - 1].x;
        mouseHistory[i].y = mouseHistory[i - 1].y;
      }
      mouseHistory[0].x = mouse.x;
      mouseHistory[0].y = mouse.y;

      trail = mouseHistory.map(p => ({ x: p.x, y: p.y }));
      requestAnimationFrame(animate);
    };

    animate();
  });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>
{#each trail as dot, i (i)}
  <div
    class="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] bg-purple-500"
    style="
      width: {12 - i}px;
      height: {12 - i}px;
      transform: translate({dot.x}px, {dot.y}px) translate(-50%, -50%);
      opacity: {1 - i / TRAIL_LENGTH};
    "
  ></div>
{/each}
<div class="blobs"></div>
<div class="grid-bg"></div>
{@render children()}
