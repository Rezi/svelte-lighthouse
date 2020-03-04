<script>
  import * as Comlink from "comlink";
  import { createEventDispatcher } from "svelte";
  import { hasWorkerSupport, isBrowser } from "../helpers/helpers";

  export let scrollDate;
  export let animationKey;
  export let coords;
  export let disableGlow;

  let sunBottomPosition = 0;
  let sunLeftPosition = 0;

  const dispatch = createEventDispatcher();
  const workerFunctions =
    isBrowser() && hasWorkerSupport()
      ? Comlink.wrap(new Worker("worker.js"))
      : undefined;

  $: animateSun(scrollDate, animationKey, coords);

  async function animateSun(date, animationKey, coords) {
    if (coords && workerFunctions) {
      const workerAnimationresult = await workerFunctions.animateSun(
        date,
        animationKey,
        coords
      );

      if (isBrowser()) {
        window.requestAnimationFrame(() => {
          ({ sunBottomPosition, sunLeftPosition } = workerAnimationresult);
          dispatch("sunDegChanged", workerAnimationresult);
        });
      }
    }
  }
</script>

<style type="text/scss">
  @import "../variables.scss";

  .sun {
    $sunnWidth: 14vh;
    width: 0;
    height: 0;
    position: absolute;
    bottom: 0;
    left: $cardinalDirectionsShift;

    //transition: all 0.5s;

    .sun-svg {
      width: $sunnWidth * 2.75;
      height: $sunnWidth * 2.75;
      fill: #ffdd40;
      transform: translate(-50%, -50%);
    }
  }
</style>

<div
  class="sun"
  style="transform: translate({sunLeftPosition}vw,-{sunBottomPosition}) rotate({sunLeftPosition * -7}deg)">
  <svg class="sun-svg" viewBox="0 0 32 32">
    <path
      class:glow-filter={!disableGlow}
      d="M13.795 18.232c0.217 0.24 0.271 0.542 0.121 0.678l-1.082 0.98c-0.15
      0.136-0.445
      0.052-0.662-0.188s-0.271-0.542-0.121-0.678l1.082-0.98c0.15-0.136
      0.445-0.052 0.662 0.188zM15.992 19.217c0.323 0.016 0.575 0.191 0.565
      0.393l-0.072 1.458c-0.010 0.202-0.278 0.352-0.601
      0.336s-0.575-0.191-0.565-0.393l0.072-1.458c0.010-0.202 0.278-0.352
      0.601-0.336zM18.248 18.379c0.24-0.217 0.542-0.271 0.678-0.121l0.98
      1.082c0.136 0.15 0.052 0.445-0.188 0.663s-0.542 0.271-0.678
      0.121l-0.98-1.082c-0.136-0.15-0.052-0.445 0.188-0.663zM19.269
      16.199c0.016-0.323 0.191-0.575 0.393-0.565l1.458 0.072c0.202 0.010 0.352
      0.278 0.336 0.601s-0.191 0.575-0.393
      0.565l-1.458-0.072c-0.202-0.010-0.352-0.278-0.336-0.601zM18.462
      13.922c-0.217-0.239-0.272-0.542-0.123-0.678l1.080-0.982c0.15-0.136
      0.445-0.053 0.663 0.187s0.272 0.542 0.123 0.678l-1.080 0.982c-0.15
      0.136-0.445 0.053-0.663-0.187zM16.309
      12.873c-0.323-0.016-0.575-0.192-0.565-0.394l0.074-1.458c0.010-0.202
      0.279-0.351 0.602-0.335s0.575 0.192 0.565 0.394l-0.074 1.458c-0.010
      0.202-0.279 0.351-0.602 0.335zM14.014 13.643c-0.239 0.218-0.542
      0.272-0.678 0.123l-0.982-1.080c-0.136-0.15-0.053-0.445
      0.187-0.663s0.542-0.272 0.678-0.123l0.982 1.080c0.136 0.15 0.053
      0.445-0.187 0.663zM12.93 15.779c-0.016 0.323-0.192 0.575-0.394
      0.565l-1.458-0.074c-0.202-0.010-0.351-0.278-0.335-0.602s0.192-0.575
      0.394-0.565l1.458 0.074c0.202 0.010 0.351 0.278 0.335 0.602zM18.141
      16.042c0 0 0 0 0 0 0 1.129-0.915 2.045-2.045 2.045v0c-1.129
      0-2.045-0.915-2.045-2.045 0 0 0 0 0 0v0c0-1.129 0.915-2.045
      2.045-2.045v0c1.129 0 2.045 0.915 2.045 2.045v0z" />
  </svg>
</div>
