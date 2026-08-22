// src/hooks/useUsers.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import userController
  from "../controllers/userController.js";


export default function useUsers() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);


  // =========================
  // Load Users
  // =========================

  const loadUsers =
    useCallback(async () => {

      setLoading(true);
      setError(null);

      try {

        const data =
          await userController.getAll();

        setUsers(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        setError(err);

      } finally {

        setLoading(false);

      }

    }, []);


  // =========================
  // Create User
  // =========================

  const createUser =
    useCallback(async (data) => {

      setLoading(true);
      setError(null);

      try {

        const user =
          await userController.create(
            data
          );

        setUsers(prev => [
          ...prev,
          user,
        ]);

        return user;

      } catch (err) {

        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    }, []);


  // =========================
  // Update User
  // =========================

  const updateUser =
    useCallback(async (
      id,
      data
    ) => {

      setLoading(true);
      setError(null);

      try {

        const updatedUser =
          await userController.update(
            id,
            data
          );

        setUsers(prev =>
          prev.map(user =>
            String(user.id) ===
            String(id)
              ? updatedUser
              : user
          )
        );

        return updatedUser;

      } catch (err) {

        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    }, []);


  // =========================
  // Delete User
  // =========================

  const deleteUser =
    useCallback(async (id) => {

      setLoading(true);
      setError(null);

      try {

        await userController.delete(
          id
        );

        setUsers(prev =>
          prev.filter(user =>
            String(user.id) !==
            String(id)
          )
        );

        return true;

      } catch (err) {

        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    }, []);


  // =========================
  // Get User
  // =========================

  const getUserById =
    useCallback(async (id) => {

      setError(null);

      try {

        return await userController.getById(
          id
        );

      } catch (err) {

        setError(err);

        throw err;

      }

    }, []);


  // =========================
  // Count
  // =========================

  const countUsers =
    useCallback(async () => {

      setError(null);

      try {

        return await userController.count();

      } catch (err) {

        setError(err);

        throw err;

      }

    }, []);


  // =========================
  // Initial Load
  // =========================

  useEffect(() => {

    loadUsers();

  }, [
    loadUsers
  ]);


  return {

    users,

    loading,

    error,

    loadUsers,

    createUser,

    updateUser,

    deleteUser,

    getUserById,

    countUsers,

  };

}
