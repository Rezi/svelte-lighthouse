<script>
  import { onMount } from "svelte";
  let frontRain;
  let backRain;

  function makeItRain() {
    var increment = 0;
    var drops = "";
    var backDrops = "";

    while (increment < 100) {
      //couple random numbers to use for various randomizations
      //random number between 98 and 1
      var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
      //random number between 5 and 2
      var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
      //increment
      increment += randoFiver;
      //add in a new raindrop with various randomizations to certain CSS properties
      drops +=
        '<div class="drop" style="left: ' +
        increment +
        "%; bottom: " +
        (randoFiver + randoFiver - 1 + 100) +
        "%; animation-delay: 0." +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"><div class="stem" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div></div>';
      backDrops +=
        '<div class="drop" style="right: ' +
        increment +
        "%; bottom: " +
        (randoFiver + randoFiver - 1 + 100) +
        "%; animation-delay: 0." +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"><div class="stem" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div></div>';
    }

    frontRain.innerHTML = drops;
    backRain.innerHTML = backDrops;
  }

  onMount(() => {
    makeItRain();
  });
</script>

<style>
  .weather-page {
    height: 100vh;

    background: linear-gradient(to bottom, #303355, #111119);
  }

  /*   .weather-page :global(.rain) {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    overflow: hidden;
  } */

  .weather-page :global(.rain.back-row) {
    z-index: 1;
    bottom: 60px;
    opacity: 0.5;
  }

  .weather-page :global(.drop) {
    position: absolute;
    bottom: 100%;
    width: 15px;
    height: 120px;
    pointer-events: none;
    animation: drop 0.5s linear infinite;
  }

  @keyframes drop {
    0% {
      transform: translateY(0vh);
    }
    75% {
      transform: translateY(90vh);
    }
    100% {
      transform: translateY(90vh);
    }
  }

  .weather-page :global(.stem) {
    width: 1px;
    height: 60%;
    margin-left: 7px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.25)
    );
    animation: stem 0.5s linear infinite;
  }

  @keyframes stem {
    0% {
      opacity: 1;
    }
    65% {
      opacity: 1;
    }
    75% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
</style>

<svelte:head>
  <title>Weather</title>
</svelte:head>

<section class="weather-page">
  <div class="rain" bind:this={frontRain} />
  <div class="rain back-row" bind:this={backRain} />
</section>
