<script>
  export let intensity;
  export let type; // 'snow' or 'rain'

  let drops = [];

  $: rain(intensity, type); // intensity mm in 3h

  function rain(intensityRain, typeRain) {
    const dropScale = Math.pow(intensityRain, 1 / 5);
    if (intensity > 12) {
      // only scale rain drops but not add more of them when above 15
      intensityRain = 12;
    }
    const dropNumber = 10 + Math.floor(intensityRain * 4);
    if (dropNumber > 2) {
      const dropArray = Array(dropNumber).fill("");
      drops = dropArray.map(() => {
        return {
          drop: `left:${Math.floor(Math.random() * 100)}%; top: ${-Math.floor(
            Math.random() * 100
          ) - 50}px; animation-duration: ${Math.random() +
            0.5}s; animation-delay:${Math.random()}s;`,
          path: `opacity:${Math.random()}; transform: scaleY( ${0.2 +
            Math.random() * dropScale}) scaleX(${dropScale});`
        };
      });
    }
  }

  function randRange(minNum, maxNum) {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }
</script>

<style type="text/scss">
  @import "../variables.scss";

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  .rain {
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
</style>

{#if type === 'rain'}
  <div class="rain">
    {#each drops as item}
      <svg
        class="rain__drop"
        preserveAspectRatio="xMinYMin"
        viewBox="0 0 5 50"
        style={item.drop}>
        <path
          style={item.path}
          stroke="none"
          d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559
          5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50
          -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571
          2.3050542,3.5392017 2.5,0 Z" />
      </svg>
    {/each}
  </div>
{:else}
  <div class="snow">
    <div class="flakes">
      {#each drops as drop}
        <div class="flake" style={drop} />
      {/each}
    </div>
  </div>
{/if}
