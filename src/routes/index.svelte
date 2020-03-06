<script>
  import { generateCloud } from "../helpers/cloud-generator";
  import { onMount } from "svelte";

  let value;
  let canvas;
  let cloudURI;
  let windowWidth;
  let windowHeight;

  $: fetchCities(value);

  let cities = [];

  async function fetchCities(value) {
    if (value && value.length > 2) {
      const response = await fetch(
        `https://openweathermap.org/data/2.5/find?q=${value}&type=like&sort=population&cnt=30&appid=b6907d289e10d714a6e88b30761fae22&_=1583447022166`
      );
      const data = await response.json();
      if (data.list) {
        cities = data.list;
        console.log(cities);
      } else {
        cities = [];
      }
    }
  }

  onMount(() => {
    const cloudBallSize = Math.min(windowWidth, windowHeight) / 3;

    cloudURI = generateCloud(
      1,
      canvas,
      windowWidth * 1.5,
      windowHeight * 1.5,
      cloudBallSize,
      90
    );
  });
</script>

<style type="text/scss">
  @import "../variables.scss";

  .search {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(
      0deg,
      $color-bg-sky-bottom 0%,
      $color-bg-sky-top 100%
    );
    position: relative;
  }

  .cloud-wrap {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .app-name {
    position: absolute;
    top: 10vh;
    font-size: 5vh;
    font-family: "Kalam", cursive;
    color: $color-app-name;
    padding: 0 5vw;
    text-align: center;
  }

  .cloud-image {
    position: relative;
    top: 12vh;
    transform: translateY(-50%);
  }

  .search-wrap {
    position: absolute;
    top: 35vh;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .search-box {
    max-width: 30rem;
    padding: 0 5vw;
    width: 100%;
    box-sizing: border-box;
  }

  .search-label {
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  .search-input {
    height: 2.5rem;
    border-radius: 0.5rem;
    border: 0;
    padding: 0.3rem 0.8rem;
    font-size: 1.5rem;
    margin-top: 1rem;
  }

  .search-results {
    margin-top: 2rem;
    list-style: none;
    padding: 0;
  }

  .search-results--item {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: $color-search;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
  }

  .temperature {
    color: $color-temperature;
  }

  .canvas {
    display: none;
  }
</style>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<svelte:head>
  <title>I see Weather</title>
  <meta
    name="description"
    content="A weather forecast app, in which you just see the weather" />
  <link rel="preconnect" href="//api.openweathermap.org" />
  <link rel="dns-prefetch" href="//api.openweathermap.org" />
  <link rel="preconnect" href="//fonts.googleapis.com" />
  <link rel="dns-prefetch" href="//fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css?family=Kalam&display=swap"
    rel="stylesheet" />
</svelte:head>

<div class="search">
  <div class="cloud-wrap">
    <img src={cloudURI} alt="cloud" class="cloud-image" />
    <div class="app-name">The Weather App</div>
  </div>
  <div class="search-wrap">
    <div class="search-box">
      <label class="search-label">
        Search for a city
        <input class="search-input" type="text" bind:value />
      </label>

      <ul class="search-results">
        {#each cities as city}
          <li class="search-results--item">
            <span>{city.name}</span>
            <span class="temperature">
              {(city.main.temp - 272.15).toFixed(1)}°C
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </div>

</div>

<canvas class="canvas" bind:this={canvas} width="800" height="800" />
