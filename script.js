let image1Loaded = false;
let image2Loaded = false;
let image1 = new Image();
let image2 = new Image();
let canvas = document.getElementById("imageCanvas");
let ctx = canvas.getContext("2d");

// async function handleImageUpload(event) {
//   let reader = new FileReader();
//   let img = new Image();
//   let targetId = event.target.id;

 

//   reader.onload = function (e) {
//     img.onload = async () => {
//       if (targetId === "selectImage1") {
//         image1.src = e.target.result;
//         image1Loaded = true;
//       } else if (targetId === "selectImage2") {
//         image2.src = e.target.result;
//         image2Loaded = true;
//       }
//       if (image1Loaded && image2Loaded) {
//         canvas.width = image1.width;
//         canvas.height = image1.height;
//         updateFade(0);
//       }

//       if (image1.width != image2.width || image1.height != image2.height){
//         const url = `https://image-editor1.p.rapidapi.com/api/image/resize?width=${image1.width}&height=${image1.height}`;
//         const data = new FormData();
//         console.log(image2.src);
//         data.append('image', image2.src);
        
        
//               const options = {
//                 method: 'POST',
//                 headers: {
//                   Accept: 'image/*', // this can be modified
//                   'X-RapidAPI-Key': '116addc457msh4580296aaa39d98p191d68jsn904ccd158204',
//                   'X-RapidAPI-Host': 'image-editor1.p.rapidapi.com'
//                 },
//                 body: data
//               };
        
//               try {
//                 const response = await fetch(url, options);
//                 const result = await data;
//                 console.log("Result" + result);
//                 return result; 
//               } catch (error) {
//                 console.error(error);
//               }
//       }
//     };
//     img.src = e.target.result;
//   };
//   reader.readAsDataURL(event.target.files[0]);
// }

async function handleImageUpload(event) {
  let reader = new FileReader();
  let img = new Image();
  let targetId = event.target.id;

  reader.onload = async function (e) {
    img.onload = async () => {
      if (targetId === "selectImage1") {
        image1.src = e.target.result;
        image1Loaded = true;
      } else if (targetId === "selectImage2") {
        image2.src = e.target.result;
        image2Loaded = true;
      }

      if (image1Loaded && image2Loaded) {
        canvas.width = image1.width;
        canvas.height = image1.height;
        
        if (image1.width !== image2.width || image1.height !== image2.height) {
          const url = `https://image-editor1.p.rapidapi.com/api/image/resize?width=${image1.width}&height=${image1.height}`;
          const data = new FormData();
          data.append('image', image2.src);

          const options = {
            method: 'POST',
            headers: {
              Accept: 'image/*',
              'X-RapidAPI-Key': '116addc457msh4580296aaa39d98p191d68jsn904ccd158204',
              'X-RapidAPI-Host': 'image-editor1.p.rapidapi.com'
            },
            body: data
          };

          try {
            const response = await fetch(url, options);
            const blob = await response.blob();
            const resizedImageUrl = URL.createObjectURL(blob);

            image2.onload = function() {
              ctx.drawImage(image1, 0, 0, image1.width, image1.height);
              ctx.drawImage(image2, 0, 0, image2.width, image2.height);
              updateFade(0);
            };
            image2.src = resizedImageUrl;
          } catch (error) {
            console.error(error);
          }
        } else {
          // If no resize is needed, proceed with the regular blending
          ctx.drawImage(image1, 0, 0, image1.width, image1.height);
          ctx.drawImage(image2, 0, 0, image2.width, image2.height);
          updateFade(0);
        }
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}


function fadeInto(sliderPosition) {
  if (!image1Loaded || !image2Loaded) return;

  ctx.drawImage(image1, 0, 0, image1.width, image1.height);

  let imgData1 = ctx.getImageData(0, 0, image1.width, image1.height);
  ctx.drawImage(image2, 0, 0, image2.width, image2.height);
  let imgData2 = ctx.getImageData(0, 0, image2.width, image2.height);

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

  ctx.putImageData(imgData1, 0, 0);
}

function updateFade(sliderValue) {
  let sliderPosition = sliderValue / 100;
  fadeInto(sliderPosition);
}

document
  .getElementById("selectImage1")
  .addEventListener("change", handleImageUpload, false);
document
  .getElementById("selectImage2")
  .addEventListener("change", handleImageUpload, false);
document.getElementById("fadeSlider").addEventListener("input", function () {
  updateFade(this.value);
});
