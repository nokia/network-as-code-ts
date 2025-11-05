import { NetworkAsCodeClient } from "network-as-code";


// Initialize the client object with your application key
const client = new NetworkAsCodeClient("<your-application-key-here>");


// To match customer records, you must provide the customer's phone number.

// Add additional customer identity data, which is to be used in matching
// a customer against the account data bound to their phone number.
const parameters =
    {
        phoneNumber: '+99999991000',
        idDocument: "66666666q",
        name: "Federica Sanchez Arjona",
        givenName: "Federica",
        familyName: "Sanchez Arjona",
        nameKanaHankaku: "federica",
        nameKanaZenkaku: "Ｆｅｄｅｒｉｃａ",
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

const customerMatchResult = await client.kyc.matchCustomer(parameters);

console.log(customerMatchResult)
