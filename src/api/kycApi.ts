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
import { MatchCustomerParams, KYCMatchResult } from "../models/kycMatch";
import { VerifyAgeParams, KYCVerifyAgeResult } from "../models/kycAgeVerification";
import { KYCFillInResult } from "../models/kycFillIn";

import fetch from "node-fetch";
import { TenureCheckParams, TenureCheckResult } from "../models/kycTenure";

class KYCMatchAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    constructor(
        baseUrl: string,
        rapidKey: string,
        rapidHost: string,
        agent: ProxyAgent
    ) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey, 
        };
        this.agent = agent;
    }

    async matchCustomer(params: MatchCustomerParams): Promise<KYCMatchResult>{
        const bodyParams = Object.fromEntries(Object.entries(params as {[key:string]: any}).filter(([, value]) => value !== null && value !== undefined));
        const response = await fetch(`${this.baseUrl}/match`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(bodyParams),
            agent: this.agent,
        });

        errorHandler(response);

        return KYCMatchResult.fromJson(await response.json());
    }
}

class KYCAgeVerificationAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    constructor(
        baseUrl: string,
        rapidKey: string,
        rapidHost: string,
        agent: ProxyAgent
    ) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey, 
        };
        this.agent = agent;
    }

    async verifyAge(params: VerifyAgeParams): Promise<KYCVerifyAgeResult>{
        const bodyParams = Object.fromEntries(Object.entries(params as {[key:string]: any}).filter(([, value]) => value !== null && value !== undefined));
        const response = await fetch(`${this.baseUrl}/verify`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(bodyParams),
            agent: this.agent,
        });

        errorHandler(response);

        return KYCVerifyAgeResult.fromJson(await response.json());
    }
}

class KYCFillInAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    constructor(
        baseUrl: string,
        rapidKey: string,
        rapidHost: string,
        agent: ProxyAgent
    ) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey, 
        };
        this.agent = agent;
    }

    async requestCustomerInfo(phoneNumber: string): Promise<KYCFillInResult> {
        const body: any = {
            "phoneNumber": phoneNumber
        }

        const response = await fetch(`${this.baseUrl}/fill-in`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
            agent: this.agent,
        });

        errorHandler(response);
        return KYCFillInResult.fromJson(await response.json());
    }
}

class KYCTenureAPI {
    private baseUrl: string;
    private headers: HeadersInit;
    private agent: ProxyAgent;

    constructor(
        baseUrl: string,
        rapidKey: string,
        rapidHost: string,
        agent: ProxyAgent
    ) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": rapidHost,
            "X-RapidAPI-Key": rapidKey, 
        };
        this.agent = agent;
    }

    async checkTenure(params: TenureCheckParams): Promise <TenureCheckResult> {
        const body: any = {
            phoneNumber: params.phoneNumber,
        }

        body.tenureDate = params.tenureDate instanceof Date ? 
            body.tenureDate = params.tenureDate.toISOString().split('T')[0] :
            params.tenureDate

        const response = await fetch(`${this.baseUrl}/check-tenure`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
            agent: this.agent,
        });

        errorHandler(response)
        
        return TenureCheckResult.fromJson(await response.json())
    }
}

export {KYCMatchAPI, KYCAgeVerificationAPI, KYCFillInAPI, KYCTenureAPI};
