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

import { Endpoints, Credentials } from "../models/authorization";
import { Namespace } from "./namespace";

/**
 *  Representation of authorization.
 * 
 * Through this class many of the parameters of a
   3-legged authorization flow can be configured and managed.
 */
export class Authorization extends Namespace {
    
    /**
     *  Get the credentials of a client.

            @returns Promise<Credentials>
    */
    async credentials(): Promise<Credentials> {
        const response: any = await this.api.credentials.fetchCredentials();
    
        const clientId = response["client_id"];
        const clientSecret = response["client_secret"];


        const credentialInfo = new Credentials(
            clientId,
            clientSecret
        );

        return credentialInfo;
    }
    
    /**
     *  Get the endpoint for end user authetication.
     *  Endpoints will return a NaC authorization code and an access token.

            @returns Promise<Endpoints>
    */
    async endpoints(): Promise<Endpoints> {
        const response: any = await this.api.authorizationEndpoints.fetchEndpoints();
        const fastFlowCspAuthEndpoint = response["fast_flow_csp_auth_endpoint"];

        const authEndpoints = new Endpoints(
            fastFlowCspAuthEndpoint
        );

        return authEndpoints;
    }
 

    /**
     *  Create a authorization link for end user authorization.
     * 
            @param redirectUri (string): Callback uri where the NaC authorization code should be sent to.
            @param scope (string): Permissions that the authorization endpoint should request from the end user.
            @param loginHint (string): Device phone number.
            @param state (string): Value for state, which can be used for CSRF attack checking.
            @returns Promise<string>
    */    
    async createAuthorizationLink(
        redirectUri: string,
        scope: string,
        loginHint: string,
        state: string
    ): Promise<string> {

        const credentialsInfo = await this.credentials();
        const endpoints = await this.endpoints();
        const responseType = "code";
        const params = [
            {name: "response_type", value: responseType},
            {name: "client_id", value: credentialsInfo.clientId},
            {name: "redirect_uri", value: redirectUri},
            {name: "scope", value: scope},
            {name: "login_hint", value: loginHint},
            {name: "state", value: state}
        ];

        const encodedParams = params.map((param) => `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`).join('&');
        const auhtorizationUrl = `${endpoints.fastFlowCspAuthEndpoint}?${encodedParams}`;
        return auhtorizationUrl;
    }
}