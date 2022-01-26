import { async } from 'regenerator-runtime';

import { TIMEOUT_SEC, BOOKMARKS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const saveBookmarks = data => {
  window.localStorage.setItem(BOOKMARKS, JSON.stringify(data));
};

export const loadBookmarks = () => window.localStorage.getItem(BOOKMARKS);

export const isContainIngredient = str => str.includes('ingredient');
export const isEmpty = str => str.length === 0;
