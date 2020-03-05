<script>
  import Weather from "../components/Weather.svelte";
</script>

<style>

</style>

<svelte:head>
  <title>I see Weather</title>
  <meta
    name="description"
    content="A weather forecast app, in which you just see the weather" />
  <link rel="preconnect" href="//api.openweathermap.org" />
  <link rel="dns-prefetch" href="//api.openweathermap.org" />
</svelte:head>

<Weather />
