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
       @param authorizationEndpoint (string): Endpoint from where end user can get authenticated and can get the authorization code.
       @param tokenEndpoint (string): Endpoint from where can get access token.
       @param fastFlowCspAuthEndpoint (string): Fast flow endpoint from where end user can get authenticated and can get the authorization code.
 */
export class Endpoints {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    fastFlowCspAuthEndpoint: string;

    constructor(
        authorizationEndpoint: string, 
        tokenEndpoint: string,
        fastFlowCspAuthEndpoint: string
    ) {
        this.authorizationEndpoint = authorizationEndpoint;
        this.tokenEndpoint = tokenEndpoint;
        this.fastFlowCspAuthEndpoint = fastFlowCspAuthEndpoint;    
    }
}

/**
 *  A class representing the `AccessToken` model.
    #### Public Attributes:
       @param accessToken (string): Sccess token of the client.
       @param tokenType (string): The type of the access token.
       @param expiresIn (number): When the access token expires.
 */
export class AccessToken {
    accessToken: string;
    tokenType: string;
    expiresIn: number;

    constructor(
        accessToken: string, 
        tokenType: string,
        expiresIn: number

    ) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;    
    }
}
