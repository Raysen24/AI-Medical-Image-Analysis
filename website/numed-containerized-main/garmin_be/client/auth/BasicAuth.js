import { GarminAuthUtil } from "./GarminAuthUtil.js";
import oauthSignature from "oauth-signature";
const { SignatureBaseString, HmacSha1Signature, Rfc3986 } = oauthSignature;
class BasicAuth { // Basic Auth Resources
    constructor(consumerKey, consumerSecret, oauthSignatureMethod, oauthVersion) {

        // Mandatory fields.
        if (consumerKey) {
            this.consumerKey = consumerKey;
        } else {
            throw "consumerKey cannot be empty";
        }
        if (consumerSecret) {
            this.consumerSecret = consumerSecret;
        } else {
            throw "consumerSecret cannot be empty";
        }
        if (oauthSignatureMethod) {
            this.oauthSignatureMethod = oauthSignatureMethod;
        } else {
            throw "oautSignatureMethod cannot be empty";
        }
        if (oauthVersion) {
            this.oauthVersion = oauthVersion;
        } else {
            throw "oauthVersion cannot be empty";
        }
    }

    getSignature(requestMethod, serviceUrl, oauth_nonce, oauth_timestamp, tokens = {}, additionalParameters = {}, additionalHeader = {}) {
        const {oauth_token, oauth_token_secret} = tokens;

        var parameters = {
            oauth_consumer_key: this.consumerKey,
            oauth_signature_method: this.oauthSignatureMethod,
            oauth_nonce: oauth_nonce,
            oauth_timestamp: oauth_timestamp,
            oauth_version: this.oauthVersion,
            ...additionalParameters,
            ...additionalHeader
        };
        if (oauth_token) {
            parameters.oauth_token = oauth_token;
        }

        // Steps to create the signature:
        // 1. get base string signature
        const signatureBaseString = new SignatureBaseString(
            requestMethod, serviceUrl, parameters)
            .generate();
        // 2. run the base string through sha1
        const signatureUnencoded = new HmacSha1Signature(
            signatureBaseString,
            this.consumerSecret, 
            oauth_token_secret)
            .generate(false);
        // 3. encode the sha1 hash according to rfc3986
        const signatureEncoded = new Rfc3986()
            .encode(signatureUnencoded);
        
        return signatureEncoded;
    }

    getHeader(requestMethod, serviceUrl, tokens = {}, additionalParameters = {}, additionalHeader = {}) {
        const {oauth_token} = tokens;
        const oauth_nonce = GarminAuthUtil.generateOAuthNonce(10);
        const oauth_timestamp = GarminAuthUtil.generateOAuthTimestamp();

        // constructing basic auth header utilities
        let authHeader = ''
        + 'OAuth oauth_version="' + this.oauthVersion
        + '", oauth_consumer_key="' + this.consumerKey
        + '", oauth_timestamp="' + oauth_timestamp
        + '", oauth_nonce="' + oauth_nonce
        + '", oauth_signature_method="' + this.oauthSignatureMethod
        + '", oauth_signature="' + this.getSignature(
            requestMethod,
            serviceUrl,
            oauth_nonce,
            oauth_timestamp,
            tokens,
            additionalParameters,
            additionalHeader
        );
        
        // oauth_token will not be included in header
        // if not provided
        if (oauth_token) {
            authHeader += '", oauth_token="' + oauth_token;
        }

        // adding additional headers
        for (const [key, value] of Object.entries(additionalHeader)) {
            authHeader += `", ${key}="${value}`;
        }
        return authHeader + '"';
    }
}

const OAUTH_CONSUMER_KEY = "7b3725fa-c7e1-4f6f-a6e4-164466c0201a";
const OAUTH_CONSUMER_SECRET = "gbnUbL6ks3VnfEW0VJEki26YXbH8ToaR5AG";
const OAUTH_VERSION = "1.0";
const OAUTH_SIGNATURE_METHOD = "HMAC-SHA1"; 

const basicAuth = new BasicAuth(
    OAUTH_CONSUMER_KEY,
    OAUTH_CONSUMER_SECRET, 
    OAUTH_SIGNATURE_METHOD,
    OAUTH_VERSION, 
);

export default basicAuth;