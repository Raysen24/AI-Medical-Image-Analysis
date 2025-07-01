import { Router } from "express";
import { GarminClient } from "../GarminClient.js";

export const authRoute = Router();

authRoute.post("/request-token", (req, res) => {
    const { oauth_callback } = req.body;
    GarminClient
    .getRequestToken()
    .then(({oauth_token, oauth_token_secret}) => {
        console.log("Token has been received.")
        console.log(`Enable permissions through this site: https://connect.garmin.com/oauthConfirm?oauth_token=${oauth_token}`)
        console.log()
        return res.json({
            oauth_token: oauth_token,
            oauth_token_secret: oauth_token_secret,
            permissionUrl: `https://connect.garmin.com/oauthConfirm?oauth_token=${oauth_token}&oauth_callback=${oauth_callback}`
        })
        .send();
    })
    .catch(err => res.json(err).status(500).send());
});

authRoute.post("/user-token", (req, res) => {
    const { body } = req;
    const { oauth_token, oauth_token_secret, oauth_verifier } = body;
    GarminClient.getUserToken(oauth_token, oauth_token_secret, oauth_verifier)
    .then(({oauth_token, oauth_token_secret}) => {
        return res.json({
            oauth_token: oauth_token, 
            oauth_token_secret: oauth_token_secret
        })
        .send();
    })
    .catch(err => console.log(err));
});