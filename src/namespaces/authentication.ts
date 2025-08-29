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

import { Endpoints, Credentials } from "../models/authentication";
import { Namespace } from "./namespace";

/**
 *  Representation of authentication.
 * 
 * Through this class many of the parameters of a
   3-legged authentication flow can be configured and managed.
 */
export class Authentication extends Namespace {
    
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
        const authorizationEndpoint = response["authorization_endpoint"];
        const tokenEndpoint = response["token_endpoint"];
        const fastFlowCspAuthEndpoint = response["fast_flow_csp_auth_endpoint"];

        const authEndpoints = new Endpoints(
            authorizationEndpoint,
            tokenEndpoint,
            fastFlowCspAuthEndpoint
        );

        return authEndpoints;
    }
 
    /**
     *  Create a authentication link for end user authentication.
     * 
            @param redirectUri (string): Callback uri where the NaC authorization code should be sent to.
            @param scope (string): Permissions that the authorization endpoint should request from the end user.
            @param loginHint (string): Device phone number.
            @param state (Optional[string]): Optional value for state, which can be used for CSRF attack checking.
            @returns Promise<string>
    */    
    async createAuthenticationLink(
        redirectUri: string,
        scope: string,
        loginHint: string,
        state?: string
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
            {name: "state", value: state},
            {name: "prompt", value: "none"}
        ];

        const filterUndefined =  params.filter(x => x.value !== undefined);
        const stringifyValueField = filterUndefined.map(({name, value})=> ({name, value:String(value)}));
        const encodedParams = stringifyValueField.map((param) => `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`).join('&');
        
        const authenticationUrl = `${endpoints.fastFlowCspAuthEndpoint}?${encodedParams}`;
        return authenticationUrl; 
    }
    
}