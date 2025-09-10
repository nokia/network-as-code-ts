import express, { Express, Request, Response } from "express";
import { NetworkAsCodeClient } from "network-as-code";


// Initialize the client object with your application key
const client = new NetworkAsCodeClient("<your-application-key-here>");


// Then, create a device object for the phone number you want to check */
const device = client.devices.get({
    // The phone number accepts the "+" sign, but not spaces or "()" marks
    phoneNumber: "+3637123456"
});


/* This authorization_endpoint should be requested by the end user device and not in the backend
 of your application, since the requesting device is used to determine authorization 
 for the particular device. You could, for example,
 handle this by presenting the user with a link or a button to click to initiate the redirect flow.
 You must provide a redirectUri, where the authorization code will be delivered.
 See the express example provided below.

 You can add a state value of your choosing to test for CSRF attacks. Your application then should check, 
 that the state value given to the authorization endpoint matches the one returned to the redirect uri.
 If the state values do not match, there has likely been a CSRF attack. In this case your application
 should return a 401 Unauthorized error code. */

const redirectUri = "https://my-example/redirect";
const scope = "number-verification:verify";
const loginHint = device.phoneNumber;
const state = "foobar";

// create a callbacklink
const callback = await client.authentication.createAuthenticationLink(
    redirectUri,
    scope,
    loginHint,
    state
);

// you can alternatively create a callbacklink using the fast flow functionality
const fastFlowCallback = await client.authentication.createFastFlowAuthenticationLink(
    redirectUri,
    scope,
    loginHint,
    state
);


// Example of a redirectUri to use to receive the authorization code from the authorization endpoint
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/redirect", (req: Request, res: Response) => {
    res.send(`This is your authorization code: ${req.query.code}`)

    res.status(200).end();
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});


// Add your authorization code here.
const code = "NaC-authorization-code";


/* You can use the Number Verification API with the obtained authorization code.
 The verifyNumber endpoint will respond with a true or false value. */
const verificationResult = await device.verifyNumber(code);
console.log(verificationResult);


/* If you used fast flow to get the code, you need to add the state to the 
verifyNumber method call as a parameter. */
const verificationResultWithFastFlow = await device.verifyNumber(code, state);
console.log(verificationResultWithFastFlow);


// The getPhoneNumber endpoint will respond with the phone number of the used Device.
const phoneNumber = await device.getPhoneNumber(code);
console.log(phoneNumber) // "+123456789"

/* If you used fast flow to get the code, you need to add the state to the 
getPhoneNumber method call as a parameter. */
const phoneNumberWithFastFlow = await device.getPhoneNumber(code, state);
console.log(phoneNumberWithFastFlow);