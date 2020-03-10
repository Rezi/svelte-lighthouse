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
          .filter(([key, value]) => value.active)
          .map(([key, value]) => {
            let { path, minValue, maxValue } = smoother.getPath(
              locals,
              key,
              kelvins,
              graphHeight,
              columnWidth
            );

            if (key === "rainsnow") {
              minValue = (minValue / 3).toFixed(1);
              maxValue = (maxValue / 3).toFixed(1);
            }
            return {
              path: path,
              name: key,
              min: `${minValue} ${value.suffix}`,
              max: `${maxValue} ${value.suffix}`
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
  $top: 45vh;
  $height: 33.33333vh;

  .stat-line {
    position: absolute;
    top: $top;
    left: 50vw;

    &:before {
      top: 0;
    }
    &:after {
      bottom: 0;
    }
    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
      left: -50vw;
      right: 0;
      border-top: 1px dashed currentColor;
    }

    .stat-max {
      top: calc(#{$top} - 2rem);
    }

    .stat-min {
      top: calc(#{$top + $height} + 1rem);
    }

    .stat-max,
    .stat-min {
      width: (100vw / 6 * 1);
      position: fixed;
      text-align: center;
    }
  }

  .path {
    fill: none;
    stroke-width: 3px;
    height: $height;
    overflow: visible;
    stroke: currentColor;

    border-width: 1px 0;
  }

  .temp {
    color: $temp;

    .stat-max,
    .stat-min {
      left: 0;
    }
  }

  .rainsnow {
    color: $rainsnow;
    .stat-max,
    .stat-min {
      left: (100vw / 6 * 1);
    }
  }

  .pressure {
    color: $pressure;

    .stat-max,
    .stat-min {
      left: (100vw / 6 * 5);
    }
  }

  .humidity {
    color: $humidity;
    .stat-max,
    .stat-min {
      left: (100vw / 6 * 4);
    }
  }

  .clouds {
    color: $clouds;
    .stat-max,
    .stat-min {
      left: (100vw / 6 * 2);
    }
  }

  .wind {
    color: $wind;

    .stat-max,
    .stat-min {
      left: (100vw / 6 * 3);
    }
  }
</style>

{#if locals.dataSet}
  {#each lines as { path, name, min, max }, index}
    <div class="stat-line {name}">
      <div class="stat-max">{max}</div>
      <svg
        class="path"
        style="width:{columnWidth * locals.dataSet.list.length}px"
        viewBox="0 0 {columnWidth * locals.dataSet.list.length}
        {windowHeight / 3}">
        <path d={path} />
      </svg>
      <div class="stat-min">{min}</div>
    </div>
  {/each}
{/if}
