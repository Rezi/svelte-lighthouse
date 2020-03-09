<script>
  export let intensity;
  export let type; // 'snow' or 'rain'

  let drops = [];

  $: rain(intensity, type);

  function rain(intensityRain, typeRain) {
    const dropNumber = Math.floor(intensityRain * 10);
    if (dropNumber > 2) {
      const dropArray = Array(dropNumber).fill("");
      drops = dropArray.map(() => {
        const dropLeft = randRange(0, 100);
        const dropTop = randRange(-50, 150);
        return `left:${dropLeft}%;top:${dropTop}%`;
      });
    }
  }

  function randRange(minNum, maxNum) {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }
</script>

<style type="text/scss">
  @import "../variables.scss";

  .rain {
    overflow: hidden;
    position: absolute;
    top: 65% * $scaledown;
    left: 50%;
    width: 180px;
    height: 40vh;
    z-index: -1;
    transform: translateX(-50%);
  }

  .drops {
    animation: fall 0.63s linear infinite;
    position: relative;
    height: 100%;
    transform: translateY(-35vh);
  }

  .drop {
    width: 1px;
    height: 3vh;
    position: absolute;
    background-color: white;
  }

  @keyframes fall {
    to {
      transform: translateY(0);
    }
  }

  .snow {
    overflow: hidden;
    position: absolute;
    top: 65% * $scaledown;
    left: 50%;
    width: 180px;
    height: 40vh;
    z-index: -1;
    transform: translateX(-50%);
  }

  .flakes {
    animation: snowing 3s linear infinite;
    position: relative;
    height: 100%;
    transform: translateY(-35vh);
  }

  .flake,
  .flake:before,
  .flake:after {
    content: "";
    display: block;
    width: 0.1rem;
    height: 0.6rem;
    position: absolute;
    background-color: white;
  }

  .flake:before {
    transform-origin: center center;
    transform: rotate(120deg);
  }

  .flake:after {
    transform-origin: center center;
    transform: rotate(240deg);
  }

  @keyframes snowing {
    0% {
      transform: translateY(-35vh) translateX(0.5rem);
    }
    10% {
      transform: translateY(-31.5vh) translateX(-0.5rem);
    }
    20% {
      transform: translateY(-28vh) translateX(0.7rem);
    }
    30% {
      transform: translateY(-24.5vh) translateX(-0.5rem);
    }
    40% {
      transform: translateY(-21vh) translateX(0.1rem);
    }
    50% {
      transform: translateY(-17.5vh) translateX(-0.4rem);
    }
    60% {
      transform: translateY(-14vh) translateX(1rem);
    }
    70% {
      transform: translateY(-10.5vh) translateX(-1rem);
    }
    80% {
      transform: translateY(-7vh) translateX(0.2rem);
    }
    90% {
      transform: translateY(-3.5vh) translateX(-0.8rem);
    }
    100% {
      transform: translateY(0) translateX(0.5rem);
    }
  }
</style>

{#if type === 'rain'}
  <div class="rain">
    <div class="drops">
      {#each drops as drop}
        <div class="drop" style={drop} />
      {/each}
    </div>
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
