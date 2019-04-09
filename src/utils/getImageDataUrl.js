/**
 * Converts image URLs to dataURL schema using Javascript only.
 * from: http://appcropolis.com/blog/web-technology/javascript-encode-images-dataurl/
 * @param {String} url Location of the image file
 * @param {Function} success Callback function that will handle successful responses. This function should take one parameter
 *                            <code>dataURL</code> which will be a type of <code>String</code>.
 * @param {Function} error Error handler.
 *
 * @example
 * const onSuccess = function(e){
 *  document.body.appendChild(e.image);
 *  alert(e.data);
 * };
 *
 * const onError = function(e){
 *  alert(e.message);
 * };
 *
 * getImageDataURL('myimage.png', onSuccess, onError);
 *
 */
function getImageDataURL(url, success, error) {
  let data;
  let canvas;
  let ctx;
  const img = new Image();
  img.onload = function onload() {
    // Create the canvas element.
    canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    // Get '2d' context and draw the image.
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    // Get canvas data URL
    try {
      data = canvas.toDataURL();
      success({ image: img, data });
    } catch (e) {
      error(e);
    }
  };
  // Load image URL.
  try {
    img.src = url;
  } catch (e) {
    error(e);
  }
}

export default getImageDataURL;
