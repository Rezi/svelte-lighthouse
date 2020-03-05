<script>
  let value;

  $: fetchCities(value);

  async function fetchCities(value) {
    if (value) {
      const response = await fetch(
        `https://openweathermap.org/data/2.5/find?q=${value}&type=like&sort=population&cnt=30&appid=b6907d289e10d714a6e88b30761fae22&_=1583447022166`
      );
      const data = await response.json();

      console.log(data);
    }
  }
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

<input type="text" bind:value />
