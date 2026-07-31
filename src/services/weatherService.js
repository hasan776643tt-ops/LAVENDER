// src/services/weatherService.js


import weatherRepository
  from "../repositories/weatherRepository.js";



class WeatherService {



  constructor() {

    this.repository =
      weatherRepository;

  }







  async getAll() {


    try {


      return await this.repository.getAll();



    } catch(error) {


      throw new Error(

        `WeatherService getAll failed: ${error.message}`

      );


    }


  }









  async getById(id) {


    try {


      if (!id) {


        throw new Error(

          "Weather ID is required"

        );


      }




      const weather =

        await this.repository.getById(id);





      if (!weather) {


        throw new Error(

          "Weather record not found"

        );


      }




      return weather;



    } catch(error) {


      throw new Error(

        `WeatherService getById failed: ${error.message}`

      );


    }


  }









  async create(weatherData) {


    try {


      this.validateWeather(

        weatherData

      );





      return await this.repository.create(

        weatherData

      );



    } catch(error) {


      throw new Error(

        `WeatherService create failed: ${error.message}`

      );


    }


  }









  async update(id,weatherData) {


    try {


      if (!id) {


        throw new Error(

          "Weather ID is required"

        );


      }





      this.validateWeather(

        weatherData

      );





      const weather =

        await this.repository.update(

          id,

          weatherData

        );





      if (!weather) {


        throw new Error(

          "Weather record not found"

        );


      }




      return weather;



    } catch(error) {


      throw new Error(

        `WeatherService update failed: ${error.message}`

      );


    }


  }









  async delete(id) {


    try {


      if (!id) {


        throw new Error(

          "Weather ID is required"

        );


      }





      const exists =

        await this.repository.exists(id);





      if (!exists) {


        throw new Error(

          "Weather record not found"

        );


      }





      await this.repository.delete(

        id

      );





      return {


        success:true,


        message:

          "Weather deleted successfully"


      };



    } catch(error) {


      throw new Error(

        `WeatherService delete failed: ${error.message}`

      );


    }


  }









  async count() {


    try {


      return await this.repository.count();



    } catch(error) {


      throw new Error(

        `WeatherService count failed: ${error.message}`

      );


    }


  }









  async getLatest() {


    try {


      const weather =

        await this.repository.getAll();





      if (!weather.length) {


        return null;


      }





      return weather.sort(

        (a,b)=>

          new Date(b.createdAt)

          -

          new Date(a.createdAt)

      )[0];



    } catch(error) {


      throw new Error(

        `WeatherService getLatest failed: ${error.message}`

      );


    }


  }









  validateWeather(weather) {


    if (!weather) {


      throw new Error(

        "Weather data is required"

      );


    }





    if (!weather.location) {


      throw new Error(

        "Weather location is required"

      );


    }





    return true;


  }



}





export default Object.freeze(

  new WeatherService()

);
