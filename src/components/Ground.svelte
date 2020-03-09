<script>
  export let groundBottomHsl;
  export let groundTopHsl;
</script>

<style type="text/scss">
  @import "../variables.scss";
  $size: 300vh; // earth diameter

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
    bottom: calc(1rem + 3vh);
    display: flex;
    width: 100%;
    color: $colorBase;

    .direction {
      padding-left: $cardinalDirectionsShift;
      width: 25vw;
      position: relative;
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
    <div class="direction">East</div>
    <div class="direction">
      <!-- S -->
    </div>
    <div class="direction">West</div>
  </div>
</div>
