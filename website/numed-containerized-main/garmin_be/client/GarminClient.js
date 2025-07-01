import basicAuth from "./auth/BasicAuth.js";
import axios from "axios";

const REQUEST_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/request_token";
const REQUEST_ACCESS_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/access_token";

export class GarminClient {

    static async getRequestToken() {
        const URL = REQUEST_TOKEN_URL;
        const config = {
            headers: {
                "Authorization": basicAuth.getHeader(
                    'POST', URL,
                    {

                    },
                    {

                    }, 
                    {

                    }
                ),
            }
        };

        const data = {};
        return axios.post(URL, data, config)
                .then(({data: res_data}) => {
                    const reg = /oauth_token=(.+)&oauth_token_secret=(.+)/
                    const match = res_data.match(reg);
                    const tokens = {oauth_token: match[1], oauth_token_secret: match[2]};
                    return tokens;
                });
    }

    static async getUserToken(oauthToken, oauthTokenSecret, oauthVerifier) {
        const URL = REQUEST_ACCESS_TOKEN_URL;
        const config = {
            headers: {
                "Authorization": basicAuth.getHeader(
                    'POST', URL,
                    {
                        oauth_token: oauthToken,
                        oauth_token_secret: oauthTokenSecret,
                    },
                    {

                    }, 
                    {
                        oauth_verifier: oauthVerifier
                    }
                ),
            }
        };

        const data = {};
        return axios.post(URL, data, config)
                .then(({ data: res_data }) => {
                    const reg = /oauth_token=(.+)&oauth_token_secret=(.+)/
                    const match = res_data.match(reg);
                    const tokens = {oauth_token: match[1], oauth_token_secret: match[2]};
                    return tokens;
                });
    }

    static async getPulseOx(oauthToken, oauthTokenSecret, uploadStartTimeInSeconds, uploadEndTimeInSeconds) {
        const URL = `https://apis.garmin.com/wellness-api/rest/pulseOx?uploadStartTimeInSeconds=${uploadStartTimeInSeconds}&uploadEndTimeInSeconds=${uploadEndTimeInSeconds}`;
        const config = {
            headers: {
                "Authorization": basicAuth.getHeader(
                    'GET', URL,
                    {
                        oauth_token: oauthToken,
                        oauth_token_secret: oauthTokenSecret
                    },
                    {
                        uploadStartTimeInSeconds: uploadStartTimeInSeconds,
                        uploadEndTimeInSeconds: uploadEndTimeInSeconds
                    },
                    {

                    }
                ),
            }
        };
        const data = {};
        return axios.get(URL, config)
            .then(({data: res_data}) => {
                return res_data;
            });
    }

    static async getHealthSnapshot(oauthToken, oauthTokenSecret, uploadStartTimeInSeconds, uploadEndTimeInSeconds) {
        const URL = `https://apis.garmin.com/wellness-api/rest/healthSnapshot?uploadStartTimeInSeconds=${uploadStartTimeInSeconds}&uploadEndTimeInSeconds=${uploadEndTimeInSeconds}`;
        const config = {
            headers: {
                "Authorization": basicAuth.getHeader(
                    'GET', URL,
                    {
                        oauth_token: oauthToken,
                        oauth_token_secret: oauthTokenSecret
                    },
                    {
                        uploadStartTimeInSeconds: uploadStartTimeInSeconds,
                        uploadEndTimeInSeconds: uploadEndTimeInSeconds
                    },
                    {

                    }
                ),
            }
        };
        const data = {};
        return axios.get(URL, config)
            .then(({data: res_data}) => {
                return res_data;
            });
    }
}