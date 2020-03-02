<script>
  export let windowHeight;
  export let locals;
  export let columnWidth;
  export let statToggleTypeEvent;

  let path;
  const kelvins = 272.15;

  $: showStats(statToggleTypeEvent);

  async function showStats(event) {
    if (event) {
      const data = event.detail;
      if (data.show) {
        const smoother = await import("../helpers/smooth-curve.js");
        const graphHeight = windowHeight / 3;
        path = smoother.getPath(
          locals,
          data.type,
          kelvins,
          graphHeight,
          columnWidth
        );
      } else {
        path = "";
      }
    }
  }
</script>

<style type="text/scss">
  @import "../variables.scss";

  .stat-lines {
    position: absolute;
    top: 45vh;
    left: 50vw;
  }

  .path {
    stroke: $temp;
    fill: none;
    stroke-width: 3px;
    height: 33.33333vh;
    overflow: visible;
  }
</style>

{#if locals.dataSet}
  <div class="stat-lines">
    <svg
      class="path"
      viewBox="0 0 {columnWidth * locals.dataSet.list.length}
      {windowHeight / 3}">
      <path d={path} />
    </svg>
  </div>
{/if}
