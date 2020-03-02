<script>
  import Rain from "./Rain.svelte";
  import { createEventDispatcher } from "svelte";
  import { generateCloud } from "../helpers/cloud-generator";
  import { memoize } from "../helpers/helpers";

  export let scrollLeftPx;
  export let locals;
  export let animationKey;
  export let cloudBrightness;
  export let windowWidth;
  export let windowHeight;

  let canvas;
  let scrollList = [];
  let cloudData = [];
  let activeForecast;
  let columnsRemovedFromBeginning = 0;
  let beforePadding = 0;
  let afterPadding = 0;
  let downscaled = 5;

  const memoizedCloudGenerator = memoize(generateCloud);
  const dispatch = createEventDispatcher();

  $: countOnScrollFrame(scrollLeftPx, animationKey, locals);

  function countOnScrollFrame(scrollLeft, animate, locals) {
    if (animate && locals.dataSet) {
      const numberOfItems = locals.dataSet.list.length;

      const defaultSidePadding = windowWidth / 2 - locals.columnWidth / 2;

      const leftEdgeScrolled =
        scrollLeft - defaultSidePadding < 0
          ? 0
          : scrollLeft - defaultSidePadding;

      let activeItemNo = Math.floor(
        (scrollLeft -
          defaultSidePadding +
          windowWidth / 2 +
          locals.columnWidth / 2) /
          locals.columnWidth
      );

      if (activeItemNo > numberOfItems) {
        activeItemNo = numberOfItems - 1;
      }

      activeForecast = locals.dataSet.list[activeItemNo - 1];
      dispatch("setActiveForecast", activeForecast);

      columnsRemovedFromBeginning = Math.floor(
        leftEdgeScrolled / locals.columnWidth
      );

      beforePadding =
        leftEdgeScrolled -
        (leftEdgeScrolled % locals.columnWidth) +
        defaultSidePadding;

      let itemsPassed =
        (windowWidth + scrollLeft - defaultSidePadding) / locals.columnWidth;

      if (itemsPassed > numberOfItems) {
        itemsPassed = numberOfItems;
      }

      const noOfColumnsActive = itemsPassed - columnsRemovedFromBeginning;

      afterPadding =
        (numberOfItems - noOfColumnsActive - columnsRemovedFromBeginning) *
          locals.columnWidth +
        defaultSidePadding;

      let sliceEnd = noOfColumnsActive + columnsRemovedFromBeginning + 1;
      if (sliceEnd > numberOfItems + 1) {
        sliceEnd = numberOfItems + 1;
      }

      scrollList = locals.dataSet.list.slice(
        columnsRemovedFromBeginning,
        sliceEnd
      );

      const maxSliceEnd = sliceEnd >= numberOfItems ? numberOfItems : sliceEnd;

      for (let i = columnsRemovedFromBeginning; i < maxSliceEnd; i++) {
        const forecast = locals.dataSet.list[i];
        const baseCloudBall =
          (windowHeight * Math.pow(forecast.clouds.all || 0, 0.6)) / 100;

        cloudData[i] = {
          baseCloudBall,
          img: memoizedCloudGenerator(
            i,
            canvas,
            locals.columnWidth,
            windowHeight,
            baseCloudBall,
            forecast.clouds.all,
            (forecast.rain && forecast.rain["3h"]) || 0,
            (forecast.snow && forecast.snow["3h"]) || 0,
            downscaled // scaled down 5x
          )
        };
      }
    }
  }
</script>

<style type="text/scss">
  @import "../variables.scss";

  .weather-columns-wrap {
    overflow: hidden;
    display: flex;
    height: 100vh;
    position: relative;
  }
  .weather-column {
    flex: 1 0 180px;

    &.active {
      .forecast:after {
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 14px 20px 0 20px;
        border-color: #f5deb317 transparent transparent transparent;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -100%);
      }
    }

    .forecast {
      font-size: 1.2rem;
      position: relative;
      top: calc(25vh + 5rem);
      text-align: center;
      color: $colorBase;
    }
  }

  .cloud {
    position: absolute;
    width: 100%;
    img {
      transform: scale($scaledown); // scaled down 5x
      transform-origin: top center;
    }
  }

  .canvas {
    display: none;
  }
</style>

{#if scrollList.length}
  <div
    class="weather-columns-wrap"
    style="width:{scrollList.length * locals.columnWidth}px;padding-left:{beforePadding}px;padding-right:{afterPadding}px">

    {#each scrollList as forecast, index (forecast.dt)}
      <div
        class="weather-column"
        class:active={activeForecast.dt === forecast.dt}>
        <div class="forecast">
          {new Date(forecast.dt * 1000).toLocaleTimeString(undefined, {
            timeStyle: 'short'
          })}
          <div class="cloud" style="filter:brightness({cloudBrightness});">
            <img
              src={cloudData[columnsRemovedFromBeginning + index].img}
              alt="cloud" />

            <Rain intensity={forecast.rainSnow} type={forecast.fallType} />
          </div>
        </div>
      </div>
    {/each}

  </div>
{/if}

<canvas class="canvas" bind:this={canvas} width="800" height="800" />
