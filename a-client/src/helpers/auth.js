import cookie from "js-cookie";
import { replaceTelex } from "./main/algorithm";
import CryptoJS from 'crypto-js';

//Set cookie
export const setCookie = (key, value) => {
    if (window !== "undefined") {
        cookie.set(key, value, {
            expires: 7
        })
    }
}
export const removeCookie = key => {
    if (window !== "undefined") {
        cookie.remove(key, {
            expires: 1
        })
    }
}
export const getCookie = key => {
    if (window !== "undefined") {
        return cookie.get(key)
    }
}
export const setLocalStorage = (key, value) => {
    if (window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value))
    }
}
export const removeLocalStorage = key => {
    if (window !== "undefined") {
        localStorage.removeItem(key)
    }
}

// Auth user after login
export const authenicate = (res, next) => {
    let userName;
    if (res.data.user.name) {
        userName = replaceTelex(res.data.user.name)
    } else {
        userName = replaceTelex(res.data.user)
    }
    setCookie("token", res.data.token);
    setLocalStorage("user", userName);
}

// Sign out
export const signOut = next => {
    removeCookie("token");
    removeLocalStorage("user");
}

export const isAuth = () => {
    if (window !== "undefined") {
        const cookieChecked = getCookie("token")
        if (cookieChecked) {
            if (localStorage.getItem("user")) {
                return JSON.parse(localStorage.getItem("user"))
            } else {
                return false
            }
        }
    }
}

export const updateUser = (res, next) => {
    if (window !== "undefined") {
        let auth = JSON.parse(localStorage.getItem("user"))
        auth = res.data
        localStorage.setItem("user", JSON.stringify(auth))
    }
    next()
}
//  
export const encryptTo = text => {
    const passphrase = '123nguyenduythaise1';
    return CryptoJS.AES.encrypt(text, passphrase).toString();
}

export const decryptWithAES = ciphertext => {
    const passphrase = '123nguyenduythaise1';
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    let originalText
    //if original text is defined that assign it
    try {
        originalText = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        originalText = ""
    }
    return originalText;
};