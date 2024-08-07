function setup() {
  // Get the sketch container element
  const sketchContainer = document.getElementById('sketch');
  // Get the container's width and height
  const containerWidth = sketchContainer.offsetWidth;
  const containerHeight = sketchContainer.offsetHeight;
  // Create a canvas with the size of the container
  const canvas = createCanvas(containerWidth, containerHeight);
  // Attach the canvas to the sketch container
  canvas.parent('sketch');

  // Set the initial background color
  background(100);
}

function draw() {
  // Set a random stroke color
  stroke(random(0, 255), random(0, 255), random(0, 255));

  // Draw a random line from the top-left corner
  line(0, 0, random(0, width), random(0, height));
}

function windowResized() {
  // Adjust the canvas size when the window is resized
  const sketchContainer = document.getElementById('sketch');
  const containerWidth = sketchContainer.offsetWidth;
  const containerHeight = sketchContainer.offsetHeight;

  resizeCanvas(containerWidth, containerHeight);
}
