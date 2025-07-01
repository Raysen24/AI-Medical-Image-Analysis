import {GarminAuthUtil} from "./auth/GarminAuthUtil.js";
import 'dotenv/config';
import Logger from "js-logger";
import oauthSignature from "oauth-signature";
const { HmacSha1Signature, Rfc3986, SignatureBaseString } = oauthSignature;

import basicAuth from "./auth/BasicAuth.js";
Logger.useDefaults();

function testHeaderGetAuthRequest() {
    const header = basicAuth.getHeader(
        'POST', 'https://connectapi.garmin.com/oauth-service/oauth/request_token',
    );
    console.log(header);
}

function testUserAccessToken() {
    const header = basicAuth.getHeader(
        'POST', 'https://connectapi.garmin.com/oauth-service/oauth/access_token',
        {
            oauth_token: "b1a92f05-7676-41f0-a00b-2730c39b0103",
            oauth_token_secret: "f98FZkXULXeVRnpxhjZq6JGRvaZjbDggLq6"
        },
        {
        },
        {
            oauth_verifier: "IKlDTi8XbL"
        }
    );
    console.log(header);
}

function testpulseOxHeader() {
    const header = basicAuth.getHeader(
        'GET', 'https://apis.garmin.com/wellness-api/rest/healthSnapshot',
        {
            oauth_token: "65b30120-d962-4d18-834a-36bfbdd5b2fb",
            oauth_token_secret: "gyjqIvtcYIT6Nf6HUlI28hDX13igidQqil4"
        }, 
        {
            uploadStartTimeInSeconds: "1659319067",
            uploadEndTimeInSeconds: "1659404067"
        },
        {
        }
    );
    console.log(header);
}

function debug() {
    // testHeaderGetAuthRequest();
    // testUserAccessToken();
    testpulseOxHeader();
}

debug();