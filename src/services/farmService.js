// src/services/storageService.js


class StorageService {


  constructor(prefix = "lavender") {

    this.prefix = prefix;

  }





  key(name) {

    return `${this.prefix}:${name}`;

  }





  save(name,data) {

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







  load(name,defaultValue=null) {


    try {


      const value =
        localStorage.getItem(
          this.key(name)
        );



      if (!value) {

        return defaultValue;

      }



      const parsed =
        JSON.parse(value);



      return (
        parsed.data ??
        defaultValue
      );



    } catch(error) {


      console.error(
        "Storage Load Error:",
        error
      );


      return defaultValue;


    }

  }







  exists(name) {


    return (
      localStorage.getItem(
        this.key(name)
      ) !== null
    );


  }







  remove(name) {


    try {


      localStorage.removeItem(
        this.key(name)
      );


      return true;



    } catch(error) {


      console.error(
        "Storage Remove Error:",
        error
      );


      return false;


    }

  }







  clear() {


    try {


      Object.keys(localStorage)

      .filter(key =>

        key.startsWith(
          `${this.prefix}:`
        )

      )

      .forEach(key =>

        localStorage.removeItem(
          key
        )

      );



      return true;



    } catch(error) {


      return false;


    }


  }







  backup() {


    const backup = {};



    Object.keys(localStorage)

    .filter(key =>

      key.startsWith(
        `${this.prefix}:`
      )

    )

    .forEach(key => {


      try {


        backup[key] =
          JSON.parse(
            localStorage.getItem(key)
          );


      } catch(error) {


        console.error(
          "Backup Parse Error:",
          error
        );


      }


    });



    return backup;


  }







  restore(data) {


    if (!data || typeof data !== "object") {

      return false;

    }



    try {


      Object.entries(data)

      .filter(([key]) =>

        key.startsWith(
          `${this.prefix}:`
        )

      )

      .forEach(([key,value]) => {


        localStorage.setItem(

          key,

          JSON.stringify(value)

        );


      });



      return true;



    } catch(error) {


      console.error(
        "Storage Restore Error:",
        error
      );


      return false;


    }


  }







  getStats() {


    const keys =

      Object.keys(localStorage)

      .filter(key =>

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





export const storageService =
  new StorageService();



export default storageService;
