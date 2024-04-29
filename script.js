// variables that take care of the image loading and the canvas
let image1Loaded = false;
let image2Loaded = false;
let image1 = new Image();
let image2 = new Image();
let canvas = document.getElementById("imageCanvas");
let ctx = canvas.getContext("2d");

function handleImageUpload(event) {
  // read the image files passed in 
  let reader = new FileReader();
  let img = new Image();
  let targetId = event.target.id;

  // loads the two images 
  reader.onload = function (e) {
    img.onload = () => {
      if (targetId === "selectImage1") {
        image1.src = e.target.result;
        image1Loaded = true;
      } else if (targetId === "selectImage2") {
        image2.src = e.target.result;
        image2Loaded = true;
      }
      if (image1Loaded && image2Loaded) {
        // error checking if images not the same size
        if (image1.width !== image2.width || image1.height !== image2.height) {
          alert("Error: Images must be of the same size.");
          image1Loaded = false;
          image2Loaded = false;
          return;
        }
        canvas.width = image1.width;
        canvas.height = image1.height;
        updateFade(0);
      }
    };
    // set the image source to the image passed in 
    img.src = e.target.result;
  };
  // read in the image that's passed in 
  reader.readAsDataURL(event.target.files[0]);
}

function fadeInto(sliderPosition) {
  // If the images are not loaded yet don't do anything
  if (!image1Loaded || !image2Loaded) return;

  // Draw the first image on the canvas
  ctx.drawImage(image1, 0, 0, image1.width, image1.height);

  let imgData1 = ctx.getImageData(0, 0, image1.width, image1.height);
  // do the same for the second image
  ctx.drawImage(image2, 0, 0, image2.width, image2.height);
  let imgData2 = ctx.getImageData(0, 0, image2.width, image2.height);

  // Loop through every pixel in the image and adjust the RGB values according to the slider position
  for (let i = 0; i < imgData1.data.length; i += 4) {
    imgData1.data[i] =
      imgData1.data[i] + (imgData2.data[i] - imgData1.data[i]) * sliderPosition;
    imgData1.data[i + 1] =
      imgData1.data[i + 1] +
      (imgData2.data[i + 1] - imgData1.data[i + 1]) * sliderPosition;
    imgData1.data[i + 2] =
      imgData1.data[i + 2] +
      (imgData2.data[i + 2] - imgData1.data[i + 2]) * sliderPosition;
  }

  // insert the new image data into the canvas
  ctx.putImageData(imgData1, 0, 0);
}
// Function that updates the fade effect
function updateFade(sliderValue) {
  let sliderPosition = sliderValue / 100;
  fadeInto(sliderPosition);
}

// Event listeners for the image upload and the slider
document
  .getElementById("selectImage1")
  .addEventListener("change", handleImageUpload, false);
document
  .getElementById("selectImage2")
  .addEventListener("change", handleImageUpload, false);
document.getElementById("fadeSlider").addEventListener("input", function () {
  updateFade(this.value);
});
