<script>
  import { sunCalc } from "../helpers/suncalc";
  import { forecastMock } from "../helpers/mock";
  import { onMount } from "svelte";
  import { getColors } from "../helpers/colors";
  import {
    memoize,
    isMobileDevice,
    getDateWithShift
  } from "../helpers/helpers";

  import WeatherBg from "./Weather-bg.svelte";
  import DateTime from "./Date-time.svelte";
  import Moon from "./Moon.svelte";
  import Sun from "./Sun.svelte";
  import Stars from "./Stars.svelte";
  import Ground from "./Ground.svelte";
  import WeatherColumns from "./Weather-columns.svelte";
  import Statlines from "./Statlines.svelte";
  export let city;
  export let id;

  const forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?id=_id_&APPID=a77e1d2fcad267b4ba535bd5fd05b6e7";

  let animationKey = true;

  let scrollLeftPx;
  let activeForecast;

  let starsOpacity0To1 = 0;
  let moonOpacity01To1;
  let groundTopHsl;
  let groundBottomHsl;
  let cloudBrightness;
  let skyTopHsl;
  let skyBottomHsl;
  let skyHalo;
  let statToggleTypeEvent;

  let windowWidth;
  let windowHeight;

  let scrollDate = new Date();
  let scrollDateUtc = new Date();

  let locals = {
    scrollFromLeft: 0,
    dataSet: null,
    disableGlow: true,
    columnWidth: 180,
    prevMoonPhase: null,
    nearestForecastDate: null,
    nearestForecastDateUtc: null,
    scrollLeftGrouped: 0,
    timezone: 0
  };

  const memoizedColors = memoize(getColors);

  onMount(() => {
    // locals.disableGlow = isMobileDevice();
    fetchForecast(id).then(data => {
      locals.dataSet = data;
      locals.timezone = data.city.timezone;
      locals.dataSet.list = locals.dataSet.list.map(forecast => {
        const fallType = forecast.rain ? "rain" : "snow";
        const rain = forecast.rain && forecast.rain["3h"];
        const snow = forecast.snow && forecast.snow["3h"];
        const rainSnow = rain || snow || 0;
        return { ...forecast, rainSnow, fallType };
      });
      activeForecast = locals.dataSet.list[0];

      const defaultValues = setDefaultValues(data);
      locals = { ...locals, ...defaultValues };

      // make initial render
      countOnScrollFrame(0, animationKey);
    });
  });

  function weatherScroll(event) {
    locals.scrollFromLeft = event.target.scrollLeft;

    animationKey = false;
    // one px = 1 min
    // lets trigger some animations only every 10 minutes
    if (
      locals.scrollFromLeft > locals.scrollLeftGrouped + 10 ||
      locals.scrollFromLeft < locals.scrollLeftGrouped - 10
    ) {
      locals.scrollLeftGrouped = locals.scrollFromLeft;
      animationKey = true;
    }
    if (window) {
      window.requestAnimationFrame(() => {
        countOnScrollFrame(locals.scrollFromLeft, animationKey);
      });
    }
  }

  function setDefaultValues(data) {
    const nearestForecastDate = getDateWithShift(
      data.list[0].dt_txt,
      data.city.timezone
    );
    const nearestForecastDateUtc = new Date(data.list[0].dt * 1000);
    const prevMoonPhase = sunCalc.getMoonIllumination(nearestForecastDateUtc)
      .phase;

    return { nearestForecastDate, nearestForecastDateUtc, prevMoonPhase };
  }

  function onSetActiveForecast(forecast) {
    activeForecast = forecast.detail;
  }

  function onSunDegChanged(sunData) {
    const { sunDegAngle, animationKey } = sunData.detail;
    colors(sunDegAngle, animationKey);
  }
  function onStatToggle(event) {
    statToggleTypeEvent = event;
  }

  function colors(sunAngleDeg, animationKey) {
    if (animationKey && locals) {
      const responseColors = memoizedColors(locals, sunAngleDeg);

      ({
        groundTopHsl,
        groundBottomHsl,
        moonOpacity01To1,
        starsOpacity0To1,
        cloudBrightness,
        skyTopHsl,
        skyBottomHsl,
        skyHalo
      } = responseColors);
    }
  }

  function countOnScrollFrame(scrollLeft, animationKey) {
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const onePxInMs = threeHoursInMs / locals.columnWidth;

    scrollDate = new Date(
      locals.nearestForecastDate.getTime() + onePxInMs * scrollLeft
    );
    scrollDateUtc = new Date(
      locals.nearestForecastDateUtc.getTime() + onePxInMs * scrollLeft
    );
    scrollLeftPx = locals.scrollFromLeft;
  }

  const fetchForecast = async cityId => {
    const urlWithCity = forecastUrl.replace("_id_", cityId);
    const response = await fetch(urlWithCity);
    const data = await response.json();
    // const data = forecastMock;

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

  .space {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  .weather-scroll {
    overflow-x: scroll;
    overflow-y: hidden;
    height: 100vh;
    width: 100%;
    position: relative;
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

<WeatherBg {skyBottomHsl} {skyTopHsl} {skyHalo} />

<div class="space">
  <Stars {starsOpacity0To1} />

  <Moon
    {scrollDateUtc}
    {animationKey}
    {locals}
    {moonOpacity01To1}
    coords={locals.dataSet ? locals.dataSet.city.coord : null} />

  <Sun
    on:sunDegChanged={onSunDegChanged}
    {scrollDateUtc}
    {animationKey}
    disableGlow={locals.disableGlow}
    coords={locals.dataSet ? locals.dataSet.city.coord : null} />

</div>

<Ground
  {groundBottomHsl}
  {groundTopHsl}
  coords={locals.dataSet ? locals.dataSet.city.coord : null}
  {scrollDateUtc} />

<div class="weather-scroll" on:scroll={weatherScroll}>

  <WeatherColumns
    on:setActiveForecast={onSetActiveForecast}
    {scrollLeftPx}
    {locals}
    {animationKey}
    {cloudBrightness}
    {windowWidth}
    {windowHeight}
    timezone={locals.timezone} />

  <Statlines
    {windowHeight}
    {locals}
    columnWidth={locals.columnWidth}
    {statToggleTypeEvent} />

</div>

<DateTime {scrollDate} {activeForecast} on:statToggle={onStatToggle} {city} />
