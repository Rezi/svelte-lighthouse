<script>
  import { sunCalc } from "../helpers/suncalc";
  export let groundBottomHsl;
  export let groundTopHsl;
  export let scrollDateUtc;
  export let coords;

  let prevDay = null;
  let sunTimes;
  let moonTimes;

  $: dateChange(scrollDateUtc);

  function dateChange(date) {
    const day = date.getDay();
    if (day !== prevDay && coords) {
      prevDay = day;
      sunTimes = sunCalc.getTimes(date, coords.lat, coords.lon);
      moonTimes = sunCalc.getMoonTimes(date, coords.lat, coords.lon);
    }
  }
</script>

<style type="text/scss">
  @import "../variables.scss";
  $size: 500vw; // earth diameter

  .ground-wrap {
    overflow: hidden;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .ground {
    position: absolute;
    //z-index: 1;
    height: $size;
    width: $size;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(#{-$size} + 20vh); // 20vh ground height
    border-radius: 50%;
  }

  .cardinal-directions {
    position: absolute;
    left: 0;
    bottom: calc(2rem + 1vh);
    display: flex;
    width: 100%;
    color: $colorBase;
    font-size: 1.1rem;

    .direction {
      padding-left: $cardinalDirectionsShift;
      width: 25vw;
      position: relative;
    }
  }

  .riseset {
    position: relative;

    svg {
      position: absolute;
      left: -2rem;
      top: -0.1rem;
      width: 2rem;
      fill: currentColor;
    }
  }
</style>

<div class="ground-wrap">
  <div
    class="ground"
    style="background: linear-gradient( 0deg, {groundBottomHsl} 89%, {groundTopHsl}
    100% );" />
  <div class="cardinal-directions">
    <div class="direction">
      <!-- N -->
    </div>
    <div class="direction">
      East
      {#if sunTimes && sunTimes.sunrise}
        <div class="riseset">
          <svg viewBox="0 0 32 32">
            <title>sunrise1</title>
            <path
              d="M13.612 20h-2.561c-0.015-0.165-0.022-0.331-0.022-0.5 0-3.038
              2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5c0 0.169-0.008 0.335-0.022
              0.5v0h-2.561l-2.917-2.5-2.917 2.5zM16.529 10c-0.276 0-0.5
              0.216-0.5 0.495v2.009c0 0.274 0.232 0.495 0.5 0.495 0.276 0
              0.5-0.216 0.5-0.495v-2.009c0-0.274-0.232-0.495-0.5-0.495v0
              0zM23.267 12.791c-0.195-0.195-0.506-0.201-0.704-0.003l-1.421
              1.421c-0.193 0.193-0.186 0.514 0.003 0.704 0.195 0.195 0.506 0.201
              0.704 0.003l1.421-1.421c0.193-0.193 0.186-0.514-0.003-0.704v0
              0zM26.058 19.529c0-0.276-0.216-0.5-0.495-0.5h-2.009c-0.274 0-0.495
              0.232-0.495 0.5 0 0.276 0.216 0.5 0.495 0.5h2.009c0.274 0
              0.495-0.232 0.495-0.5v0 0zM7 19.529c0 0.276 0.216 0.5 0.495
              0.5h2.009c0.274 0 0.495-0.232 0.495-0.5
              0-0.276-0.216-0.5-0.495-0.5h-2.009c-0.274 0-0.495 0.232-0.495
              0.5v0 0zM7.566 22c-0.281 0-0.508 0.232-0.508 0.5 0 0.276 0.227 0.5
              0.508 0.5h6.075l2.917-2.5 2.917 2.5h6.075c0.281 0 0.508-0.232
              0.508-0.5 0-0.276-0.227-0.5-0.508-0.5h-5.492l-3.5-3-3.5
              3h-5.492zM9.791 12.791c-0.195 0.195-0.201 0.506-0.003 0.704l1.421
              1.421c0.193 0.193 0.514 0.186 0.704-0.003 0.195-0.195 0.201-0.506
              0.003-0.704l-1.421-1.421c-0.193-0.193-0.514-0.186-0.704 0.003v0 0z" />
          </svg>
          {sunTimes.sunrise.toLocaleTimeString().slice(0, -3)}
        </div>
      {/if}
      {#if moonTimes && moonTimes.rise}
        <div class="riseset">
          <svg viewBox="0 0 32 32">
            <title>moonrise</title>
            <path
              d="M19.339 19.433c0.719-0.701 1.247-1.597 1.498-2.602 0.088-0.351
              0.142-0.716 0.158-1.091-0.468 0.165-0.971 0.254-1.495 0.254-2.485
              0-4.5-2.015-4.5-4.5 0-0.524 0.090-1.027 0.254-1.495-0.374
              0.016-0.739 0.070-1.091 0.158-2.392 0.597-4.163 2.76-4.163 5.336 0
              2.023 1.092 3.791 2.719 4.746l3.781-3.241 2.839 2.433zM7.508
              22c-0.281 0-0.508 0.232-0.508 0.5 0 0.276 0.227 0.5 0.508
              0.5h6.075l2.917-2.5 2.917 2.5h6.075c0.281 0 0.508-0.232 0.508-0.5
              0-0.276-0.227-0.5-0.508-0.5h-5.492l-3.5-3-3.5 3h-5.492z" />
          </svg>
          {moonTimes.rise.toLocaleTimeString().slice(0, -3)}
        </div>
      {/if}
    </div>
    <div class="direction">
      <!-- S -->
    </div>
    <div class="direction">
      West
      {#if sunTimes && sunTimes.sunset}
        <div class="riseset">
          <svg viewBox="0 0 32 32">
            <title>sunset1</title>
            <path
              d="M21.978 18c0.015-0.165 0.022-0.331 0.022-0.5
              0-3.038-2.462-5.5-5.5-5.5s-5.5 2.462-5.5 5.5c0 0.169 0.008 0.335
              0.022 0.5h10.955zM16.5 8c-0.276 0-0.5 0.216-0.5 0.495v2.009c0
              0.274 0.232 0.495 0.5 0.495 0.276 0 0.5-0.216
              0.5-0.495v-2.009c0-0.274-0.232-0.495-0.5-0.495v0 0zM23.238
              10.791c-0.195-0.195-0.506-0.201-0.704-0.003l-1.421 1.421c-0.193
              0.193-0.186 0.514 0.003 0.704 0.195 0.195 0.506 0.201 0.704
              0.003l1.421-1.421c0.193-0.193 0.186-0.514-0.003-0.704v0 0zM26.029
              17.529c0-0.276-0.216-0.5-0.495-0.5h-2.009c-0.274 0-0.495
              0.232-0.495 0.5 0 0.276 0.216 0.5 0.495 0.5h2.009c0.274 0
              0.495-0.232 0.495-0.5v0 0zM6.971 17.529c0 0.276 0.216 0.5 0.495
              0.5h2.009c0.274 0 0.495-0.232 0.495-0.5
              0-0.276-0.216-0.5-0.495-0.5h-2.009c-0.274 0-0.495 0.232-0.495
              0.5v0 0zM9.762 10.791c-0.195 0.195-0.201 0.506-0.003 0.704l1.421
              1.421c0.193 0.193 0.514 0.186 0.704-0.003 0.195-0.195 0.201-0.506
              0.003-0.704l-1.421-1.421c-0.193-0.193-0.514-0.186-0.704 0.003v0
              0zM7.537 21c-0.281 0-0.508-0.232-0.508-0.5 0-0.276 0.227-0.5
              0.508-0.5h6.075l2.917 2.5 2.917-2.5h6.075c0.281 0 0.508 0.232
              0.508 0.5 0 0.276-0.227 0.5-0.508 0.5h-5.492l-3.5 3-3.5-3h-5.492z" />
          </svg>
          {sunTimes.sunset.toLocaleTimeString().slice(0, -3)}
        </div>
      {/if}
      {#if moonTimes && moonTimes.set}
        <div class="riseset">
          <svg viewBox="0 0 32 32">
            <title>moonset</title>
            <path
              d="M21.307 15.331c-0.597 2.392-2.76 4.163-5.337 4.163-3.038
              0-5.5-2.462-5.5-5.5 0-2.577 1.772-4.739 4.163-5.337 0.351-0.088
              0.716-0.142 1.091-0.158-0.165 0.468-0.254 0.971-0.254 1.495 0
              2.485 2.015 4.5 4.5 4.5 0.524 0 1.027-0.090 1.495-0.254-0.016
              0.374-0.070 0.739-0.158 1.091v0zM7.508 22c-0.281
              0-0.508-0.232-0.508-0.5 0-0.276 0.227-0.5 0.508-0.5h6.075l2.917
              2.5 2.917-2.5h6.075c0.281 0 0.508 0.232 0.508 0.5 0 0.276-0.227
              0.5-0.508 0.5h-5.492l-3.5 3-3.5-3h-5.492z" />
          </svg>
          {moonTimes.set.toLocaleTimeString().slice(0, -3)}
        </div>
      {/if}
    </div>
  </div>
</div>
