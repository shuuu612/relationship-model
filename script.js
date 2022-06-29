const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Circle {
  constructor(name, x, y, color, size, activity, coordinationLevel) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.activity = activity;
    this.coordinationLevel = coordinationLevel;
  }

  draw() {
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    context.stroke();
  }

  normalUpdate() {
    this.x += random(-this.activity, this.activity);
    this.y += random(-this.activity, this.activity);
  }

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

function animation() {
  context.fillStyle = 'rgba(0,0,0,0.25)';
  context.fillRect(0, 0, width, height);

  for (let i = 0; i < circles.length; i++) {
    circles[i].draw();

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
  }

  requestAnimationFrame(animation);
}

animation();
