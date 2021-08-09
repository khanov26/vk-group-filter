export default class VK {
    static USER_AUTHORIZATION_FAILED_ERROR = 5;

    static METHODS_BASE_URL = "https://api.vk.com/method/";
    static API_VERSION = "5.103";

    constructor({appId, scope}) {
        this.appId = appId;
        this.scope = scope;
    }

    getToken() {
        return new Promise((resolve, reject) => {
            let token = window.localStorage.getItem("token");
            let expires = window.localStorage.getItem("expires");

            if (!token || expires < Date.now()) {
                let authWindow = this.auth();

                authWindow.onload = () => {
                };

                let authCheck = () => {
                    if (authWindow.closed) {
                        clearTimeout(timerId);
                        reject("Окно авторизации закрыто");
                    }

                    try {
                        let link = authWindow.location.href;
                        if (link === "about:blank") {
                            return null;
                        }
                        authWindow.close();
                        clearTimeout(timerId);
                        if (link && link.includes("access_token")) {
                            token = VK.parseURL("access_token", link);
                            expires = +VK.parseURL("expires_in", link) * 1000 + Date.now();
                            window.localStorage.setItem("token", token);
                            window.localStorage.setItem("expires", expires);
                            this.token = token;
                            resolve();
                        } else {
                            reject("Не удалось получить токен");
                        }
                    } catch (e) {}
                };

                let timerId = setInterval(authCheck, 100);
            } else {
                this.token = token;
                resolve();
            }
        });
    }

    resetToken() {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("expires");
        this.token = null;
    }

    static parseURL(needle, subject) {
        let regex = new RegExp(`${needle}=([^&]+)`);
        let result = subject.match(regex);
        return result[1] || null;
    }

    async call(methodName, params) {
        if (!this.token) {
            try {
                await this.getToken();
            } catch (error) {
                return {
                    isSuccess: false,
                    errorText: error,
                }
            }
        }

        let url = new URL(VK.METHODS_BASE_URL + methodName);
        for (let prop in params) {
            url.searchParams.set(prop, params[prop]);
        }
        url.searchParams.set("access_token", this.token);
        url.searchParams.set("v", VK.API_VERSION);

        let callbackFuncName = "vkResponse" + Math.floor(Math.random() * 1000);
        url.searchParams.set("callback", callbackFuncName);

        let response = await new Promise(resolve => {
            let script = document.createElement("script");
            script.src = url.href;
            document.body.appendChild(script);

            window[callbackFuncName] = function(data) {
                resolve(data);
                document.body.removeChild(script);
            }
        });

        if (response.error) {
            if (response.error.error_code === VK.USER_AUTHORIZATION_FAILED_ERROR) {
                this.resetToken();
                return await this.call(methodName, params);
            } else {
                return {
                    isSuccess: false,
                    errorCode: response.error.error_code,
                    errorMessage: response.error.error_msg,
                }
            }
        }

        return {
            isSuccess: true,
            data: response.response,
        }
    }

    auth() {
        let url = new URL("https://oauth.vk.com/authorize");
        url.searchParams.set("client_id", this.appId);
        url.searchParams.set("redirect_uri", window.location.origin + "/auth");
        url.searchParams.set("display", "popup");
        url.searchParams.set("scope", this.scope);
        url.searchParams.set("response_type", "token");
        url.searchParams.set("v", this.API_VERSION);

        return window.open(url, "VK auth", "width=400,height=400");
    }
}
