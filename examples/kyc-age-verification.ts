import { NetworkAsCodeClient } from "network-as-code";


// Initialize the client object with your application key
const client = new NetworkAsCodeClient("<your-application-key-here>");


// Add the phone number of the subscriber and the age threshold to compare to here. 
// Add optionally also the other information of the subscriber here, as well as if the
// subscription has a content lock or parental control. 
const parameters =
    {
        ageThreshold: 18,
        phoneNumber: "+99999991000",
        idDocument: "66666666q",
        name: "Federica Sanchez Arjona",
        givenName: "Federica",
        familyName: "Sanchez Arjona",
        middleNames: "Sanchez",
        familyNameAtBirth: "YYYY",
        birthdate: "1978-08-22",
        email: "federicaSanchez.Arjona@example.com",
        includeContentLock: true,
        includeParentalControl: true
    }

const customerAgeVerifyResult = await client.kyc.verifyAge(parameters);

console.log(customerAgeVerifyResult)
