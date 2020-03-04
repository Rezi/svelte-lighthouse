<script>
  import * as Comlink from "comlink";
  import { hasWorkerSupport, isBrowser } from "../helpers/helpers";

  export let scrollDate;
  export let animationKey;
  export let locals;
  export let moonOpacity01To1 = 0;

  let moonBottomPosition = 0;
  let moonLeftPosition = 0;
  let moonRotationDeg = 0;
  let moonLeft = 0;
  let moonRight = 0;

  const workerFunctions =
    isBrowser() && hasWorkerSupport()
      ? Comlink.wrap(new Worker("worker.js"))
      : undefined;

  $: animateMoon(scrollDate);

  async function animateMoon(date) {
    if (workerFunctions && locals && locals.dataSet) {
      const workerAnimationresult = await workerFunctions.animateMoon(
        scrollDate,
        animationKey,
        locals,
        moonLeft,
        moonRight
      );

      if (isBrowser()) {
        window.requestAnimationFrame(() => {
          ({
            moonBottomPosition,
            moonLeftPosition,
            moonRotationDeg,
            moonLeft,
            moonRight
          } = workerAnimationresult);
        });
      }
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
      class:glow-filter={!locals.disableGlow}
      d="M16.034 21.918c{moonLeft} 0.000 {moonLeft} -11.743 0-11.741 {moonRight}
      0.023 {moonRight} 11.743 0 11.741z" />
  </svg>
</div>
