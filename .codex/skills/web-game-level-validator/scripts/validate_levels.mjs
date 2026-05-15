import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node validate_levels.mjs <script.js>");
  process.exit(1);
}

const source = fs.readFileSync(file, "utf8");
const reverseMatch = source.match(/var REVERSE_LEVELS=\[(.*?)\n\];/s);
const sokobanMatch = source.match(/var SOKOBAN_LEVELS=\[(.*?)\n\];/s);
if (!reverseMatch || !sokobanMatch) {
  console.error("Could not find REVERSE_LEVELS or SOKOBAN_LEVELS.");
  process.exit(1);
}

const reverseLevels = Function(`return [${reverseMatch[1]}]`)();
const sokobanLevels = Function(`
  function roomWalls(width,height){
    var walls=[];
    for(var x=0;x<width;x++){walls.push([x,0],[x,height-1]);}
    for(var y=1;y<height-1;y++){walls.push([0,y],[width-1,y]);}
    return walls;
  }
  return [${sokobanMatch[1]}];
`)();

function validateReverse(levels) {
  const width = 360;
  const height = 360;
  const playerWidth = 30;
  const playerHeight = 30;
  const step = 12;
  const start = [18, 18];
  const goal = { x: width - 68, y: height - 68, w: 56, h: 56 };

  function collides(level, x, y) {
    if (x < 0 || y < 0 || x + playerWidth > width || y + playerHeight > height) return true;
    return level.obstacles.some((item) => {
      const ox = (item.l / 100) * width;
      const oy = (item.t / 100) * height;
      const ow = (item.w / 100) * width;
      const oh = (item.h / 100) * height;
      return x < ox + ow && x + playerWidth > ox && y < oy + oh && y + playerHeight > oy;
    });
  }

  function wins(x, y) {
    return x + playerWidth > goal.x && x < goal.x + goal.w && y + playerHeight > goal.y && y < goal.y + goal.h;
  }

  return levels.map((level, index) => {
    const startSafe = !collides(level, ...start);
    const queue = [start];
    const seen = new Set([start.join(",")]);
    let reachable = false;
    while (queue.length) {
      const [x, y] = queue.shift();
      if (wins(x, y)) {
        reachable = true;
        break;
      }
      for (const [dx, dy] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        if (!seen.has(key) && !collides(level, nx, ny)) {
          seen.add(key);
          queue.push([nx, ny]);
        }
      }
    }
    return { level: index + 1, startSafe, reachable, states: seen.size };
  });
}

function validateSokoban(levels) {
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  return levels.map((level, index) => {
    const wallSet = new Set(level.walls.map(([x, y]) => `${x},${y}`));
    const targetSet = new Set(level.targets.map(([x, y]) => `${x},${y}`));
    const startBoxes = level.boxes.map(([x, y]) => `${x},${y}`).sort();
    const start = { player: level.player.join(","), boxes: startBoxes };
    const queue = [start];
    const seen = new Set([`${start.player}|${start.boxes.join(";")}`]);
    let solved = false;

    while (queue.length) {
      const state = queue.shift();
      const boxSet = new Set(state.boxes);
      if (state.boxes.every((box) => targetSet.has(box))) {
        solved = true;
        break;
      }
      const [px, py] = state.player.split(",").map(Number);
      for (const [dx, dy] of directions) {
        const nx = px + dx;
        const ny = py + dy;
        const nextPlayer = `${nx},${ny}`;
        if (wallSet.has(nextPlayer)) continue;
        const nextBoxes = [...state.boxes];
        const boxIndex = nextBoxes.indexOf(nextPlayer);
        if (boxIndex !== -1) {
          const bx = nx + dx;
          const by = ny + dy;
          const nextBox = `${bx},${by}`;
          if (wallSet.has(nextBox) || boxSet.has(nextBox)) continue;
          nextBoxes[boxIndex] = nextBox;
          nextBoxes.sort();
        }
        const key = `${nextPlayer}|${nextBoxes.join(";")}`;
        if (!seen.has(key)) {
          seen.add(key);
          queue.push({ player: nextPlayer, boxes: nextBoxes });
        }
      }
    }
    return { level: index + 1, solvable: solved, states: seen.size };
  });
}

const reverse = validateReverse(reverseLevels);
const sokoban = validateSokoban(sokobanLevels);

console.log("reverse");
reverse.forEach((item) => console.log(JSON.stringify(item)));
console.log("sokoban");
sokoban.forEach((item) => console.log(JSON.stringify(item)));

const failed = reverse.some((item) => !item.startSafe || !item.reachable)
  || sokoban.some((item) => !item.solvable);
process.exit(failed ? 1 : 0);
