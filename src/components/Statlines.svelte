<script>
  export let windowHeight;
  export let locals;
  export let columnWidth;
  export let statToggleTypeEvent;

  let lines = [];
  const kelvins = 272.15;

  $: showStats(statToggleTypeEvent);

  async function showStats(event) {
    if (event) {
      const stats = event.detail;
      if (stats) {
        const smoother = await import("../helpers/smooth-curve.js");
        const graphHeight = windowHeight / 3;

        lines = Object.entries(stats)
          .filter(([key, value]) => value)
          .map(([key, value]) => {
            return {
              path: smoother.getPath(
                locals,
                key,
                kelvins,
                graphHeight,
                columnWidth
              ),
              name: key
            };
          });
      } else {
        path = "";
      }
    }
  }
</script>

<style type="text/scss">
  @import "../variables.scss";

  .stat-line {
    position: absolute;
    top: 45vh;
    left: 50vw;
  }

  .path {
    fill: none;
    stroke-width: 3px;
    height: 33.33333vh;
    overflow: visible;
  }

  .temp {
    stroke: $temp;
  }

  .pressure {
    stroke: $pressure;
  }

  .humidity {
    stroke: $humidity;
  }

  .clouds {
    stroke: $clouds;
  }

  .wind {
    stroke: $wind;
  }

  .rainsnow {
    stroke: $rainsnow;
  }
</style>

{#if locals.dataSet}
  {#each lines as { path, name }}
    <div class="stat-line">

      <svg
        class="path {name}"
        viewBox="0 0 {columnWidth * locals.dataSet.list.length}
        {windowHeight / 3}">
        <path d={path} />
      </svg>
    </div>
  {/each}
{/if}
