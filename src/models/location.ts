/**
 * Copyright 2024 Nokia
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


interface CivicAddress {
    country?: string;
    a1?: string;
    a2?: string;
    a3?: string;
    a4?: string;
    a5?: string;
    a6?: string;
}
  
  
interface Location {
    /**
     * A class representing the `Location` model.
     *
     * @param longitude - The `longitude` of a location object.
     * @param latitude - The `latitude` of a location object.
     * @param civicAddress - The `civic_address` of a location object (optional).
     */
    longitude: number;
    latitude: number;
    civicAddress?: CivicAddress;
}
  
export {
    Location,
    CivicAddress
}
