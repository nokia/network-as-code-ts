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

/*
export class KYCMatchResult {
    idDocumentMatch?: string;
    nameMatch?: string;
    nameMatchScore?: number;
    givenNameMatch?: string;
    givenNameMatchScore?: number;
    familyNameMatch?: string;
    familyNameMatchScore?: number;
    nameKanaHankakuMatch?: string;
    nameKanaHankakuMatchScore?: number;
    nameKanaZenkakuMatch?: string;
    nameKanaZenkakuMatchScore?: number;
    middleNamesMatch?: string;
    middleNamesMatchScore?: number;
    familyNameAtBirthMatch?: string;
    familyNameAtBirthMatchScore?: number;
    addressMatch?: string;
    addressMatchScore?: number;
    streetNameMatch?: string;
    streetNameMatchScore?: number;
    streetNumberMatch?: string;
    streetNumberMatchScore?: number;
    postalCodeMatch?: string;
    regionMatch?: string;
    regionMatchScore?: number;
    localityMatch?: string;
    localityMatchScore?: number;
    countryMatch?: string;
    houseNumberExtensionMatch?: string;
    birthdateMatch?: string;
    emailMatch?: string;
    emailMatchScore?: number;
    genderMatch?: string;

    constructor(
        idDocumentMatch: string,
        nameMatch: string,
        nameMatchScore: number,
        givenNameMatch: string,
        givenNameMatchScore: number,
        familyNameMatch: string,
        familyNameMatchScore: number,
        nameKanaHankakuMatch: string,
        nameKanaHankakuMatchScore: number,
        nameKanaZenkakuMatch: string,
        nameKanaZenkakuMatchScore: number,
        middleNamesMatch: string,
        middleNamesMatchScore: number,
        familyNameAtBirthMatch: string,
        familyNameAtBirthMatchScore: number,
        addressMatch: string,
        addressMatchScore: number,
        streetNameMatch: string,
        streetNameMatchScore: number,
        streetNumberMatch: string,
        streetNumberMatchScore: number,
        postalCodeMatch: string,
        regionMatch: string,
        regionMatchScore: number,
        localityMatch: string,
        localityMatchScore: number,
        countryMatch: string,
        houseNumberExtensionMatch: string,
        birthdateMatch: string,
        emailMatch: string,
        emailMatchScore: number,
        genderMatch: string
    ) {
        this.idDocumentMatch = idDocumentMatch;
        this.nameMatch = nameMatch;
        this.nameMatchScore = nameMatchScore;
        this.givenNameMatch = givenNameMatch;
        this.givenNameMatchScore = givenNameMatchScore;
        this.familyNameMatch = familyNameMatch;
        this.familyNameMatchScore = familyNameMatchScore;
        this.nameKanaHankakuMatch = nameKanaHankakuMatch;
        this.nameKanaHankakuMatchScore = nameKanaHankakuMatchScore;
        this.nameKanaZenkakuMatch = nameKanaZenkakuMatch;
        this.nameKanaZenkakuMatchScore = nameKanaZenkakuMatchScore;
        this.middleNamesMatch = middleNamesMatch;
        this.middleNamesMatchScore = middleNamesMatchScore;
        this.familyNameAtBirthMatch = familyNameAtBirthMatch;
        this.familyNameAtBirthMatchScore = familyNameAtBirthMatchScore;
        this.addressMatch = addressMatch;
        this.addressMatchScore = addressMatchScore;
        this.streetNameMatch = streetNameMatch;
        this.streetNameMatchScore = streetNameMatchScore;
        this.streetNumberMatch = streetNumberMatch;
        this.streetNumberMatchScore = streetNumberMatchScore;
        this.postalCodeMatch = postalCodeMatch;
        this.regionMatch = regionMatch;
        this.regionMatchScore = regionMatchScore;
        this.localityMatch = localityMatch;
        this.localityMatchScore = localityMatchScore;
        this.countryMatch = countryMatch;
        this.houseNumberExtensionMatch = houseNumberExtensionMatch;
        this.birthdateMatch = birthdateMatch;
        this.emailMatch = emailMatch;
        this.emailMatchScore = emailMatchScore;
        this.genderMatch = genderMatch;
    }


    static fromJson(jsonData: any): KYCMatchResult {
        return new KYCMatchResult(
            jsonData.idDocumentMatch,
            jsonData.nameMatch,
            jsonData.nameMatchScore,
            jsonData.givenNameMatch,
            jsonData.givenNameMatchScore,
            jsonData.familyNameMatch,
            jsonData.familyNameMatchScore,
            jsonData.nameKanaHankakuMatch,
            jsonData.nameKanaHankakuMatchScore,
            jsonData.nameKanaZenkakuMatch,
            jsonData.nameKanaZenkakuMatchScore,
            jsonData.middleNamesMatch,
            jsonData.middleNamesMatchScore,
            jsonData.familyNameAtBirthMatch,
            jsonData.familyNameAtBirthMatchScore,
            jsonData.addressMatch,
            jsonData.addressMatchScore,
            jsonData.streetNameMatch,
            jsonData.streetNameMatchScore,
            jsonData.streetNumberMatch,
            jsonData.streetNumberMatchScore,
            jsonData.postalCodeMatch,
            jsonData.regionMatch,
            jsonData.regionMatchScore,
            jsonData.localityMatch,
            jsonData.localityMatchScore,
            jsonData.countryMatch,
            jsonData.houseNumberExtensionMatch,
            jsonData.birthdateMatch,
            jsonData.emailMatch,
            jsonData.emailMatchScore,
            jsonData.genderMatch
        );
    }
}*/