<script>
  import { onMount } from "svelte";

  let canvas;

  const baseCloudBall = 70;

  onMount(() => {
    generateCloud(250, 150);
  });

  function setCloudGradient(
    ctx,
    x,
    y,
    innerRadius,
    xOuter,
    yOuter,
    outerRadius
  ) {
    const cloudGradient = ctx.createRadialGradient(
      x,
      y,
      innerRadius,
      xOuter,
      yOuter,
      outerRadius
    );
    cloudGradient.addColorStop(0, "#fefefe");
    cloudGradient.addColorStop(0.6, "#e0e7eb");
    cloudGradient.addColorStop(1, "#73959c");
    ctx.fillStyle = cloudGradient;
  }

  function generateCloud(width, height, cloudness, rain) {
    const ctx = canvas.getContext("2d");
    const cloudLevelGap = baseCloudBall / 2;
    const minHorizontalGap = (1 / 4) * baseCloudBall;
    ctx.filter = "blur(4px)";

    let level = 0;
    let cloudHeight = 0;
    let levelWidth = width;
    let cloudAlignment = Math.random(); // 0 aligned to left, 0.5 centered symetry, 1 aligned to right

    while (cloudHeight < height - baseCloudBall) {
      let cloudWidth = baseCloudBall / 2;

      const positionBottom = height - level * cloudLevelGap;

      levelWidth = levelWidth + (Math.random() - 0.7) * baseCloudBall * 2;
      if (levelWidth > width) {
        levelWidth = width;
      }
      if (levelWidth < width / 2) {
        levelWidth = width / 2;
      }

      const levelGap = width - levelWidth;

      while (cloudWidth < levelWidth - baseCloudBall / 2) {
        const ballWidth =
          (2 / 3) * baseCloudBall + (1 / 3) * baseCloudBall * Math.random();
        const ballHeight =
          (1 / 2) * baseCloudBall + (1 / 2) * baseCloudBall * Math.random();

        cloudWidth =
          cloudWidth +
          minHorizontalGap +
          (1 / 3) * baseCloudBall * Math.random();

        const positionLeft = cloudWidth + levelGap * cloudAlignment;
        const cloudBallPositionBottom =
          positionBottom - minHorizontalGap * Math.random();

        setCloudGradient(
          ctx,
          positionLeft,
          cloudBallPositionBottom - ballHeight / 2,
          0,
          positionLeft,
          cloudBallPositionBottom - ballHeight * 1.8,
          ballHeight * 2.2
        );

        ctx.beginPath();

        console.log(ballWidth, ballHeight);
        ctx.ellipse(
          positionLeft,
          cloudBallPositionBottom,
          ballWidth / 2,
          ballHeight / 2,
          0,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      cloudHeight += cloudLevelGap;

      level++;
    }
  }

  /*   const baseCloudBall = 70;
  let cloudBalls = []; function generateCloud(width, height, cloudness, rain) {
    let cloudHeight = 0;
    let level = 0;
    while (cloudHeight < height) {
      console.log(level);
      let cloudWidth = 0;
      while (cloudWidth < width) {
        const ballWidth =
          (2 / 3) * baseCloudBall + (2 / 3) * baseCloudBall * Math.random();
        const ballHeight =
          (1 / 2) * baseCloudBall + (2 / 3) * baseCloudBall * Math.random();
        const positionLeft =
          cloudWidth +
          (1 / 4) * baseCloudBall +
          (1 / 3) * baseCloudBall * Math.random();
        const positionBottom = level * (1 / 2) * baseCloudBall;

        cloudWidth = positionLeft;
        cloudBalls.push(
          `transform:translate(${positionLeft}px,${-positionBottom}px);width:${ballWidth}px;height:${ballHeight}px`
        );
      }

      cloudHeight += (2 / 3) * baseCloudBall;

      level++;
    }

    cloudBalls = [...cloudBalls];
  } 
  generateCloud(150, 150);*/
</script>

<style>
  h1 {
    color: red;
  }
  .cloud {
    filter: blur(3px);
    position: relative;
    top: 20rem;
  }

  .cloud-ball {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;

    background: radial-gradient(circle at 40% 10%, #fafafa, #d9e7eb, #73959c);

    /* background: radial-gradient(
      circle at 40% 10%,
      #fafafa,
      #fbfdff,
      rgb(202, 219, 223)
    ) */
  }

  .canvas {
    width: 400px;
    height: 400px;
  }

  :global(body) {
    background: black;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>
<h1>About this site</h1>
<canvas class="canvas" bind:this={canvas} width="400" height="400" />
<p>This is the 'about' page. There's not much here.</p>
<!-- <div class="cloud">
  {#each cloudBalls as cloudBallStyles}
    <div class="cloud-ball" style={cloudBallStyles} />
  {/each}
</div> -->
