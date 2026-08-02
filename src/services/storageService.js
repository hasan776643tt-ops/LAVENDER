
// src/services/storageService.js


class StorageService {


  constructor(prefix = "lavender") {

    this.prefix = prefix;

  }



  key(name) {

    return `${this.prefix}:${name}`;

  }



  save(name, data) {

    try {

      const payload = {

        data,

        updatedAt:
        new Date().toISOString()

      };


      localStorage.setItem(

        this.key(name),

        JSON.stringify(payload)

      );


      return true;


    } catch(error) {


      console.error(
        "Storage Save Error:",
        error
      );


      return false;

    }

  }





  load(name, defaultValue = []) {

    try {


      const value =
      localStorage.getItem(
        this.key(name)
      );


      if(!value){

        return defaultValue;

      }


      const parsed =
      JSON.parse(value);



      if(
        parsed &&
        Object.prototype.hasOwnProperty.call(
          parsed,
          "data"
        )
      ){

        return parsed.data;

      }



      return parsed;



    }catch(error){


      console.error(
        "Storage Load Error:",
        error
      );


      return defaultValue;

    }

  }





  exists(name){

    return (
      localStorage.getItem(
        this.key(name)
      ) !== null
    );

  }





  remove(name){

    try{


      localStorage.removeItem(
        this.key(name)
      );


      return true;


    }catch(error){


      console.error(
        "Storage Remove Error:",
        error
      );


      return false;

    }

  }





  clear(){

    try{


      Object.keys(localStorage)

      .filter(
        key =>
        key.startsWith(
          `${this.prefix}:`
        )
      )

      .forEach(
        key =>
        localStorage.removeItem(key)
      );


      return true;


    }catch(error){


      console.error(
        "Storage Clear Error:",
        error
      );


      return false;

    }

  }





  backup(){

    const backup = {};



    Object.keys(localStorage)

    .filter(
      key =>
      key.startsWith(
        `${this.prefix}:`
      )
    )

    .forEach(
      key=>{

        try{

          backup[key] =
          JSON.parse(
            localStorage.getItem(key)
          );


        }catch(error){


          console.error(
            "Backup Error:",
            error
          );


        }


      }
    );


    return backup;

  }





  restore(data){


    if(
      !data ||
      typeof data !== "object"
    ){

      return false;

    }



    try{


      Object.entries(data)

      .filter(
        ([key]) =>
        key.startsWith(
          `${this.prefix}:`
        )
      )

      .forEach(
        ([key,value])=>{


          localStorage.setItem(

            key,

            JSON.stringify(value)

          );


        }
      );


      return true;


    }catch(error){


      console.error(
        "Restore Error:",
        error
      );


      return false;

    }

  }





  getStats(){


    const keys =

    Object.keys(localStorage)

    .filter(
      key =>
      key.startsWith(
        `${this.prefix}:`
      )
    );



    return {

      totalKeys:
      keys.length,

      keys

    };


  }


}





const storageService =
new StorageService();



export default Object.freeze(
  storageService
);
