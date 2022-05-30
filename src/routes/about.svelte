<div class="about">
    <div class="text glass light">

        <h1>About GlobeStory</h1>
    
        <section>
            <h2>What is GlobeStory ?</h2>
            <p>GlobeStory is an open-source project aiming to help people to learn about world history through a new, interactive way</p>
            <p>GlobeStory is an interactive world map and timeline with informations about country borders and their evolution over time, and historical events (coming soon)</p>
        </section>
    
        <section>
            <h2>How to use GlobeStory ?</h2>
            <p>The black square on the top left of the map indicates the current date that the map is displaying the features of. To change the date, click on the square which will display a control panel which contains a date selector. The "Play" buttons allow you to view the evolution of the world by advancing through time quickly either day by day or month by month.</p>
            <p>You can pan zoom on the map, and click on a country border to see some information about this country at that time</p>
        </section>
    
        <section>
            <h2>How GlobeStory is made</h2>
            <p>GlobeStory is a personal project of Cyprien Lengagne</p>
            <p>GlobeStory uses the following open-source technologies :</p>
            <ul>
                <li>Svelte and SvelteKit, web framework</li>
                <li>Leaflet.js, library for creating interactive maps</li>
            </ul>
            <p>GlobeStory uses the following datasets :</p>
            <ul>
                <li>CShapes 2.0 : dataset of country borders over time</li>
            </ul>
        </section>
    </div>
</div>

<style>
    .about {
        padding-top: var(--nav-height);
        min-height: 100vh;
        box-sizing: border-box;
    }
    .text {
        max-width: 800px;
        padding: 1rem;
        margin: auto;
    }
</style>