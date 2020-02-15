<script>
  import { sunCalc } from "../helpers/suncalc";
  import { forecastMock } from "../helpers/mock";
  import { onMount } from "svelte";

  const forecastUrl =
    "http://api.openweathermap.org/data/2.5/forecast?q=_city_&APPID=a77e1d2fcad267b4ba535bd5fd05b6e7";

  let moonLeft = 0;
  let moonRight = 0;
  let scrollX;
  let elWeatherColumnWidth;
  let dataSet;
  let prevMoonPhase;
  let nearestForecastDate;

  let moonBottomPosition;
  let moonLeftPosition;
  let moonRotationDeg;

  let sunBottomPosition;
  let sunLeftPosition;
  let sunDegAngle;

  let skyTop;
  let skyBottom;
  let skyHalo;

  let scrollDate = new Date();
  let scrollLeftGrouped = 0;
  let dateTime = scrollDate;

  onMount(() => {
    fetchForecast("Hlavní město Praha");
  });

  function weatherScroll(event) {
    const fromLeft = event.target.scrollLeft;
    let animationKey = false;
    // only trigger animation each 50px of scrolling, 50px transitions are made by css transitions
    if (
      fromLeft > scrollLeftGrouped + 50 ||
      fromLeft < scrollLeftGrouped - 50
    ) {
      scrollLeftGrouped = fromLeft;
      animationKey = true;
    }
    window.requestAnimationFrame(() => {
      countOnScrollFrame(fromLeft, animationKey);
    });
  }

  function setDefaultValues(data) {
    nearestForecastDate = new Date(data.list[0].dt_txt);
    prevMoonPhase = sunCalc.getMoonIllumination(nearestForecastDate).phase;
  }

  function animateMoon(date, animationKey) {
    let moonPhase = sunCalc.getMoonIllumination(date).phase; // 0 - 1;

    if (animationKey) {
      moonLeft = moonPhase < 0.5 ? 7.8 - moonPhase * 31.2 : -7.8;
      moonRight = moonPhase >= 0.5 ? 7.8 - (moonPhase - 0.5) * 31.2 : 7.8;
    }

    prevMoonPhase = moonPhase;

    const coords = dataSet.city.coord;
    const moonPosition = sunCalc.getMoonPosition(date, coords.lat, coords.lon);

    moonBottomPosition =
      (moonPosition.altitude * 100) / (Math.PI / 2) + 14 + "vh"; // 14 is extra for the bottom terrain

    moonLeftPosition = 10 + "vh";

    moonRotationDeg = (moonPosition.parallacticAngle * 180) / Math.PI;
    // max = Pi/2 rad
  }
  function animateSun(date, animationKey) {
    const coords = dataSet.city.coord;
    /*     const sunTimes = sunCalc.getTimes(date, coords.lat, coords.lon, 0);
    console.log(sunTimes); */

    const sunPosition = sunCalc.getPosition(date, coords.lat, coords.lon);
    sunDegAngle = (sunPosition.altitude * 100) / (Math.PI / 2);
    sunBottomPosition = sunDegAngle + 14 + "vh"; // 14 is extra for the bottom terrain

    sunLeftPosition = 10 + "vh";
  }

  function colorSky(sunAngleDeg, animationKey) {
    /*     sunDegAngle */
    if (animationKey) {
      let lightness = sunAngleDeg < -30 ? -30 : sunAngleDeg;
      lightness += 30;
      lightness = Math.pow(lightness, 0.8);
      lightness += 15;

      const darkness = 1 - lightness / 100;

      const skyTopHslMax = 264;
      const skyBottomHslMax = 283;
      const skyTopHsl = skyTopHslMax - lightness * 1.5;
      const skyBottomHsl = skyBottomHslMax - lightness * 1.5;

      skyTop = `hsl(${skyTopHsl}, 56%, ${lightness}%)`;
      skyBottom = `hsl(${skyBottomHsl}, 39%, ${lightness}%)`;
      skyHalo = `hsla(0, 0%, 0%, ${darkness})`;
    }
  }

  function countOnScrollFrame(scrollLeft, animationKey) {
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const onePxInMs = threeHoursInMs / elWeatherColumnWidth;
    scrollDate = new Date(
      nearestForecastDate.getTime() + onePxInMs * scrollLeft
    );

    if (animationKey) {
      dateTime = scrollDate;
    }

    animateMoon(scrollDate, animationKey);
    animateSun(scrollDate, animationKey);
    colorSky(sunDegAngle, animationKey);
  }

  const fetchForecast = async city => {
    /*  const urlWithCity = forecastUrl.replace("_city_", city);
    const response = await fetch(urlWithCity);
    const data = await response.json(); */

    dataSet = forecastMock;
    setDefaultValues(dataSet);

    // make initial render
    countOnScrollFrame(0, true);
  };
</script>

<style type="text/scss">
  .svg-def {
    position: absolute;
    width: 0;
    height: 0;
  }

  .star {
    width: 70px;
    height: 70px;
    fill: #cafbff;
  }
  .sun {
    $sunnWidth: 10vh;
    width: 0;
    height: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    //transition: all 0.5s;

    .sun-svg {
      width: $sunnWidth * 2.75;
      height: $sunnWidth * 2.75;
      fill: #ffdd40;
      transform: translate(-50%, -50%);
    }
  }

  .moon {
    $moonWidth: 10vh;
    width: 0;
    height: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    //transition: all 0.5s;

    .moon-svg {
      width: $moonWidth * 2.75;
      height: $moonWidth * 2.75;
      fill: #ffed9c;
      transform: translate(-50%, -50%);
    }

    .moon-bg {
      position: absolute;
      transform: translate(-50%, -50%);
      background-color: rgba(200, 200, 200, 0.015);
      width: $moonWidth;
      height: $moonWidth;
      border-radius: 50%;
    }
  }

  /* .glow-filter {
    filter: url("#strokeGlow");
    -webkit-filter: url("#strokeGlow");
  } */

  .weather-bg-radial {
    height: 100vh;
  }

  .weather-bg {
    top: 0;
    left: 0;
    width: 100vw;
    position: fixed;

    .ground {
      $size: 300vh;
      position: absolute;
      height: $size;
      width: $size;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(#{-$size} + 20vh);
      background: rgb(0, 47, 0);
      background: radial-gradient(
        circle closest-side,
        rgba(42, 15, 95, 1) 85%,
        #797858 100%
      );

      border-radius: 50%;
    }
  }

  .weather-scroll {
    display: flex;
    overflow-y: hidden;
    height: 100vh;
    position: relative;
  }

  .weather-column {
    flex: 1 0 10rem;
  }
  .date-time {
    position: absolute;
    top: 10vh;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1rem;
    color: wheat;
  }
</style>

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
  style="background: linear-gradient( 0deg, {skyBottom} 0%, {skyTop} 100% );">
  <div
    class="weather-bg-radial"
    style="background: radial-gradient( circle at 30% 40%, rgba(0, 0, 0, 0) 0%, {skyHalo}
    100% );">

    <div class="date-time">{dateTime}</div>

    <svg class="star" viewBox="0 0 32 32">

      <path
        class="glow-filter"
        d="M21.557 14.914l-3.635-0.528-1.625-3.293-1.625 3.293-3.635 0.528 2.63
        2.564-0.621 3.62 3.251-1.709 3.251 1.709-0.621-3.62z" />

    </svg>
    <div
      class="moon"
      style="transform:translate({moonLeftPosition},-{moonBottomPosition})
      rotate({moonRotationDeg}deg)">
      <div class="moon-bg" />
      <svg class="moon-svg" viewBox="0 0 32 32">

        <path
          class="glow-filter"
          d="M16.034 21.918c{moonLeft} 0.000 {moonLeft} -11.743 0-11.741 {moonRight}
          0.023 {moonRight} 11.743 0 11.741z" />
        <!--  <path
        class="glow-filter"
        d="M16.034 21.918c-7.812 0.072-7.812-11.743 0-11.741 7.792 0.023 7.792
        11.743 0 11.741z" /> -->

      </svg>

    </div>

    <div
      class="sun"
      style="transform:translate({sunLeftPosition},-{sunBottomPosition})">
      <svg class="sun-svg" viewBox="0 0 32 32">
        <path
          class="glow-filter"
          d="M22.589 15.229l0.051 1.010-2.813 0.142-0.051-1.010zM21.312
          12.035l0.525 0.865-2.408 1.463-0.525-0.865zM18.477 9.895l0.911
          0.439-1.223 2.538-0.911-0.439zM15.059 9.479l1.010-0.051 0.142
          2.813-1.010 0.051zM11.805 10.945l0.81-0.606 1.687 2.256-0.81
          0.606zM9.807 13.712l0.439-0.911 2.538 1.223-0.439 0.911zM9.524
          17.277l-0.149-1.001 2.786-0.416 0.149 1.001zM11 20.366l-0.602-0.813
          2.264-1.676 0.602 0.813zM13.829 22.314l-0.915-0.432 1.204-2.547 0.915
          0.432zM17.394 22.515l-1.001 0.149-0.416-2.786 1.001-0.149zM20.457
          20.974l-0.813 0.602-1.676-2.264 0.813-0.602zM22.35 17.95l-0.341
          0.952-2.652-0.95 0.341-0.952zM19.055 16.043c0 1.678-1.36 3.038-3.038
          3.038s-3.038-1.36-3.038-3.038c0-1.678 1.36-3.038 3.038-3.038s3.038
          1.36 3.038 3.038z" />

      </svg>
    </div>

    <div class="ground" />

  </div>
</div>

<div class="weather-scroll" on:scroll={weatherScroll}>
  {#each forecastMock.list as forecast}
    <div class="weather-column" bind:offsetWidth={elWeatherColumnWidth}>
      {forecast.dt_txt}
    </div>
  {/each}
</div>
