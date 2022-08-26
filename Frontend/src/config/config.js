require('dotenv').config();

export const ENV = {
    serverUrl: process.env.REACT_APP_SERVER_URL,
    Authorization: `Bearer ${process.env.REACT_APP_AUTHORIZATION}`,
    x_access_token: JSON.parse(localStorage.getItem("userToken")),
    x_auth_token: process.env.REACT_APP_X_AUTH_TOKEN,
    adminPrivateKey: process.env.REACT_APP_ADMIN_PRIVATE_KEY,
    saveItem: function (name, value) {
        localStorage.setItem(`${name}`, JSON.stringify(value));
    },
    removeItem: function (name) {
        localStorage.removeItem(name);
    },
    encryptUserData: function (data, token, id) {
        if (data) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('uId', JSON.stringify(id));
        }
        if (token) {
            localStorage.setItem('uToken', JSON.stringify(token));
        }
        return true;
    },
    getUserKeys: function (keys = null) {
        let userData = localStorage.getItem('userInfo');
        return userData;
    }, getToken: function () {
        let userData = localStorage.getItem('uToken');
        if (userData) {
            return userData;
        }
        return {};
    },
    getHeaders: function () {
        let token = JSON.parse(localStorage.getItem('uToken'));
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };
        if (token) {
            headers["Authorization"] = "Bearer " + token;
            headers["access-token"] = token;
        }
        return headers;
    }
    , logout: function () {
        localStorage.removeItem('uToken');
        localStorage.removeItem('uId');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('WalletAddress')
    }
}