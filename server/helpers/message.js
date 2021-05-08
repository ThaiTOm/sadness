const CryptoJS = require("crypto-js")

exports.decryptWithAES = ciphertext => {
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