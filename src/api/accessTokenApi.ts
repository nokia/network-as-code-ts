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

import { errorHandler } from "../errors";
import { ProxyAgent } from "proxy-agent";

import fetch from "node-fetch";

export class AccessTokenAPI {
    private agent: ProxyAgent;
    private headers: HeadersInit;

    constructor(
        agent: ProxyAgent
    ) {
        this.agent = agent;
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
    }

    async fetchToken(data: any, tokenEndpoint: any): Promise<any>{
        const response = await fetch(tokenEndpoint, {
            method: "POST",
            body: data, 
            headers: this.headers,
            agent: this.agent
        });
        errorHandler(response);
        return await response.json();
    }

}
