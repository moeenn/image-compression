function optimizeImage(imageSrc, config = {}) {
  const defaultConfig = {
    maxWidth: 2560,
    maxHeight: 1440,
    mimeType: "image/jpeg",
    quality: 0.5,
    debug: true,
  };

  config = Object.assign(defaultConfig, config);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onerror = function () {
      reject("Invalid image source provided");
    };

    img.onload = function () {
      const [newWidth, newHeight] = calculateSize(img, config.maxWidth, config.maxHeight);
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          if (config.debug) logInfo(blob);
          const base64Encoding = blobToBase64(blob);
          resolve(base64Encoding);
        },
        config.mimeType,
        config.quality
      );
    };
  });
}

/**
 *  calcute dimentions for the canvas
 * 
*/
function calculateSize(img, maxWidth, maxHeight) {
  let width = img.width;
  let height = img.height;

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
}


/**
 *  after the image has been processed, the canvas returns image as a blob
 *  here, we convert it into base64 encoding
*/
function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}


/**
 *  log the new size of the image in console
*/
function logInfo(blob) {
  const readableBytes = (bytes) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  };

  const message = `Optimized Size: ${readableBytes(blob.size)}`;
  console.log(message);
}

export default optimizeImage;