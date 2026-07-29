// src/services/cacheService.js


class CacheService {


  constructor(){

    this.cache =
      new Map();

  }





  set(
    key,
    value,
    ttl = null
  ){

    const item = {

      value,

      createdAt:
        Date.now(),

      ttl

    };


    this.cache.set(
      key,
      item
    );


    return value;

  }





  get(key){


    const item =
      this.cache.get(
        key
      );


    if(!item)
      return null;



    if(
      item.ttl &&
      Date.now() -
      item.createdAt >
      item.ttl
    ){

      this.remove(key);

      return null;

    }



    return item.value;

  }





  has(key){

    return this.cache.has(
      key
    );

  }





  remove(key){

    return this.cache.delete(
      key
    );

  }





  clear(){

    this.cache.clear();

  }





  keys(){

    return [
      ...this.cache.keys()
    ];

  }





  values(){

    return [
      ...this.cache.values()
    ]
    .map(
      item => item.value
    );

  }





  size(){

    return this.cache.size;

  }





  getInfo(){

    return {

      size:
        this.cache.size,

      keys:
        this.keys()

    };

  }


}





export const cacheService =
  new CacheService();



export default cacheService;
