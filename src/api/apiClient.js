// src/api/apiClient.js

import logger
from "../utils/logger.js";

import {
  handleError
}
from "../utils/errorHandler.js";

import {
  storageService
}
from "../storage";

import appConfig
from "../config/appConfig.js";


// ===============================
// API Configuration
// ===============================

const getBaseUrl = () => {

  return (
    appConfig?.api?.baseUrl
    ||
    ""
  );

};


const getTimeout = () => {

  return (
    appConfig?.api?.timeout
    ||
    10000
  );

};


// ===============================
// Authentication
// ===============================

const getToken = () => {

  return storageService.load(
    "lavender_token",
    null
  );

};


// ===============================
// Build Headers
// ===============================

const buildHeaders = (
  options = {}
) => {

  const token =
    getToken();

  return {

    "Content-Type":
      "application/json",

    Accept:
      "application/json",

    ...(token && {

      Authorization:
        `Bearer ${token}`

    }),

    ...options.headers

  };

};


// ===============================
// Request Handler
// ===============================

const request = async (

  endpoint,

  options = {}

) => {

  const controller =
    new AbortController();

  const timeoutId =
    setTimeout(
      () =>
        controller.abort(),
      getTimeout()
    );

  try {

    const response =
      await fetch(
        `${getBaseUrl()}${endpoint}`,
        {
          ...options,

          headers:
            buildHeaders(
              options
            ),

          signal:
            controller.signal
        }
      );

    clearTimeout(
      timeoutId
    );

    let data = null;

    const contentType =
      response.headers.get(
        "content-type"
      );

    if (
      contentType &&
      contentType.includes(
        "application/json"
      )
    ) {

      data =
        await response.json();

    }

    if (
      !response.ok
    ) {

      throw new Error(
        data?.message
        ||
        `Request failed ${response.status}`
      );

    }

    return data;

  } catch (error) {

    clearTimeout(
      timeoutId
    );

    const formattedError =
      handleError(
        error
      );

    logger.error?.(
      "API Request Error",
      formattedError
    );

    throw formattedError;

  }

};


// ===============================
// HTTP Methods
// ===============================

const get = (
  endpoint,
  options = {}
) => {

  return request(
    endpoint,
    {
      method:
        "GET",

      ...options
    }
  );

};


const post = (
  endpoint,
  data,
  options = {}
) => {

  return request(
    endpoint,
    {
      method:
        "POST",

      body:
        JSON.stringify(
          data
        ),

      ...options
    }
  );

};


const put = (
  endpoint,
  data,
  options = {}
) => {

  return request(
    endpoint,
    {
      method:
        "PUT",

      body:
        JSON.stringify(
          data
        ),

      ...options
    }
  );

};


const patch = (
  endpoint,
  data,
  options = {}
) => {

  return request(
    endpoint,
    {
      method:
        "PATCH",

      body:
        JSON.stringify(
          data
        ),

      ...options
    }
  );

};


const remove = (
  endpoint,
  options = {}
) => {

  return request(
    endpoint,
    {
      method:
        "DELETE",

      ...options
    }
  );

};


const apiClient = Object.freeze({

  get,

  post,

  put,

  patch,

  delete:
    remove

});


export default apiClient;
