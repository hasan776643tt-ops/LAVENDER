// src/utils/imageUtils.js


export function validateImage(
  file
) {


  if (!file) {

    return false;

  }



  return file.type.startsWith(
    "image/"
  );


}




export function resizeImage(
  file,
  maxWidth = 1200,
  maxHeight = 1200
) {


  return new Promise(

    (resolve, reject) => {


      if (!file) {

        reject(
          new Error(
            "Image file is required"
          )
        );

        return;

      }



      const image =
        new Image();



      const reader =
        new FileReader();



      reader.onload =
        (event) => {


          image.src =
            event.target.result;


        };



      image.onload =
        () => {


          let width =
            image.width;


          let height =
            image.height;



          if (
            width > maxWidth
          ) {


            height =

              height *

              (
                maxWidth /
                width
              );


            width =
              maxWidth;


          }



          if (
            height > maxHeight
          ) {


            width =

              width *

              (
                maxHeight /
                height
              );


            height =
              maxHeight;


          }



          const canvas =
            document.createElement(
              "canvas"
            );



          canvas.width =
            width;



          canvas.height =
            height;



          const context =
            canvas.getContext(
              "2d"
            );



          context.drawImage(

            image,

            0,

            0,

            width,

            height

          );



          canvas.toBlob(

            blob => {


              resolve(
                blob
              );


            },

            "image/jpeg",

            0.85

          );


        };



      reader.onerror =
        reject;



      reader.readAsDataURL(
        file
      );


    }

  );


}




export function createImagePreview(
  file
) {


  return new Promise(

    (resolve, reject) => {


      if (!file) {

        reject(
          new Error(
            "Image file is required"
          )
        );

        return;

      }



      const reader =
        new FileReader();



      reader.onload =
        () => {


          resolve(
            reader.result
          );


        };



      reader.onerror =
        reject;



      reader.readAsDataURL(
        file
      );


    }

  );


}




export function getImageDimensions(
  file
) {


  return new Promise(

    (resolve, reject) => {


      const image =
        new Image();



      image.onload =
        () => {


          resolve({

            width:
              image.width,


            height:
              image.height


          });


        };



      image.onerror =
        reject;



      image.src =
        URL.createObjectURL(
          file
        );


    }

  );


}



export default {


  validateImage,

  resizeImage,

  createImagePreview,

  getImageDimensions


};
