<script>
  import { generateCloud } from "../helpers/cloud-generator";
  import Search from "../components/home/Search.svelte";
  import Logo from "../components/home/Logo.svelte";
  import { onMount } from "svelte";

  let canvas;
  let cloudURI;
  let windowWidth;
  let windowHeight;

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

  :global(html) {
    background-color: $color-bg-sky-bottom;
  }

  .about {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 1rem;
    z-index: 2;

    svg {
      fill: $color-active;
      width: 2rem;
      height: 2rem;
    }
  }

  .home {
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

  .cloud-image {
    position: relative;
    top: 12vh;
    opacity: 0.3;
    transform: translateY(-50%);
  }

  .canvas {
    display: none;
  }
</style>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<svelte:head>
  <title>The Weather App</title>
  <meta
    name="description"
    content="A weather forecast app, in which you just see the weather" />
  <link rel="preconnect" href="//api.openweathermap.org" />
  <link rel="dns-prefetch" href="//api.openweathermap.org" />

</svelte:head>

<section class="home">
  <a href="about" class="about">
    <svg viewBox="0 0 512 512">
      <title>about</title>
      <path
        d="M224 152c0-13.2 10.8-24 24-24h16c13.2 0 24 10.8 24 24v16c0 13.2-10.8
        24-24 24h-16c-13.2 0-24-10.8-24-24v-16z" />
      <path d="M320 384h-128v-32h32v-96h-32v-32h96v128h32z" />
      <path
        d="M256 0c-141.385 0-256 114.615-256 256s114.615 256 256 256 256-114.615
        256-256-114.615-256-256-256zM256 464c-114.875
        0-208-93.125-208-208s93.125-208 208-208 208 93.125 208 208-93.125
        208-208 208z" />
    </svg>
  </a>
  <div class="cloud-wrap">
    <img src={cloudURI} alt="cloud" class="cloud-image" />
    <Logo />
  </div>

  <Search />

</section>

<canvas class="canvas" bind:this={canvas} width="800" height="800" />
