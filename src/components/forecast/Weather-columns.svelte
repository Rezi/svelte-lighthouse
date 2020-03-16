<script>
  import Rain from "./Rain.svelte";
  import Lightning from "./Lightning.svelte";
  import { createEventDispatcher } from "svelte";
  import { generateCloud } from "../../helpers/cloud-generator";
  import { memoize, getDateWithShift } from "../../helpers/helpers";

  export let scrollLeftPx;
  export let locals;
  export let animationKey;
  export let cloudBrightness;
  export let windowWidth;
  export let windowHeight;
  export let timezone;

  let canvas;
  let scrollList = [];
  let cloudData = [];
  let activeForecast;
  let columnsRemovedFromBeginning = 0;
  let beforePadding = 0;
  let afterPadding = 0;
  let downscaled = 5;
  let lightning = false;

  const memoizedCloudGenerator = memoize(generateCloud);
  const dispatch = createEventDispatcher();

  const countOnScrollFrame = countOnScrollFrameClosure();
  $: countOnScrollFrame(scrollLeftPx, animationKey, locals);

  function countOnScrollFrameClosure() {
    let previousColumnsRemovedFromBeginning = null;
    return function(scrollLeft, animate, locals) {
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

        let sliceEnd = noOfColumnsActive + columnsRemovedFromBeginning + 2;
        if (sliceEnd > numberOfItems + 1) {
          sliceEnd = numberOfItems + 1;
        }

        if (
          previousColumnsRemovedFromBeginning === columnsRemovedFromBeginning
        ) {
          return;
        }

        previousColumnsRemovedFromBeginning = columnsRemovedFromBeginning;

        scrollList = locals.dataSet.list
          .slice(columnsRemovedFromBeginning, sliceEnd)
          .map(item => {
            return {
              ...item,
              isThunderStorm: item.weather.some(
                // check if code start with 2
                condition => {
                  return condition.id.toString()[0] === "2";
                }
              )
            };
          });

        const maxSliceEnd =
          sliceEnd >= numberOfItems ? numberOfItems : sliceEnd;

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
    };
  }

  function onLightning() {
    lightning = true;
    setTimeout(() => {
      lightning = false;
    }, 300);
  }
</script>

<style type="text/scss">
  @import "../../variables.scss";

  .weather-columns-wrap {
    overflow: hidden;
    display: flex;
    height: 100vh;
    position: relative;
    transform: translateY(1px);
  }

  .weather-column {
    flex: 1 0 180px;

    &.active {
      /* box-shadow: 0 0 0 1000px rgba(50, 50, 50, 0.2); */
      .forecast:after {
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 1rem 1rem 0 1rem;
        border-color: $color-arrow transparent transparent transparent;
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
      color: $color-active;
    }
  }

  .cloud {
    position: absolute;
    width: 100%;
    transition: filter 0.2s;

    .lightning-bolt {
      position: absolute;
      z-index: -1;
      top: 55% * $scaledown;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.2s;
    }

    &.lightning {
      filter: brightness(var(--brightness));

      .lightning-bolt {
        opacity: 1;
      }
    }

    img {
      transform: scale($scaledown); // scaled down 5x
      transform-origin: top center;
    }
  }

  .lightning--flash {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    opacity: 0.2;
  }

  .canvas {
    display: none;
  }
</style>

<div class:lightning--flash={lightning} />
{#if scrollList.length}
  <div
    class="weather-columns-wrap"
    style="width:{scrollList.length * locals.columnWidth}px;padding-left:{beforePadding}px;padding-right:{afterPadding}px">

    {#each scrollList as forecast, index (forecast.dt)}
      <div
        class="weather-column"
        class:active={activeForecast.dt === forecast.dt}>
        <div class="forecast">
          {getDateWithShift(forecast.dt_txt, timezone).toLocaleTimeString(
            undefined,
            {
              timeStyle: 'short'
            }
          )}
          <div
            class="cloud"
            class:lightning
            style="--brightness:{Math.pow(1.95 - cloudBrightness, 3)}">

            <!--  cloudBrightness is 0.18 - 1 -->
            {#if cloudData[columnsRemovedFromBeginning + index].img}
              <img
                src={cloudData[columnsRemovedFromBeginning + index].img}
                style="filter:brightness({cloudBrightness});"
                alt="cloud" />
            {/if}
            {#if forecast.rainSnow}
              <Rain intensity={forecast.rainSnow} type={forecast.fallType} />
            {/if}
            {#if forecast.isThunderStorm}
              <div class="lightning-bolt">
                <Lightning on:lightning={onLightning} timestamp={forecast.dt} />
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}

  </div>
{/if}

<canvas class="canvas" bind:this={canvas} width="800" height="800" />
