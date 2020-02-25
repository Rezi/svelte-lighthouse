<script>
  import { sunCalc } from "../helpers/suncalc";

  export let scrollDate;
  export let animationKey;
  export let locals;
  export let moonOpacity01To1;

  let moonBottomPosition;
  let moonLeftPosition;
  let moonRotationDeg;

  let moonLeft = 0;
  let moonRight = 0;

  $: animateMoon(scrollDate, animationKey);

  function animateMoon(date, animationKey) {
    if (locals.dataSet) {
      let moonPhase = sunCalc.getMoonIllumination(date).phase; // 0 - 1;

      if (animationKey) {
        moonLeft = moonPhase < 0.5 ? 7.8 - moonPhase * 31.2 : -7.8;
        moonRight = moonPhase >= 0.5 ? 7.8 - (moonPhase - 0.5) * 31.2 : 7.8;
      }

      locals.prevMoonPhase = moonPhase;

      const coords = locals.dataSet.city.coord;
      const moonPosition = sunCalc.getMoonPosition(
        date,
        coords.lat,
        coords.lon
      );

      moonBottomPosition =
        (moonPosition.altitude * 100) / (Math.PI / 2) + 14 + "vh"; // 14 is extra for the bottom terrain

      moonLeftPosition = (moonPosition.azimuth / Math.PI) * 50 + 50; // 0 - 100

      moonRotationDeg = (moonPosition.parallacticAngle * 180) / Math.PI;
      // max = Pi/2 rad
    }
  }
</script>

<style type="text/scss">
  @import "../variables.scss";

  .moon {
    $moonWidth: 10vh;
    width: 0;
    height: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    padding-left: $cardinalDirectionsShift;
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
</style>

<div
  class="moon"
  style="opacity:{moonOpacity01To1};transform:translate({moonLeftPosition}vw,-{moonBottomPosition})
  rotate({moonRotationDeg}deg)">
  <div class="moon-bg" />
  <svg class="moon-svg" viewBox="0 0 32 32">
    <path
      class:glow-filter={!locals.isMobile}
      d="M16.034 21.918c{moonLeft} 0.000 {moonLeft} -11.743 0-11.741 {moonRight}
      0.023 {moonRight} 11.743 0 11.741z" />
  </svg>
</div>
