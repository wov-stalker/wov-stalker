import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { promisify } from "util";

export enum StatusCode {
    Unauthorized = 401,
    Forbidden = 403,
    TooManyRequests = 429,
    InternalServerError = 500,
}


export interface ILogin {
    kind: string;
    localId: string;
    email: string;
    displayName: string;
    idToken: string;
    registered: boolean;
    refreshToken: string;
    expiresIn: string;
}


export interface IUser {
    id: string;
    username: string;
    level: number;
    clan: string;
    clanTag: string;
}



export class WolvesvilleAPI {

    apiUrl: string; // https://api-core.wolvesville.com
    googleIdentityUrl: string; // https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword
    googleIdentityKey: string;
    idToken: string;
    wovAccountEmail: string | undefined;
    wovAccountPassword: string | undefined;


    constructor(
        baseUrl: string,
        googleIdentityUrl: string,
        googleIdentityKey: string,
        wovAccountEmail?: string,
        wovAccountPassword?: string,
    ) {
        this.apiUrl = baseUrl;
        this.googleIdentityUrl = googleIdentityUrl;
        this.googleIdentityKey = googleIdentityKey;
        this.idToken = "";
        this.wovAccountEmail = wovAccountEmail || process.env.WOV_ACCOUNT_EMAIL;
        this.wovAccountPassword = wovAccountPassword || process.env.WOV_ACCOUNT_PASSWORD;
    }


    async login(email?: string, password?: string) {

        if (email) this.wovAccountEmail = email;
        if (password) this.wovAccountPassword = password;

        const response: AxiosResponse<ILogin> = await axios.post(
            this.googleIdentityUrl + "?key=" + this.googleIdentityKey,
            {
                email: this.wovAccountEmail,
                password: this.wovAccountPassword,
                returnSecureToken: true,
            }
        );
        this.idToken = response.data.idToken;
    }


    // route $/players/search?username=<username>
    async findUserByName(name: string): Promise<IUser> {
        const cfg: AxiosRequestConfig = {
            headers: {
                "Authorization": ("Bearer " + this.idToken),
            },
        };
        const response: AxiosResponse<IUser> = await axios.get(this.apiUrl + "/players/search?username=" + name, cfg);

        if (response.status === StatusCode.Unauthorized) {
            await this.login();
            await promisify(setTimeout)(1000);
            return this.findUserByName(name);
        }

        return response.data;
    }


    // route $/players/<id>
    async getUserById(id: string): Promise<IUser> {
        const cfg: AxiosRequestConfig = {
            headers: {
                "Authorization": ("Bearer " + this.idToken),
            },
        };
        const response: AxiosResponse<IUser> = await axios.get(this.apiUrl + "/players/" + id);

        if (response.status === StatusCode.Unauthorized) {
            await this.login();
            await promisify(setTimeout)(1000);
            return this.findUserByName(id);
        }

        return response.data;
    }

}