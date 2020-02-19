function setCloudGradient(ctx, x, y, innerRadius, xOuter, yOuter, outerRadius) {
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

export function generateCloud(
  cloudId,
  canvas,
  columnWidth,
  columnHeight,
  baseCloudBall,
  clouds = 0,
  rain = 0,
  snow = 0
) {
  const width = columnWidth + baseCloudBall;
  const maxCloudHeight = columnHeight / 3;
  const height = (maxCloudHeight * clouds) / 100;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 800, 800);
  const cloudLevelGap = baseCloudBall / 2;
  const minHorizontalGap = (1 / 4) * baseCloudBall;
  ctx.filter = `blur(${columnHeight / 140}px)`;

  let level = 0;
  let cloudHeight = 0;
  let levelWidth = width;
  let cloudAlignment = Math.random(); // 0 aligned to left, 0.5 centered symetry, 1 aligned to right

  while (cloudHeight < height - baseCloudBall) {
    let cloudWidth = baseCloudBall / 2;

    const positionBottom = height - level * cloudLevelGap;

    levelWidth = levelWidth + (Math.random() - 0.5) * baseCloudBall * 2;
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
        cloudWidth + minHorizontalGap + (1 / 3) * baseCloudBall * Math.random();

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

  return canvas.toDataURL();
}
