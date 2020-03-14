<script>
  export let intensity;
  export let type; // 'snow' or 'rain'

  let drops = [];

  $: rain(intensity, type); // intensity mm in 3h

  function rain(intensityRain, fallType) {
    const dropScale = Math.pow(intensityRain, 1 / 5);
    if (intensity > 12) {
      // only scale rain drops but not add more of them when above 15
      intensityRain = 12;
    }
    const dropNumber = 10 + Math.floor(intensityRain * 4);
    if (dropNumber > 2) {
      const dropArray = Array(dropNumber).fill("");
      const animationDuration = fallType === "snow" ? 4 : 0.5;
      drops = dropArray.map(() => {
        return {
          drop: `left:${Math.floor(Math.random() * 100)}%; top: ${-Math.floor(
            Math.random() * 100
          ) - 50}px; animation-duration: ${Math.random() +
            animationDuration}s; animation-delay:${-Math.random() *
            animationDuration}s;`,
          path: `opacity:${Math.random()}; transform: scale( ${0.2 +
            Math.random() * dropScale});`
        };
      });
    }
  }

  function randRange(minNum, maxNum) {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }
</script>

<style type="text/scss">
  @import "../../variables.scss";

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  .snowrain {
    overflow: hidden;
    position: absolute;
    top: 55% * $scaledown;
    left: 50%;
    width: 180px;
    height: 45vh;
    z-index: -1;
    transform: translateX(-50%);
  }

  .rain__drop {
    animation-iteration-count: infinite;
    animation-name: drop;
    animation-timing-function: linear;
    height: 3vh;
    position: absolute;
    overflow: visible;
  }
  .snow__flake {
    animation-iteration-count: infinite;
    animation-name: flake;
    animation-timing-function: linear;
    height: 0.5vh;
    width: 0.5vh;
    border-radius: 50%;
    position: absolute;
    background-color: #fff;
  }
  .rain__drop path {
    fill: #a1c6cc;
  }
  @keyframes drop {
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(35vh);
    }
  }
  @keyframes flake {
    0% {
      opacity: 1;
      transform: translate(0.5rem, 0);
    }
    25% {
      transform: translate(-0.5rem, 9vh);
    }
    50% {
      transform: translate(0.5rem, 18vh);
    }
    75% {
      transform: translate(-0.5rem, 27vh);
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(0.5rem, 36vh);
    }
  }
</style>

{#if type === 'rain'}
  <div class="snowrain">
    {#each drops as item}
      <svg
        class="rain__drop"
        preserveAspectRatio="xMinYMin"
        viewBox="0 0 5 50"
        style={item.drop}>
        <path
          style={item.path}
          stroke="none"
          d="M 2.5,0 C 2.69,3.54 3.344,20.52 4.45,30.96 5.76,42.67 4.6,50 2.5,50
          0.41,50 -0.76,42.7 0.56,30.96 1.66,20.52 2.31,3.54 2.5,0 Z" />
      </svg>
    {/each}
  </div>
{:else}
  <div class="snowrain">
    {#each drops as item}
      <div class="snow__flake" style={item.drop + item.path} />
    {/each}

  </div>
{/if}
