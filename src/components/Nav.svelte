<script lang="ts">
    import { page } from "$app/stores";

    $: currentRoute = $page.url.pathname;
</script>

<nav class="glass light">
    <div class="logo">
        <span class="material-symbols-outlined">travel_explore</span>
        GlobeStory
    </div>

    <div class="links">
        <a href="/" class:active={currentRoute === "/"}>Map</a>
        <a href="/about" class:active={currentRoute === "/about"}>About</a>
    </div>
</nav>

<style>
    nav {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--nav-height);
        box-sizing: border-box;
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 2000;
    }
    .logo {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        gap: 0.5rem;
    }

    .logo span {
        font-size: 3rem;
    }

    .links {
        display: flex;
        gap: 1rem;
    }

    a {
        font-size: 1.25rem;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>