
export const storageAvailable = (type) => {
  const storage = window[type];
  const x = '__storage_test__';
  try {
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof window.DOMException && (
      // everything except Firefox
      e.code === 22
      // Firefox
      || e.code === 1014
      // test name field too, because code might not be present
      // everything except Firefox
      || e.name === 'QuotaExceededError'
      // Firefox
      || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      // acknowledge QuotaExceededError only if there's something already stored
      && storage.length !== 0;
  }
};

export const localStorageAvailable = () => storageAvailable('localStorage');

export const sessionStorageAvailable = () => storageAvailable('sessionStorage');

export const getLocalStorage = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getLocalStorageExp = (key) => {
  let timeExp = 0;
  const localData = getLocalStorage(key);
  if (localData) {
    try {
      timeExp = new Date(JSON.parse(localData).exp).getTime();
    } catch (err) {
      console.error(err);
    }
  }
  return localData && timeExp ? timeExp : null;
};

export const getLocalStorageData = (key) => {
  let localData;
  try {
    localData = JSON.parse(getLocalStorage(key));
  } catch (err) {
    console.error(err);
  }
  return localData || null;
};

export const getLocalStorageExpConfig = () => {
  const defaultTime = new Date(Date.now() + (20 * 60000));
  return defaultTime;
};

export const setLocalStorage = (keyName, data) => {
  const exp = getLocalStorageExpConfig();
  try {
    window.localStorage.setItem(keyName, JSON.stringify({ exp, ...data }));
  } catch (err) {
    console.error(err);
  }
};
