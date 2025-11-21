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

export interface TenureCheckParams {
    phoneNumber: string,
    tenureDate: Date | string
}

export class TenureCheckResult {
    tenureDateCheck: boolean;
    contractType?: string;

    constructor(
        tenureDateCheck: boolean,
        contractType?: string,
    ) {
        this.tenureDateCheck = tenureDateCheck;
        this.contractType = contractType;
    }
    static fromJson(jsonData: any): TenureCheckResult {
            const results = new TenureCheckResult(
                jsonData.tenureDateCheck,
                jsonData.contractType
            );

        return results;
    }
}

