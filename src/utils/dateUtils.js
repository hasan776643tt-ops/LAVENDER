// src/utils/dateUtils.js


// ===============================
// Get Current Date
// ===============================

export function getCurrentDate() {

  return new Date()
    .toLocaleDateString("en-CA");

}



// ===============================
// Create Timestamp
// ===============================

export function createTimestamp() {

  return new Date()
    .toISOString();

}



// ===============================
// Format Date Arabic
// ===============================

export function formatDate(date) {

  if (!date) return "";

  return new Date(date)
    .toLocaleDateString("ar-SY");

}



// ===============================
// Check Valid Date
// ===============================

export function isValidDate(date) {

  return !Number.isNaN(
    new Date(date).getTime()
  );

}
