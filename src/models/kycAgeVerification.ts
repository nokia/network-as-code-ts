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


export interface VerifyAgeParams {
    ageThreshold: number,
    phoneNumber: string,
    idDocument?: string,
    name?: string,
    givenName?: string,
    familyName?: string,
    middleNames?: string,
    familyNameAtBirth?: string,
    birthdate?: string,
    email?: string,
    includeContentLock?: boolean,
    includeParentalControl?: boolean
}

export class KYCVerifyAgeResult {
    ageCheck: string;
    verifiedStatus?: boolean | string | null;
    identityMatchScore?: number;
    contentLock?: string;
    parentalControl?: string;

    constructor(
        ageCheck: string,
        verifiedStatus: boolean | string | null,
        identityMatchScore: number,
        contentLock: string,
        parentalControl: string
    ) {
        this.ageCheck = ageCheck;
        this.verifiedStatus = verifiedStatus;
        this.identityMatchScore = identityMatchScore;
        this.contentLock = contentLock;
        this.parentalControl = parentalControl;
    }


    static fromJson(jsonData: any): KYCVerifyAgeResult {
        const results = new KYCVerifyAgeResult(
            jsonData.ageCheck,
            jsonData.verifiedStatus,
            jsonData.identityMatchScore,
            jsonData.contentLock,
            jsonData.parentalControl
        );

        return results;
    }
}
