'use strict';

function createSquares(columns, rows) {
  gridElements.push([]);
  for (let i = 0; i < columns; i++) {
    gridElements[i] = [];
    for (let j = 0; j < rows; j++) {
      const element = document.createElement('DIV');
      element.style.backgroundColor = 'white';
      element.classList.add('grid-item');
      grid.appendChild(element);
      element.addEventListener('mousedown', changeStateAndColor);
      element.addEventListener('mouseup', () => (state = 0));
      element.addEventListener('mouseenter', changeColorAfterValidation);
      gridElements[i].push(element);
    }
  }
}

function changeStateAndColor(event) {
  if (event.target.style.backgroundColor === 'white') {
    changeState();
    changeElementColor(event.target);
  } else {
    event.target.style.backgroundColor = 'white';
  }
}

function changeState() {
  state = state ? 0 : 1;
}

function changeColorAfterValidation(event) {
  if (state === 1) {
    changeElementColor(event.target);
  }
}

function changeElementColor(element) {
  element.style.backgroundColor = 'black';
}

function setGridColumns(columns) {
  gridStyle.gridTemplateColumns = `repeat(auto-fill, 20px)`;
}

function startSimulation() {
  calculateInitialGridState();
  gridState = calculateNextGen();
  paintNextGen();
  interval = setInterval(() => {
    gridState = calculateNextGen();
    paintNextGen();
  }, 1000);
}

function calculateInitialGridState() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      gridState[i][j] =
        gridElements[i][j].style.backgroundColor === 'black' ? 1 : 0;
    }
  }
}

function calculateNextGen() {
  let newGridState = Array(columns)
    .fill(0)
    .map(x => Array(rows).fill(0));

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      const neighborCount = calculateNeighbors(i, j);
      newGridState[i][j] = calculateNewState(gridState[i][j], neighborCount);
    }
  }
  return newGridState;
}

function calculateNeighbors(i, j) {
  let count = 0;
  for (let k = -1; k <= 1; k++) {
    for (let l = -1; l <= 1; l++) {
      count += gridState[(i + k + columns) % columns][(j + l + rows) % rows];
    }
  }
  return count - gridState[i][j];
}

function calculateNewState(currentState, neighborCount) {
  if (currentState === 1) {
    if (neighborCount === 2 || neighborCount === 3) {
      return 1;
    }
    return 0;
  } else {
    if (neighborCount === 3) {
      return 1;
    }
    return 0;
  }
}

function paintNextGen() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      gridElements[i][j].style.backgroundColor =
        gridState[i][j] === 1 ? 'black' : 'white';
    }
  }
}

function clearGrid() {
  gridElements.forEach(arr =>
    arr.forEach(el => (el.style.backgroundColor = 'white'))
  );
  gridState.forEach(el => 0);
  console.log('clearing');
}

let state = 0;
const rows = 100;
const columns = 100;
let gridState = Array(columns)
  .fill(0)
  .map(x => Array(rows).fill(0));
let gridElements = [];
const grid = document.getElementById('container');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const clearButton = document.getElementById('clearButton');
const gridStyle = grid.style;
let interval;

setGridColumns(columns);
createSquares(columns, rows);
document.body.addEventListener('mouseenter', () => (state = 0));
grid.addEventListener('mouseenter', () => (state = 0));
startButton.addEventListener('click', startSimulation);
stopButton.addEventListener('click', () => clearInterval(interval));
clearButton.addEventListener('click', clearGrid);
