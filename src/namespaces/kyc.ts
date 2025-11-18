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

import { Namespace } from "./namespace";
import { MatchCustomerParams } from "../models/kycMatch";
import { VerifyAgeParams } from "../models/kycAgeVerification";
import { TenureCheckParams, TenureCheckResult } from "../models/kycTenure";

export class KYC extends Namespace {

    /**
     * Match a customer identity against the account data bound to their phone number.
     * @param params (MatchCustomerParams): A customers data that will be compared to data bound to their phone number in the operator systems.
     * @returns Promise<any>: Contains the result of matching the provided parameter values to the data in the operator system.
     */
    async matchCustomer(params: MatchCustomerParams): Promise<any> {
        const response: any = await this.api.kycMatch.matchCustomer(
            params
        );

        return this.__parseStringParams(response);
    }

    /**
     * Check if the user of the line is older than a provided age.
     * @param params (VerifyAgeParams): Contains age threshold which to compare user age to, subscription phone number and other optional subscriber info.
     * @returns Promise<any>: true/false/null for if the age of the user is the same or older than the age threshold provided. Also results for other optional request params. 
     */   
    async verifyAge(params: VerifyAgeParams): Promise<any> {
        const response: any = await this.api.kycAgeVerification.verifyAge(
            params
        );

        return this.__parseStringParams(response);
    }

    /**
     * Check if the network subscriber has been a customer of the service provider for the specified amount of time.
     * @param phoneNumber (string): Used as an identifier for the request.
     * @param tenureDate (string | Date): The specified minimum tenure date from which the continuous tenure is to be confirmed.
     * @returns Promise<TenureCheckResult>: Object containing boolean value for the tenure date check and optional contract type, if known.           
     */   
    async checkTenure(params: TenureCheckParams): Promise<TenureCheckResult> {
        const response: any = await this.api.kycTenure.checkTenure(
            params
        );

        return await response;
    }

    /**
     * Request user information against the account data bound to their phone number
     * @param phoneNumber (string): Used as an identifier for the request.
     * @returns Promise<any>: Contains the user information available on file by the user's Operator KYC records. 
     */
    async requestCustomerInfo(phoneNumber: string): Promise<any> {
        const response: any = await this.api.kycFillIn.requestCustomerInfo(
            phoneNumber
        );

        return await response;
    }
    

    __parseStringParams(params: any){
        const response = Object.fromEntries(Object.entries(params as any).map(([key, value]) => 
            [
                key,
                value === "true" ? true:
                value === "false" ? false:
                value === "undefined" || value === "not_available" ? null
                :value
            ]
        )); return response;
    }

};
