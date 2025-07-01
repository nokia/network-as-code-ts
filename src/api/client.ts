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

import { ProxyAgent } from "proxy-agent";

import { QodAPI } from "./qodApi";
import { LocationRetrievalAPI, LocationVerifyAPI } from "./locationApi";
import { DeviceStatusAPI } from "./deviceStatusAPI";
import { AttachAPI, SliceAPI } from "./sliceApi";
import { CongestionInsightsAPI } from "./congestionInsightsApi";
import { SimSwapAPI } from "./simSwapApi";
import { GeofencingAPI } from "./geofencing";
import { AuthorizationEndpointsAPI } from "./authorizatioEndpointsApi";
import { CredentialsAPI } from "./credentialsApi";
import { NumberVerificationAPI } from "./numberVerificationApi";
import { AccessTokenAPI } from "./accessTokenApi";

const QOS_BASE_URL_PROD =
    "https://network-as-code.p-eu.rapidapi.com/qod/v0";

const LOCATION_RETRIEVAL_BASE_URL_PROD =
    "https://network-as-code.p-eu.rapidapi.com/location-retrieval/v0";

const LOCATION_VERIFY_BASE_URL_PROD =
    "https://network-as-code.p-eu.rapidapi.com/location-verification/v1";

const DEVICE_STATUS_BASE_URL_PROD =
    "https://network-as-code.p-eu.rapidapi.com/device-status/v0";

const SLICE_BASE_URL_PROD =
    "https://network-as-code.p-eu.rapidapi.com/slice/v1";

const SLICE_ATTACH_BASE_URL_PROD =
    "https://network-as-code.p-eu.rapidapi.com/device-attach/v0";

const CONGESTION_INSIGHTS_BASE_URL_PROD =
    "https://network-as-code.p-eu.rapidapi.com/congestion-insights/v0";

const SIM_SWAP_BASE_URL_PROD =
    "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/sim-swap/sim-swap/v0";

const GEOFENCING_BASE_URL_PROD =
    "https://network-as-code.p-eu.rapidapi.com/geofencing-subscriptions/v0.3";

const CREDENTIALS_BASE_URL = 
    "https://nac-authorization-server.p-eu.rapidapi.com";
const CREDENTIALS_BASE_URL_PROD = 
    "https://nac-authorization-server.p-eu.rapidapi.com";

const AUTHORIZATION_ENDPOINTS_BASE_URL = 
    "https://well-known-metadata.p-eu.rapidapi.com";
const AUTHORIZATION_ENDPOINTS_BASE_URL_PROD =
    "https://well-known-metadata.p-eu.rapidapi.com";

const NUMBER_VERIFICATION_BASE_URL_PROD = 
    "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/number-verification/number-verification/v0";

const RAPID_HOST_PROD = "network-as-code.nokia.rapidapi.com"

const agent = new ProxyAgent();

export class APIClient {
    sessions: QodAPI;
    locationRetrieval: LocationRetrievalAPI;
    locationVerify: LocationVerifyAPI;
    deviceStatus: DeviceStatusAPI;
    slicing: SliceAPI;
    sliceAttach: AttachAPI;
    insights: CongestionInsightsAPI;
    simSwap: SimSwapAPI;
    geofencing: GeofencingAPI;
    authorizationEndpoints: AuthorizationEndpointsAPI;
    credentials: CredentialsAPI;
    verification: NumberVerificationAPI;
    accesstoken: AccessTokenAPI;

    constructor(
        token: string,
        devMode: boolean = false,
        rapidHostProd: string = RAPID_HOST_PROD,
        qosBaseUrl: string = QOS_BASE_URL_PROD,
        locationRetrievalBaseUrl: string = LOCATION_RETRIEVAL_BASE_URL_PROD,
        locationVerifyBaseUrl: string = LOCATION_VERIFY_BASE_URL_PROD,
        deviceStatusBaseUrl: string = DEVICE_STATUS_BASE_URL_PROD,
        sliceBaseUrl: string = SLICE_BASE_URL_PROD,
        sliceAttachBaseUrl: string = SLICE_ATTACH_BASE_URL_PROD,
        congestionInsightsBaseUrl: string = CONGESTION_INSIGHTS_BASE_URL_PROD,
        simSwapBaseUrl: string = SIM_SWAP_BASE_URL_PROD,
        geofencingBaseUrl: string = GEOFENCING_BASE_URL_PROD,
        authorizationEndpointsBaseUrl: string = AUTHORIZATION_ENDPOINTS_BASE_URL_PROD,
        credentialsBaseUrl: string = CREDENTIALS_BASE_URL_PROD,
        verificationBaseUrl: string = NUMBER_VERIFICATION_BASE_URL_PROD
    ) {
        if (devMode && qosBaseUrl == QOS_BASE_URL_PROD) {
            qosBaseUrl = qosBaseUrl.replace(".p-eu", "1.p-eu");
        }
        this.sessions = new QodAPI(
            qosBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        if (
            devMode &&
            locationRetrievalBaseUrl == LOCATION_RETRIEVAL_BASE_URL_PROD
        ) {
            locationRetrievalBaseUrl = locationRetrievalBaseUrl.replace(".p-eu", "1.p-eu");
        }

        this.locationRetrieval = new LocationRetrievalAPI(
            locationRetrievalBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        if (devMode && locationVerifyBaseUrl == LOCATION_VERIFY_BASE_URL_PROD) {
            locationVerifyBaseUrl = locationVerifyBaseUrl.replace(".p-eu", "1.p-eu");
        }

        this.locationVerify = new LocationVerifyAPI(
            locationVerifyBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        if (devMode && deviceStatusBaseUrl == DEVICE_STATUS_BASE_URL_PROD) {
            deviceStatusBaseUrl = deviceStatusBaseUrl.replace(".p-eu", "1.p-eu");
        }

        this.deviceStatus = new DeviceStatusAPI(
            deviceStatusBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        if (devMode && sliceBaseUrl == SLICE_BASE_URL_PROD) {
            sliceBaseUrl = sliceBaseUrl.replace(".p-eu", "1.p-eu");
        }

        this.slicing = new SliceAPI(
            sliceBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        if (devMode && sliceAttachBaseUrl == SLICE_ATTACH_BASE_URL_PROD) {
            sliceAttachBaseUrl = sliceAttachBaseUrl.replace(".p-eu", "1.p-eu");
        }

        this.sliceAttach = new AttachAPI(
            sliceAttachBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        if (devMode && congestionInsightsBaseUrl == CONGESTION_INSIGHTS_BASE_URL_PROD) {
            congestionInsightsBaseUrl = congestionInsightsBaseUrl.replace(".p-eu", "1.p-eu");
        }

        this.insights = new CongestionInsightsAPI(
            congestionInsightsBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        if (devMode && simSwapBaseUrl == SIM_SWAP_BASE_URL_PROD) {
            simSwapBaseUrl = simSwapBaseUrl.replace(".p-eu", "1.p-eu");
        }

        this.simSwap = new SimSwapAPI(
            simSwapBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        if (devMode && geofencingBaseUrl == GEOFENCING_BASE_URL_PROD) {
            geofencingBaseUrl = geofencingBaseUrl.replace(".p-eu", "1.p-eu");
        }

        this.geofencing = new GeofencingAPI(
            geofencingBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        if (devMode && authorizationEndpointsBaseUrl == AUTHORIZATION_ENDPOINTS_BASE_URL_PROD) {
            authorizationEndpointsBaseUrl = AUTHORIZATION_ENDPOINTS_BASE_URL;
        }

        this.authorizationEndpoints = new AuthorizationEndpointsAPI(
            authorizationEndpointsBaseUrl,
            token,
            devMode
                ? authorizationEndpointsBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : authorizationEndpointsBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
            agent
        );

        if (devMode && credentialsBaseUrl == CREDENTIALS_BASE_URL_PROD) {
            credentialsBaseUrl = CREDENTIALS_BASE_URL;
        }

        this.credentials = new CredentialsAPI(
            credentialsBaseUrl,
            token,
            devMode
                ? credentialsBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : credentialsBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
            agent
        );

        if (devMode && verificationBaseUrl == NUMBER_VERIFICATION_BASE_URL_PROD) {
            verificationBaseUrl = verificationBaseUrl.replace(".p-eu", "1.p-eu");
        }

        this.verification = new NumberVerificationAPI(
            verificationBaseUrl,
            token,
            devMode
                ? rapidHostProd.replace(".nokia", "1.nokia-dev")
                : rapidHostProd,
            agent
        );

        this.accesstoken = new AccessTokenAPI(
            agent
        );
    }
}
