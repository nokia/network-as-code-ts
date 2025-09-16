import express, { Express, Request, Response } from "express";
import { NetworkAsCodeClient } from "network-as-code";


// Initialize the client object with your application key
const client = new NetworkAsCodeClient("<your-application-key-here>");


// Then, create a device object for the phone number you want to check */
const device = client.devices.get({
    // The phone number accepts the "+" sign, but not spaces or "()" marks
    phoneNumber: "+999999991000"
});


// You can use the matchCustomer method without and authorization code.
// In this case the device phone number is required to be provided in the parameters.


// Add the customer identity data here, which is to be used in matching
// a customer against the account data bound to their phone number.
const parameters =
    {
        phoneNumber: '+99999991000',
        idDocument: "66666666q",
        name: "Federica Sanchez Arjona",
        givenName: "Federica",
        familyName: "Sanchez Arjona",
        nameKanaHankaku: "federica",
        nameKanaZenkaku: "Frederica",
        middleNames: "Sanchez",
        familyNameAtBirth: "YYYY",
        address: "Tokyo-to Chiyoda-ku Iidabashi 3-10-10",
        streetName: "Nicolas Salmeron",
        streetNumber: "4",
        postalCode: "1028460",
        region: "Tokyo",
        locality: "ZZZZ",
        country: "JP",
        houseNumberExtension: "VVVV",
        birthdate: "1978-08-22",
        email: "abc@example.com",
        gender: "OTHER"
    }

const customerMatchResult = await device.matchCustomer(parameters);

console.log(customerMatchResult)




/* 
Alternativelly you can retrieve an authorization code and use the code in the matchCustomer method. 
In this case, no device phone number is required to be provided in the parameters.

This authorization_endpoint should be requested by the end user device and not in the backend
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
const scope = "kyc-match:match";
const loginHint = device.phoneNumber;
const state = "foobar";

// create a callbacklink
const callback = await client.authentication.createAuthenticationLink(
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

// Add the customer identity data here, which is to be used in matching
// a customer against the account data bound to their phone number.
const parametersUsingAuthCode =
    {
        idDocument: "66666666q",
        name: "Federica Sanchez Arjona",
        givenName: "Federica",
        familyName: "Sanchez Arjona",
        nameKanaHankaku: "federica",
        nameKanaZenkaku: "Frederica",
        middleNames: "Sanchez",
        familyNameAtBirth: "YYYY",
        address: "Tokyo-to Chiyoda-ku Iidabashi 3-10-10",
        streetName: "Nicolas Salmeron",
        streetNumber: "4",
        postalCode: "1028460",
        region: "Tokyo",
        locality: "ZZZZ",
        country: "JP",
        houseNumberExtension: "VVVV",
        birthdate: "1978-08-22",
        email: "abc@example.com",
        gender: "OTHER"
    }

/* You can use the KYC Match API with the obtained authorization code.
 The KYC Match endpoint will respond with the result of the matching for each requested attribute.
 Result values for each attribute can be true, false or not_available.*/
const customerMatchAuthCodeResult = await device.matchCustomer(parametersUsingAuthCode, code);

console.log(customerMatchAuthCodeResult);