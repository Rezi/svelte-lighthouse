<script context="module">
  let intervals = {};
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  export let timestamp;
  let path;

  $: change(timestamp);

  const pathMap = [-6, -2, 0, 2, 6];
  const dispatch = createEventDispatcher();
  const data = { interval: null };

  onDestroy(() => {
    clearInterval(intervals[timestamp]);
  });

  function change() {
    clearInterval(intervals[timestamp]);
    intervals[timestamp] = setInterval(function() {
      dispatch("lightning");
      path = generateLightning();
    }, 2000);
  }

  function generateLightning() {
    const chain = Math.random()
      .toString(5)
      .slice(2, -2);
    const chainSteps = chain.length;
    const stepHeight = 100 / chainSteps;

    let horizontalPosition = 50;
    let pathDefinition = "M50 0";

    [...chain].forEach((char, index) => {
      horizontalPosition += pathMap[parseInt(char)];
      const point = ` L${horizontalPosition} ${index * stepHeight}`;
      return (pathDefinition += point);
    });

    return pathDefinition;
  }
</script>

<style type="text/scss">
  @import "../variables.scss";

  .lightning {
    height: 25vh;

    path {
      stroke: #fff;
      fill: none;
      stroke-width: 0.1rem;
    }
  }
</style>

<svg class="lightning" viewbox="0 0 100 100">
  <path d={path} />
</svg>
