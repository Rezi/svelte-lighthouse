<script>
  export let intensity;
  export let type; // 'snow' or 'rain'

  let drops = [];

  $: rain(intensity, type);

  function rain(intensityRain, typeRain) {
    const dropNumber = Math.floor(intensityRain * 6);
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
</style>

<div class="rain">
  <div class="drops">
    {#each drops as drop}
      <div class="drop" style={drop} />
    {/each}
  </div>
</div>
