const clusters = require('clusters');
const width = window.innerWidth * 0.2;
const height = window.innerHeight * 0.2;
// Canvas
const canvas = document.querySelector("#canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
// Video
const video = document.querySelector("#video");

// Timing
const fps = 25;
const frameTime = 1000 / 25;
let time = 0;

// Data
let pixels = null;
let lastPixels = null;

video.play();
requestAnimationFrame(draw);


// Draw and compute difference between frames
function draw() {
  const date = new Date();
  const currentTime = date.getTime();
  const delta = currentTime - time;
  let total = 0;
  let count = 0;
  // New frame
  if (delta >= frameTime) {
    ctx.drawImage(video, 0, 0, width, height);
    const imgData = ctx.getImageData(0, 0, width, height);
    // Clone the typed array
    pixels = imgData.data.slice();
    if (lastPixels) {
      for (let i = 0; i < pixels.length; i += 4) {
        const pixel = [
          pixels[i + 0],
          pixels[i + 1],
          pixels[i + 2]
        ];
        const light = getLight(pixel);
        const lastPixel = [
          lastPixels[i + 0],
          lastPixels[i + 1],
          lastPixels[i + 2]
        ];
        const lastLight = getLight(lastPixel);
        const deltaLight = Math.abs(light - lastLight);
        total += deltaLight;
        count++;
        imgData.data[i + 0] = deltaLight;
        imgData.data[i + 1] = deltaLight;
        imgData.data[i + 2] = deltaLight;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    lastPixels = pixels;
    time = currentTime
  }
  
  if (total / count > 14) {
    ctx.drawImage(video, 0, 0, width, height);
    const data = [];
    for (let i = 0; i < pixels.length; i+= 4 * 30) {
      data.push([pixels[i + 0], pixels[i + 1], pixels[i + 2]])
    }
    clusters.k(6);
    clusters.iterations(300);
    clusters.data(data);
    const colors = document.querySelectorAll(".color");
    for (const [index, cluster] of Object.entries(clusters.clusters())) {
      const { centroid } = cluster;
      const rgb = `rgb(${centroid[0]},${centroid[1]},${centroid[2]})`;
      colors[index].style.background = rgb; 
    } 
  }
  requestAnimationFrame(draw);
}

function getLight(pixel) {
  return (pixel[0] + pixel[1] + pixel[2]) / 3
}
