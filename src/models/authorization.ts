/**
 * Copyright 2025 Nokia
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 *  A class representing the `Credentials` model.
    #### Public Attributes:
       @param clientId (string): String ID of the client.
       @param clientSecret (string): String secret of the client.
 */
export class Credentials {
    clientId: string;
    clientSecret: string;

    constructor(
        clientId: string, 
        clientSecret: string
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;    
    }
}

/**
 *  A class representing the `Endpoints` model.
    #### Public Attributes:
       @param fastFlowCspAuthEndpoint (string): Fast flow endpoint from where end user can get authenticated and can get the authorization code.
 */
export class Endpoints {
    fastFlowCspAuthEndpoint: string;

    constructor(
        fastFlowCspAuthEndpoint: string
    ) {
        this.fastFlowCspAuthEndpoint = fastFlowCspAuthEndpoint;    
    }
}

/**
 *  A class representing the `PlainCredential` model.
    #### Public Attributes:
       @param credentialType (string): The type of the credential. "PLAIN".
       @param identifier (string): Possibly an account or username.
       @param secret (string): Possibly a password or passphrase.
 */
export interface PlainCredential {
    credentialType: "PLAIN",
    identifier: string,
    secret: string

}

/**
 *  A class representing the `AccessTokenCredential` model.
    #### Public Attributes:
       @param credentialType (string): The type of the credential. "ACCESSTOKEN"
       @param accessToken (string): Previously obtained token.
       @param accessTokenType (string): Type of the access token, for example 'bearer'.
       @param accessTokenExpiresUtc (Date | string): When the access token expires.
 */
export interface AccessTokenCredential {
    credentialType: "ACCESSTOKEN",
    accessToken: string,
    accessTokenType?: string,
    accessTokenExpiresUtc: Date | string
}
