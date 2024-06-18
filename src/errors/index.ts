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

import { Response as FetchResponse } from "node-fetch";

/**
 *Network as Code base exception.
 */
class NaCError extends Error {}

/**
 *Error for when the Network as Code API returns an error message.
 */
export class APIError extends Error {}

/**
 *Error for when a connection to the SDK gateway can't be established.
 */
class GatewayConnectionError extends Error {}

/**
 *Error for when a resource can't be found from the Network as Code API.
 */
export class NotFoundError extends Error {}

/**
 *Error for when the Network as Code API cannot be reached.
 */
class APIConnectionError extends Error {}

/**
 *Error for when the API key is invalid, the user of the key is not subscribed to the API, or the API key was not supplied. (403)
 */
export class AuthenticationError extends Error {}

/**
 *Error for when the server returns an error when responding to the request. (5XX)
 */
export class ServiceError extends Error {}

/**
 *Error for when the user input parameters are invalid
 */
class InvalidParameterError extends Error {}

export function errorHandler({
    ok,
    status,
    statusText,
}: Response | FetchResponse) {
    try {
        if (!ok) {
            throw new NaCError();
        }
    } catch (error) {
        if (status === 404) {
            throw new NotFoundError(`${status} - ${statusText}`);
        } else if (status === 403 || status === 401) {
            throw new AuthenticationError(`${status} - ${statusText}`);
        } else if (status >= 400 && status < 500) {
            throw new APIError(`${status} - ${statusText}`);
        } else if (status >= 500) {
            throw new ServiceError(`${status} - ${statusText}`);
        }
    }
}
