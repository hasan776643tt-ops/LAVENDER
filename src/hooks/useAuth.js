// src/hooks/useAuth.js


import {
  useState,
  useCallback
} from "react";


import authService
from "../services/authService.js";



export default function useAuth() {


  const [user, setUser] =
    useState(null);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState(null);




  const login = useCallback(

    async (
      credentials
    ) => {


      try {


        setLoading(true);

        setError(null);



        const result =
          await authService.login(
            credentials
          );



        setUser(result);



        return result;


      } catch (err) {


        setError(
          err.message
        );


        throw err;


      } finally {


        setLoading(false);


      }


    },

    []

  );




  const register = useCallback(

    async (
      userData
    ) => {


      try {


        setLoading(true);

        setError(null);



        const result =
          await authService.register(
            userData
          );



        setUser(result);



        return result;


      } catch (err) {


        setError(
          err.message
        );


        throw err;


      } finally {


        setLoading(false);


      }


    },

    []

  );




  const logout = useCallback(

    async () => {


      try {


        setLoading(true);

        setError(null);



        await authService.logout();



        setUser(null);


      } catch (err) {


        setError(
          err.message
        );


        throw err;


      } finally {


        setLoading(false);


      }


    },

    []

  );




  const refreshUser = useCallback(

    async () => {


      try {


        const currentUser =
          await authService.getCurrentUser();



        setUser(
          currentUser
        );



        return currentUser;


      } catch (err) {


        setError(
          err.message
        );


        return null;


      }


    },

    []

  );




  return {


    user,

    loading,

    error,



    login,

    register,

    logout,

    refreshUser


  };


}
