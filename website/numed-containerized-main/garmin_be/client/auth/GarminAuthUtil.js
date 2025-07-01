export class GarminAuthUtil {

    static generateOAuthTimestamp() {
        return Math.floor(new Date().getTime() / 1000); 
    }

    static generateOAuthNonce(length) {
        var nonce = "";
        var range = "0123456789";
        for(var i = 0; i < length; i++)
        {
            nonce += range.charAt(Math.floor(Math.random() * range.length));
        }
        return nonce;
    }
}

