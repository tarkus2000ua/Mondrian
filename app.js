const CANVAS_WIDTH = 1050;
const CANVAS_HEIGHT = 600;
const BORDER_WIDTH = 1;
const TWO = 2;
const TEN = 10;
let isColorLocked = true;
let minSize = 0;
let maxFragments = 1000;
let mosaicColor = '#bbffbb';
let gridColor = '#a5a5a5';
let selected = null;
let rectsToDraw = [];
let rectNodes = [];
let limit;

const canvas = document.querySelector('#canvas');
canvas.style.width = CANVAS_WIDTH + 'px';
canvas.style.height = CANVAS_HEIGHT + 'px';

const fragmentColorPicker = document.querySelector('#fragment-color');
const gridColorPicker = document.querySelector('#grid-color');
const colorLock = document.querySelector('#color-lock');
isColorLocked = colorLock.checked;
console.log(isColorLocked);
fragmentColorPicker.addEventListener('input', watchFragmentColorPicker, false);
fragmentColorPicker.addEventListener('change', watchFragmentColorPicker, false);
gridColorPicker.addEventListener('input', watchGridColorPicker, false);
gridColorPicker.addEventListener('change', watchGridColorPicker, false);
colorLock.addEventListener('change', () => {
  isColorLocked = colorLock.checked
}, false);

class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

generatePattern();

document.getElementById('generate-btn').addEventListener('click', () => {
  rectNodes = [];
  while (canvas.lastElementChild) {
    canvas.removeChild(canvas.lastElementChild);
  }
  generatePattern();
})

function generatePattern() {
  minSize = document.getElementById('min-size').value;
  maxFragments = document.getElementById('max-fragments').value;
  limit = randInt('4', '16');
  console.log(limit);
  limit = limit > Math.floor(Math.log2(maxFragments)) ? Math.ceil(Math.log2(maxFragments)) : limit;
  const initialRect = new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  split(initialRect, 0, rectsToDraw);
  rectsToDraw.forEach(drawRect);
}

function watchFragmentColorPicker(event) {
  mosaicColor = event.target.value;
  selected.style.backgroundColor = mosaicColor;
  selected.classList.remove('highlight');
}

function watchGridColorPicker(event) {
  gridColor = event.target.value;
  redrawGrid(gridColor);
}

function redrawGrid(color) {
  canvas.style.borderColor = color;
}

function split(rect, counter, result) {
  let splitPoint;

  if (result.length > maxFragments - 1) {
    result.push(rect);
    return;
  }

  if (counter === limit) {
    result.push(rect);
    return;
  }

  if (rect.width + TWO * BORDER_WIDTH < minSize || rect.height2 * BORDER_WIDTH < minSize) {
    result.push(rect);
    return;
  }

  if (rect.width > rect.height) {
    const childRects = [];
    splitPoint = Math.floor(randInt('3', '8') * rect.width / TEN);
    childRects.push(new Rect(rect.x, rect.y, splitPoint, rect.height));
    childRects.push(new Rect(rect.x + splitPoint - BORDER_WIDTH, rect.y, rect.width - splitPoint +
      BORDER_WIDTH, rect.height));
    childRects.forEach((rect) => split(rect, counter + 1, result));
  } else {
    const childRects = [];
    splitPoint = Math.floor(randInt('3', '8') * rect.height / TEN);
    childRects.push(new Rect(rect.x, rect.y, rect.width, splitPoint));
    childRects.push(new Rect(rect.x, rect.y + splitPoint - BORDER_WIDTH, rect.width, rect.height - splitPoint +
      BORDER_WIDTH));
    childRects.forEach((rect) => split(rect, counter + 1, result));
  }

}

function randInt(min, max) {
  return Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1) + parseInt(min));
}

function drawRect(rect) {
  const rectNode = document.createElement('div');
  rectNode.className = 'rect';
  rectNode.style.top = rect.y + 'px';
  rectNode.style.left = rect.x + 'px';
  rectNode.style.width = rect.width + 'px';
  rectNode.style.height = rect.height + 'px';
  canvas.appendChild(rectNode);
  rectNode.addEventListener('click', (event) => {
    if (selected) {
      selected.classList.remove('highlight');
    }
    selected = event.target;
    selected.classList.add('highlight');
    if (isColorLocked) {
      selected.style.backgroundColor = mosaicColor;
    }
  });
  rectNode.addEventListener('blur', (event) => {
    event.target.classList.remove('.highlight');
  })
  rectNodes.push(rectNode);
  rectsToDraw = [];
}