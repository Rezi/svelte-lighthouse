<script context="module">
  export async function preload(page, session) {
    const { city, id } = page.query;
    return { city, id };
  }
</script>

<script>
  import Weather from "../components/Weather.svelte";
  export let city = "prague";
  export let id = "3067696";
</script>

<style>

</style>

<svelte:head>
  <title>The Weather App</title>
  <meta
    name="description"
    content="A weather forecast app, in which you just see the weather" />
  <link rel="preconnect" href="//api.openweathermap.org" />
  <link rel="dns-prefetch" href="//api.openweathermap.org" />
</svelte:head>

<Weather {city} {id} />
