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


export interface MatchCustomerParams {
    phoneNumber?: string,
    idDocument?: string,
    name?: string,
    givenName?: string,
    familyName?: string,
    nameKanaHankaku?: string,
    nameKanaZenkaku?: string,
    middleNames?: string,
    familyNameAtBirth?: string,
    address?: string,
    streetName?: string,
    streetNumber?: string,
    postalCode?: string,
    region?: string,
    locality?: string,
    country?: string,
    houseNumberExtension?: string,
    birthdate?: string,
    email?: string,
    gender?: string
}


export class KYCResult {
    phoneNumber?: string;
    idDocument?: string;
    name?: string;
    givenName?: string;
    familyName?: string;
    nameKanaHankaku?: string;
    nameKanaZenkaku?: string;
    middleNames?: string;
    familyNameAtBirth?: string;
    address?: string;
    streetName?: string;
    streetNumber?: string;
    postalCode?: string;
    region?: string;
    locality?: string;
    country?: string;
    houseNumberExtension?: string;
    birthdate?: string;
    email?: string;
    gender?: string;

    constructor(
        phoneNumber: string,
        idDocument: string,
        name: string,
        givenName: string,
        familyName: string,
        nameKanaHankaku: string,
        nameKanaZenkaku: string,
        middleNames: string,
        familyNameAtBirth: string,
        address: string,
        streetName: string,
        streetNumber: string,
        postalCode: string,
        region: string,
        locality: string,
        country: string,
        houseNumberExtension: string,
        birthdate: string,
        email: string,
        gender: string
    ) {
        this.phoneNumber = phoneNumber;
        this.idDocument = idDocument;
        this.name = name;
        this.givenName = givenName;
        this.familyName = familyName;
        this.nameKanaHankaku = nameKanaHankaku;
        this.nameKanaZenkaku = nameKanaZenkaku;
        this.middleNames = middleNames;
        this.familyNameAtBirth = familyNameAtBirth;
        this.address = address;
        this.streetName = streetName;
        this.streetNumber = streetNumber;
        this.postalCode = postalCode;
        this.region = region;
        this.locality = locality;
        this.country = country;
        this.houseNumberExtension = houseNumberExtension;
        this.birthdate = birthdate;
        this.email = email;
        this.gender = gender;
    }


    static fromJson(jsonData: any): KYCResult {
        return new KYCResult(
            jsonData.phoneNumber,
            jsonData.idDocument,
            jsonData.name,
            jsonData.givenName, 
            jsonData.familyName,
            jsonData.nameKanaHankaku,
            jsonData.nameKanaZenkaku,
            jsonData.middleNames,
            jsonData.familyNameAtBirth, 
            jsonData.address,
            jsonData.streetName,
            jsonData.streetNumber,
            jsonData.postalCode,
            jsonData.region, 
            jsonData.locality,
            jsonData.country,
            jsonData.houseNumberExtension,
            jsonData.birthdate, 
            jsonData.email,
            jsonData.gender
        );
    }
}