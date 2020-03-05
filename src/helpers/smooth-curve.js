// The smoothing ratio
const smoothing = 0.2;

// Properties of a line
// I:  - pointA (array) [x,y]: coordinates
//     - pointB (array) [x,y]: coordinates
// O:  - (object) { length: l, angle: a }: properties of the line
const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
};

// Position of a control point
// I:  - current (array) [x, y]: current point coordinates
//     - previous (array) [x, y]: previous point coordinates
//     - next (array) [x, y]: next point coordinates
//     - reverse (boolean, optional): sets the direction
// O:  - (array) [x,y]: a tuple of coordinates
const controlPoint = (current, previous, next, reverse) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current;
  const n = next || current;

  // Properties of the opposed-line
  const o = line(p, n);

  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;

  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;
  return [x, y];
};

// Create the bezier curve command
// I:  - point (array) [x,y]: current point coordinates
//     - i (integer): index of 'point' in the array 'a'
//     - a (array): complete array of points coordinates
// O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
const bezierCommand = (point, i, a) => {
  // start control point
  const cps = controlPoint(a[i - 1], a[i - 2], point);

  // end control point
  const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
};

// Render the svg <path> element
// I:  - points (array): points coordinates
//     - command (function)
//       I:  - point (array) [x,y]: current point coordinates
//           - i (integer): index of 'point' in the array 'a'
//           - a (array): complete array of points coordinates
//       O:  - (string) a svg path command
// O:  - (string): a Svg <path> element
const svgPath = (points, command) => {
  // build the d attributes by looping over the points
  const d = points.reduce(
    (acc, point, i, a) =>
      i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${command(point, i, a)}`,
    ""
  );
  return d;
};

export function getPath(locals, type, kelvins, graphHeight, columnWidth) {
  const list = locals.dataSet.list;
  const values = list.map(item => {
    let val = item.main[type]; // humidity set here
    if (type === "temp") {
      val -= kelvins;
    } else if (type === "pressure") {
      val = item.main["grnd_level"];
    } else if (type === "clouds") {
      val = item.clouds.all;
    } else if (type === "rainsnow") {
      val = item.rain ? item.rain["3h"] : item.snow ? item.snow["3h"] : 0;
    } else if (type === "wind") {
      val = item.wind ? item.wind.speed : 0;
    }

    return val;
  });

  const min = Math.min(...values);
  const max = Math.max(...values).toFixed(1);
  const adjustedMax = max - min;

  const points = values.map((value, index) => {
    // adjusted value from 0 to 1
    const adjustedValue = 1 - (value - min) / adjustedMax;
    const yCoord = adjustedValue * graphHeight;
    const xCoord = columnWidth * index;
    return [xCoord, yCoord];
  });

  return svgPath(points, bezierCommand);
}
