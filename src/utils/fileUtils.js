// src/utils/fileUtils.js


export function getFileExtension(
  filename = ""
) {


  return filename
    .split(".")
    .pop()
    .toLowerCase();


}




export function validateFileType(
  file,
  allowedTypes = []
) {


  if (!file) {

    return false;

  }



  return allowedTypes.includes(
    file.type
  );


}




export function validateFileSize(
  file,
  maxSizeMB = 5
) {


  if (!file) {

    return false;

  }



  const maxSize =
    maxSizeMB *

    1024 *

    1024;



  return file.size <= maxSize;


}




export function formatFileSize(
  bytes = 0
) {


  if (bytes === 0) {

    return "0 Bytes";

  }



  const units = [

    "Bytes",

    "KB",

    "MB",

    "GB"

  ];



  const index =

    Math.floor(

      Math.log(bytes)

      /

      Math.log(1024)

    );



  return (

    Math.round(

      bytes /

      Math.pow(
        1024,
        index
      )

    )

    +

    " " +

    units[index]

  );


}




export function createFilePreview(
  file
) {


  return new Promise(

    (resolve, reject) => {


      if (!file) {

        reject(
          new Error(
            "File is required"
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




export function downloadFile(
  content,
  filename,
  type = "text/plain"
) {


  const blob =
    new Blob(

      [content],

      {
        type
      }

    );



  const url =
    URL.createObjectURL(
      blob
    );



  const link =
    document.createElement(
      "a"
    );



  link.href =
    url;



  link.download =
    filename;



  link.click();



  URL.revokeObjectURL(
    url
  );


}



export default {


  getFileExtension,

  validateFileType,

  validateFileSize,

  formatFileSize,

  createFilePreview,

  downloadFile


};
