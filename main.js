import optimizeImage from "./lib/optimize.js";

document.addEventListener("DOMContentLoaded", main)
function main() {
  const input = document.querySelector("#img-input");
  input.addEventListener("change", async (event) => {
    const [file] = event.target.files;
    const encoding = await encodeBase64(file);

    const optimizedEncoding = await optimizeImage(encoding);
    previewEncoding(optimizedEncoding);
  });
}

/**
 *  convert a file into base64 encoding
 * 
*/
function encodeBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject('Error: ', error);
    };
  })
}

/**
 *  preview base64 image: 
 *  1. create image tag
 *  2. set encoding as src
 *  3. append image to document
*/
function previewEncoding(encoding, target = "#preview") {
  const img = document.createElement("img");
  img.src = encoding;

  const targetElement = document.querySelector(target);
  targetElement.innerHTML = '';
  targetElement.appendChild(img);
}
