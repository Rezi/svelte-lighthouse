<script>
  import { sunCalc } from "../helpers/suncalc";
  import { forecastMock } from "../helpers/mock";
  import { onMount } from "svelte";
  import { generateCloud } from "../helpers/cloud-generator";
  import { memoize, isMobileDevice } from "../helpers/helpers";
  import ForecastStats from "./Forecast-stats.svelte";

  import Moon from "./Moon.svelte";
  import Sun from "./Sun.svelte";
  import Stars from "./Stars.svelte";
  import Rain from "./Rain.svelte";
  import Ground from "./Ground.svelte";

  const forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=_city_&APPID=a77e1d2fcad267b4ba535bd5fd05b6e7";

  let canvas;
  let cloudData = [];
  let columnsRemovedFromBeginning = 0;

  let windowWidth;
  let windowHeight;
  let animationKey;

  let moonOpacity01To1;

  let beforePadding = 0;
  let afterPadding = 0;
  let activeForecast;

  let groundTopHsl;
  let groundBottomHsl;
  let cloudBrightness;

  let skyTopHsl;
  let skyBottomHsl;
  let skyHalo;

  let scrollDate = new Date();
  let scrollList = [];

  let date;
  let day;

  let starsOpacity0To1 = 0;

  let locals = {
    scrollFromLeft: 0,
    dataSet: null,
    isMobile: false,
    columnWidth: 160,
    prevMoonPhase: null,
    nearestForecastDate: null,
    scrollLeftGrouped: 0
  };

  const memoizedCloudGenerator = memoize(generateCloud);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  onMount(() => {
    locals.isMobile = isMobileDevice();
    fetchForecast("Hlavní město Praha").then(data => {
      locals.dataSet = data;
      locals.dataSet.list = locals.dataSet.list.map(forecast => {
        const fallType = forecast.rain ? "rain" : "snow";
        const rain = forecast.rain && forecast.rain["3h"];
        const snow = forecast.snow && forecast.snow["3h"];
        const rainSnow = rain || snow || 0;
        return { ...forecast, rainSnow, fallType };
      });
      activeForecast = locals.dataSet.list[0];
      scrollList = []; // add just three column to the list so we can measure the width of it

      const defaultValues = setDefaultValues(data);
      locals = { ...locals, ...defaultValues };

      // make initial render
      countOnScrollFrame(0, true);
    });
  });

  function weatherScroll(event) {
    locals.scrollFromLeft = event.target.scrollLeft;

    animationKey = false;
    // only trigger animation each 50px of scrolling, 50px transitions are made by css transitions
    if (
      locals.scrollFromLeft > locals.scrollLeftGrouped + 50 ||
      locals.scrollFromLeft < locals.scrollLeftGrouped - 50
    ) {
      locals.scrollLeftGrouped = locals.scrollFromLeft;
      animationKey = true;
    }
    if (!!window) {
      window.requestAnimationFrame(() => {
        countOnScrollFrame(locals.scrollFromLeft, animationKey);
      });
    }
  }

  function setDefaultValues(data) {
    const nearestForecastDate = new Date(data.list[0].dt * 1000);
    const prevMoonPhase = sunCalc.getMoonIllumination(nearestForecastDate)
      .phase;

    return { nearestForecastDate, prevMoonPhase };
  }

  function colors(sunAngleDeg, animationKey) {
    const itemScrolled = Math.floor(locals.scrollFromLeft / locals.columnWidth);

    const scrolledForecast = locals.dataSet.list[itemScrolled];
    if (scrolledForecast) {
      const cloudsInPercent =
        (scrolledForecast.clouds && scrolledForecast.clouds.all) || 0;

      const saturation = 20 + (100 - cloudsInPercent) * 0.5; // saturation 20 - 70% depending on clouds

      let lightness = sunAngleDeg < -5 ? -5 : sunAngleDeg; // start 5deg below horizon
      lightness += 5; // ensure we start with lightness of at least 0
      lightness = lightness > 100 ? 100 : lightness; // 0 - 100

      const lightnessTo16 = lightness / 6.25; // 0 - 16
      const lightnessExponential = Math.pow(lightnessTo16, 0.25); // 0-2;  1 => 1,  16 => 2
      const lightnessExponential8To60 = lightnessExponential * 26 + 8;
      moonOpacity01To1 = 1 - lightnessExponential * 0.45;
      starsOpacity0To1 = 1 - lightnessExponential - cloudsInPercent / 100;

      cloudBrightness = lightnessExponential / 2.06 + 0.12;

      const darkness = 1 - lightness / 100;

      const groundTopHueMax = 38;
      const groundBottomHueMax = 260;
      const groundTopHue = groundTopHueMax + lightnessExponential8To60;
      const groundBottomHue =
        groundBottomHueMax - lightnessExponential8To60 * 1.5;
      const groundLightness = Math.pow(lightnessExponential8To60, 0.85);
      groundTopHsl = `hsl(${groundTopHue}, ${saturation +
        20}%, ${groundLightness}%)`;
      groundBottomHsl = `hsl(${groundBottomHue}, ${saturation +
        20}%, ${groundLightness}%)`;

      const skyTopHueMax = 243;
      const skyBottomHueMax = 223;
      const skyTopHue = skyTopHueMax - lightnessExponential8To60 * 0.8;
      const skyBottomHue = skyBottomHueMax - lightnessExponential8To60 * 0.8;
      skyTopHsl = `hsl(${skyBottomHue}, ${saturation}%, ${lightnessExponential8To60}%)`;
      skyBottomHsl = `hsl(${skyTopHue}, ${saturation}%, ${lightnessExponential8To60}%)`;
      skyHalo = `hsla(0, 0%, 0%, ${darkness})`;
    }
  }

  function countOnScrollFrame(scrollLeft, animationKey) {
    const numberOfItems = locals.dataSet.list.length;

    const defaultSidePadding = windowWidth / 2 - locals.columnWidth / 2;
    let leftEdgeScrolled =
      scrollLeft - defaultSidePadding < 0 ? 0 : scrollLeft - defaultSidePadding;

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
          (forecast.snow && forecast.snow["3h"]) || 0
        )
      };
    }

    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const onePxInMs = threeHoursInMs / locals.columnWidth;

    scrollDate = new Date(
      locals.nearestForecastDate.getTime() + onePxInMs * scrollLeft
    );

    const newDay = days[scrollDate.getDay()];

    if (day !== newDay) {
      day = newDay;
      date = scrollDate.toLocaleDateString();
    }
  }

  function sunDegChanged(sunData) {
    const { sunDegAngle, animationKey } = sunData.detail;
    colors(sunDegAngle, animationKey);
  }

  const fetchForecast = async city => {
    /* const urlWithCity = forecastUrl.replace("_city_", city);
    const response = await fetch(urlWithCity);
    const data = await response.json(); */
    const data = forecastMock;

    return data;
  };
</script>

<style type="text/scss">
  @import "../variables.scss";

  :global(.glow-filter) {
    filter: url("#strokeGlow");
    -webkit-filter: url("#strokeGlow");
  }

  .svg-def {
    position: absolute;
    width: 0;
    height: 0;
  }

  .weather-bg-radial {
    height: 100vh;
  }

  .weather-bg {
    top: 0;
    left: 0;
    width: 100vw;
    position: fixed;
  }

  .weather-scroll {
    overflow-x: scroll;
    overflow-y: hidden;
    height: 100vh;
    width: 100%;
    position: relative;
  }

  .weather-columns-wrap {
    overflow: hidden;
    display: flex;
    height: 100vh;
    position: relative;
  }
  .weather-column {
    flex: 1 0 160px;

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
  .date-time {
    position: absolute;
    top: 4vh;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: $colorBase;
    width: 100%;

    .day {
      font-size: 2rem;
    }

    .date {
      font-size: 1rem;
    }

    .separator {
      color: rgb(49, 49, 49);
    }
    .realtime {
      padding-left: 0.3rem;
      font-size: 2rem;
    }
  }

  .cloud {
    position: absolute;
  }

  .canvas {
    display: none;
  }
</style>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<svg class="svg-def">
  <defs>
    <filter id="strokeGlow" y="-10" x="-10" width="1000" height="1000">
      <feOffset in="StrokePaint" dx="0" dy="0" result="centeredOffset" />
      <feGaussianBlur in="centeredOffset" stdDeviation="1.5" result="blur1" />
      <feGaussianBlur in="centeredOffset" stdDeviation="4" result="blur2" />
      <feMerge>
        <feMergeNode in="blur1" />
        <feMergeNode in="blur2" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
</svg>

<div
  class="weather-bg weather-bg-linear"
  style="background: linear-gradient( 0deg, {skyBottomHsl} 0%, {skyTopHsl} 100%
  );">
  <div
    class="weather-bg-radial"
    style="background: radial-gradient( circle at 20% 25%, rgba(0, 0, 0, 0) 0%, {skyHalo}
    100% );">

    <Stars {starsOpacity0To1} />

    <Moon {scrollDate} {animationKey} {locals} {moonOpacity01To1} />

    <Sun
      {scrollDate}
      {animationKey}
      isMobile={locals.isMobile}
      coords={locals.dataSet ? locals.dataSet.city.coord : null}
      on:sunDegChanged={sunDegChanged} />

    <div class="date-time">
      <div class="day">{day}</div>
      <div class="date">
        {date}
        <span class="realtime">
          <span class="separator">|</span>
          {scrollDate.toLocaleTimeString(undefined, { timeStyle: 'short' })}
        </span>
      </div>
      {#if scrollList.length}
        <ForecastStats {activeForecast} />
      {/if}
    </div>

  </div>
</div>

<Ground {groundBottomHsl} {groundTopHsl} />

<div class="weather-scroll" on:scroll={weatherScroll}>
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
            <div
              class="cloud"
              style="filter:brightness({cloudBrightness});left:-{cloudData[columnsRemovedFromBeginning + index].baseCloudBall}px">
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
</div>

<canvas class="canvas" bind:this={canvas} width="800" height="800" />
