
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}


export function setCookie(name, value, options = {}) {
    const defaults = {
        path: '/',
        secure: window.location.protocol === 'https:',
        sameSite: 'Strict',
        maxAge: 8 * 60 * 60 
    };

    const settings = { ...defaults, ...options };
    
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (settings.path) cookieString += `; path=${settings.path}`;
    if (settings.maxAge) cookieString += `; max-age=${settings.maxAge}`;
    if (settings.expires) cookieString += `; expires=${settings.expires.toUTCString()}`;
    if (settings.secure) cookieString += '; secure';
    if (settings.sameSite) cookieString += `; samesite=${settings.sameSite}`;
    
    document.cookie = cookieString;
}

export function deleteCookie(name, path = '/') {
    document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}


export function hasCookie(name) {
    return getCookie(name) !== null;
}

export function setLocalStorage(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

export function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

export function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

export function clearLocalStorage() {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

export function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

const SESSION_PREFS_KEY = 'user_preferences';

export function saveUserPreferences(prefs) {
    const current = getLocalStorage(SESSION_PREFS_KEY, {});
    setLocalStorage(SESSION_PREFS_KEY, { ...current, ...prefs });
}


export function getUserPreferences() {
    return getLocalStorage(SESSION_PREFS_KEY, {});
}


export function getUserPreference(key, defaultValue = null) {
    const prefs = getUserPreferences();
    return prefs[key] !== undefined ? prefs[key] : defaultValue;
}