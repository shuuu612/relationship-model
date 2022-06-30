const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const button = document.getElementById('button');
const playIcon = document.getElementById('play');
const stopIcon = document.getElementById('stop');

button.addEventListener('click', handleClick);
playIcon.style.cssText = 'display:none';

document.addEventListener('keyup', handleKeyup);

let requestID;
let isPlaying = true;

class Circle {
  constructor(name, x, y, color, size, activity, coordinationLevel) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.activity = activity;
    this.coordinationLevel = coordinationLevel;
    this.path = [{ x: x, y: y }];
  }

  // Function to draw a circle at the current position
  drawCircle() {
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    context.stroke();
  }

  // Function to draw the path taken so far
  drawPath() {
    const length = this.path.length;
    const firstPath = this.path[0];
    const lastPath = this.path[length - 1];

    // Draw a start point
    context.beginPath();
    context.fillStyle = 'rgba(255,255,255,0.4)';
    context.moveTo(firstPath.x, firstPath.y);
    context.arc(firstPath.x, firstPath.y, 8, 0, 2 * Math.PI);
    context.fill();

    // Draw a path
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.moveTo(firstPath.x, firstPath.y);

    for (let i = 1; i < length; i += 60) {
      context.lineTo(this.path[i].x, this.path[i].y);
    }
    context.lineTo(lastPath.x, lastPath.y);
    context.stroke();

    // Draw a end point
    context.beginPath();
    context.fillStyle = this.color;
    context.moveTo(lastPath.x, lastPath.y);
    context.arc(lastPath.x, lastPath.y, 4, 0, 2 * Math.PI);
    context.fill();
  }

  // Function to update the next position without considering the other position
  normalUpdate() {
    this.x += random(-this.activity, this.activity);
    this.y += random(-this.activity, this.activity);
  }

  // Function to update the next position to coordinate with the other
  cooperationUpdate() {
    const other = circles.find((circle) => circle.name !== this.name);

    if (this.x > other.x) {
      this.x +=
        this.coordinationLevel >= 0
          ? random(-this.activity, 0)
          : random(0, this.activity);
    } else {
      this.x +=
        this.coordinationLevel >= 0
          ? random(0, this.activity)
          : random(-this.activity, 0);
    }

    if (this.y > other.y) {
      this.y +=
        this.coordinationLevel >= 0
          ? random(-this.activity, 0)
          : random(0, this.activity);
    } else {
      this.y +=
        this.coordinationLevel >= 0
          ? random(0, this.activity)
          : random(-this.activity, 0);
    }
  }

  // Function to avoid collisions to the four corners
  check() {
    if (this.x + this.size >= width) {
      this.x += -this.activity;
    }

    if (this.x - this.size <= 0) {
      this.x += this.activity;
    }

    if (this.y + this.size >= height) {
      this.y += -this.activity;
    }

    if (this.y - this.size <= 0) {
      this.y += this.activity;
    }
  }

  // Function to save path
  save() {
    this.path.push({ x: this.x, y: this.y });
  }
}

let circles = [
  // love and love
  new Circle('circle1', width / 2, height / 2, 'rgb(207,221,164)', 40, 3, 20), // Yellow circle
  new Circle('circle2', width / 2, height / 2, 'rgb(82,158,175)', 40, 3, 20), // Blue circle
];

/* let circles = [
  // love and hate
  new Circle('circle1', width / 2, height / 2, 'rgb(207,221,164)', 40, 3, 20), // Yellow circle
  new Circle('circle2', width / 2, height / 2, 'rgb(82,158,175)', 40, 3, -20), // Blue circle
]; */

/* let circles = [
  // hate and hate
  new Circle('circle1', width / 2, height / 2, 'rgb(207,221,164)', 40, 3, -20), // Yellow circle
  new Circle('circle2', width / 2, height / 2, 'rgb(82,158,175)', 40, 3, -20), // Blue circle
]; */

/* let circles = [
  // love and indifferent
  new Circle('circle1', width / 2, height / 2, 'rgb(207,221,164)', 40, 3, 20), // Yellow circle
  new Circle('circle2', width / 2, height / 2, 'rgb(82,158,175)', 40, 3, null), // Blue circle
]; */

/* let circles = [
  // hate and indifferent
  new Circle('circle1', width / 2, height / 2, 'rgb(207,221,164)', 40, 3, -20), // Yellow circle
  new Circle('circle2', width / 2, height / 2, 'rgb(82,158,175)', 40, 3, null), // Blue circle
]; */

/* let circles = [
  // indifferent and indifferent
  new Circle('circle1', width / 2, height / 2, 'rgb(207,221,164)', 40, 3, null), // Yellow circle
  new Circle('circle2', width / 2, height / 2, 'rgb(82,158,175)', 40, 3, null), // Blue circle
]; */

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startDrawCircle() {
  context.fillStyle = 'rgba(0,0,0,0.25)';
  context.fillRect(0, 0, width, height);

  for (let i = 0; i < circles.length; i++) {
    circles[i].drawCircle();

    if (circles[i].coordinationLevel === null) {
      circles[i].normalUpdate();
    } else if (
      random(
        0,
        circles[i].coordinationLevel >= 0
          ? circles[i].coordinationLevel
          : -circles[i].coordinationLevel
      ) === 0
    ) {
      circles[i].cooperationUpdate();
    } else {
      circles[i].normalUpdate();
    }

    circles[i].check();
    circles[i].save();
  }

  requestID = requestAnimationFrame(startDrawCircle);
}

function startDrawPath() {
  context.fillStyle = 'rgb(0,0,0)';
  context.fillRect(0, 0, width, height);

  for (let i = 0; i < circles.length; i++) {
    circles[i].drawPath();
  }

  for (let i = 0; i < circles.length; i++) {
    circles[i].drawCircle();
  }
}

function handleClick() {
  if (isPlaying) {
    clickStop();
  } else {
    clickPlay();
  }
  isPlaying = !isPlaying;
}

function handleKeyup(e) {
  if (e.code === 'Space') {
    handleClick();
  }
}

function clickPlay() {
  viewStopIcon();
  startDrawCircle();
}

function clickStop() {
  viewPlayIcon();
  cancelAnimationFrame(requestID);
  startDrawPath();
}

function viewPlayIcon() {
  playIcon.style.cssText = '';
  stopIcon.style.cssText = 'display:none';
}

function viewStopIcon() {
  playIcon.style.cssText = 'display:none';
  stopIcon.style.cssText = '';
}

startDrawCircle();
