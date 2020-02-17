<script>
  const baseCloudBall = 70;
  let cloudBalls = [];

  function generateCloud(width, height, cloudness, rain) {
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

        /*   const positionBottom =
          level * (1 / 2) * baseCloudBall +
          (1 / 3) * baseCloudBall * (Math.random() - 0.5);

        cloudWidth = positionLeft;
        cloudBalls.push(
          `transform:translate(${positionLeft}px,${-positionBottom -
            ballHeight / 2}px);width:${ballWidth}px;height:${ballHeight}px`
        ); */
      }

      cloudHeight += (2 / 3) * baseCloudBall;

      level++;
    }

    cloudBalls = [...cloudBalls];
  }

  generateCloud(150, 150);
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

    background: radial-gradient(
      circle at 40% 10%,
      #fafafa,
      #d9e7eb,
      rgb(115, 148, 155)
    );

    /* background: radial-gradient(
      circle at 40% 10%,
      #fafafa,
      #fbfdff,
      rgb(202, 219, 223)
    ) */
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>
<h1>About this site</h1>

<p>This is the 'about' page. There's not much here.</p>
<div class="cloud">
  {#each cloudBalls as cloudBallStyles}
    <div class="cloud-ball" style={cloudBallStyles} />
  {/each}
</div>
