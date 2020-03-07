<script>
  import { generateCloud } from "../helpers/cloud-generator";
  import { isBrowser } from "../helpers/helpers";
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
    cities = JSON.parse(localStorage.getItem("cities")) || [];
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

  function addCity(city, event) {
    if (isBrowser()) {
      const oldCities = JSON.parse(localStorage.getItem("cities"));
      const citiesStore = [
        { name: city.name, id: city.id, sys: { country: city.sys.country } }
      ];

      if (oldCities) {
        citiesStore.push(...oldCities);
      }

      localStorage.setItem("cities", JSON.stringify(citiesStore));
    }
  }

  function deleteCity(city, event) {
    event.preventDefault();
    event.stopPropagation();
    if (isBrowser()) {
      const oldCities = JSON.parse(localStorage.getItem("cities"));
      cities = oldCities.filter(oldCity => {
        return oldCity.id !== city.id;
      });

      localStorage.setItem("cities", JSON.stringify(cities));
    }
  }
</script>

<style type="text/scss">
  @import "../variables.scss";

  :global(html) {
    background-color: $color-bg-sky-bottom;
  }

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
    padding: 0;
  }

  .search-results--item {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: $color-search;
    display: flex;
    justify-content: space-between;
    text-decoration: none;
  }

  .temperature {
    color: $color-temperature;
  }

  .delete {
    fill: currentColor;
    width: 1.5rem;
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

<section class="search">
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

      <div class="search-results">
        {#each cities as city}
          <a
            on:click={event => {
              addCity(city, event);
            }}
            class="search-results--item"
            href="forecast?city={city.name}&id={city.id}">
            <span>{city.name} ({city.sys.country})</span>
            {#if city.main}
              <span class="temperature">
                {(city.main.temp - 272.15).toFixed(1)}°C
              </span>
            {:else}
              <svg
                class="delete"
                viewBox="0 0 22 28"
                on:click={event => {
                  deleteCity(city, event);
                }}>
                <title>delete</title>
                <path
                  d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281
                  0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5
                  0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281
                  0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5
                  0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281
                  0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5
                  0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188
                  0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5
                  6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094
                  0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5
                  0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375
                  0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281
                  0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5
                  0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391
                  2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094
                  2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z" />
              </svg>
            {/if}
          </a>
        {/each}
      </div>
    </div>
  </div>

</section>

<canvas class="canvas" bind:this={canvas} width="800" height="800" />
