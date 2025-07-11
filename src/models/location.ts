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

interface VerificationResult {

      /**
     * A class representing the `Location verification result` model.
     *
     * @param resultType - The `result_type` of a location verification result object.
     * @param matchRate - The `matchRate`, in case of result_type is partial, of a location verification result object (optional).
     * @param LastLocationTime - The `last_location_time` of a location verification result object (optional).
     */
      resultType: string;
      matchRate?: number;
      lastLocationTime?: Date;
  }


interface Location {
    /**
     * A class representing the `Location` model.
     *
     * @param longitude - The `longitude` of a location object.
     * @param latitude - The `latitude` of a location object.
     * @param radius - The `radius` of a location object (optional).
     */
    longitude: number;
    latitude: number;
    radius?: number;
}

export { VerificationResult, Location };
