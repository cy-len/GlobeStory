<script>
    import Nav from "../components/Nav.svelte";
    import "../styles/global.css";
</script>

<div class="app-wrapper">
    <Nav />
    <main>
        <slot />
    </main>
</div>

<style>
    .app-wrapper {
        height: 100vh;
        display: grid;
        grid-template-areas:
            "nav"
            "main";
        grid-template-rows: min-content 1fr;
    }

    nav {
        grid-area: nav;
    }

    main {
        grid-area: main;
    }
</style>