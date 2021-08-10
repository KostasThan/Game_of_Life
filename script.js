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

function startStop() {
  if (simulationInterval) {
    startButton.textContent = '\u25BA Start';
    stopSimulation();
    simulationInterval = undefined;
  } else {
    startButton.textContent = `\u23f8 Stop`;
    startSimulation();
  }
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
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
  genPar.textContent = `Generation: ${++genCount}`;
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
}

function copyStateFromOriginalState() {
  if (initialState) {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        if (initialState[i][j] === 1)
          gridElements[i][j].style.backgroundColor = 'black';
        else gridElements[i][j].style.backgroundColor = 'white';
        gridState[i][j] = initialState[i][j];
      }
    }
  }
}

function resetGrid() {
  if (simulationInterval) {
    stopSimulation();
    copyStateFromOriginalState();
    startSimulation();
  } else {
    copyStateFromOriginalState();
  }
}

function startSimulation() {
  clearButton.style.display = 'none';
  // resetButton.style.display = 'none';
  genPar.style.display = '';
  stopExecution = false;
  calculateInitialGridState();
  gridState = calculateNextGen();
  initialState = JSON.parse(JSON.stringify(gridState));
  paintNextGen();

  function nextStep() {
    calculateInitialGridState();
    gridState = calculateNextGen();
    paintNextGen();
  }
  // let nextInterval = Date.now() + refreshDelay;
  // setTimeout(
  //   () => timer(nextStep, nextInterval, () => stopExecution),
  //   refreshDelay
  // );
  simulationInterval = setInterval(nextStep, refreshDelay);
}

function stopSimulation() {
  clearInterval(simulationInterval);
  stopExecution = true;
  clearButton.style.display = '';
  genCount = 0;
  genPar.style.display = 'none';
  resetButton.style.display = '';
}

/**
 * not used atm
 */
function timer(func, startTime, stopRecursion) {
  let dt = Date.now() - startTime; // the drift (positive for overshooting)
  startTime += refreshDelay;
  if (!stopRecursion()) {
    func();
    setTimeout(
      () => timer(func, startTime, stopRecursion),
      Math.max(0, refreshDelay - dt)
    );
  }
}

const openModal = function () {
  modal.classList.remove('hidden');
  //overlay.classList.remove('hidden');
};

const closeModal = function () {
  if (!modal.classList.contains('hidden')) modal.classList.add('hidden');
  //overlay.classList.add('hidden');
};

let simulationInterval;
let stopExecution = false;
let refreshDelay = 1000;
let state = 0;
const rows = 100;
const columns = 100;
let gridState = Array(columns)
  .fill(0)
  .map(x => Array(rows).fill(0));

let initialState;
let gridElements = [];
let genCount = 0;
const grid = document.getElementById('container');
const startButton = document.getElementById('startButton');
const clearButton = document.getElementById('clearButton');
const resetButton = document.getElementById('resetButton');
const progressBar = document.getElementById('myProgress');
const genPar = document.getElementById('GenPar');
const gridStyle = grid.style;
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModalButton');

setGridColumns(columns);
createSquares(columns, rows);
document.body.addEventListener('mouseenter', () => (state = 0));
grid.addEventListener('mouseenter', () => (state = 0));
startButton.addEventListener('click', startStop);
clearButton.addEventListener('click', clearGrid);
resetButton.addEventListener('click', resetGrid);
genPar.style.display = 'none';
closeModalButton.addEventListener('click', closeModal);
document.body.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
