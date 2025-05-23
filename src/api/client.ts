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
    "https://quality-of-service-on-demand.p-eu.rapidapi.com";
const QOS_BASE_URL_DEV = "https://qos-on-demand2.p-eu.rapidapi.com";

const LOCATION_RETRIEVAL_BASE_URL_PROD =
    "https://location-retrieval.p-eu.rapidapi.com";
const LOCATION_RETRIEVAL_BASE_URL_DEV =
    "https://location-retrieval3.p-eu.rapidapi.com";

const LOCATION_VERIFY_BASE_URL_PROD =
    "https://location-verification.p-eu.rapidapi.com";
const LOCATION_VERIFY_BASE_URL_DEV =
    "https://location-verification5.p-eu.rapidapi.com";

const DEVICE_STATUS_BASE_URL_PROD = "https://device-status.p-eu.rapidapi.com";
const DEVICE_STATUS_BASE_URL_DEV = "https://device-status1.p-eu.rapidapi.com";

const SLICE_BASE_URL_PROD = "https://network-slicing.p-eu.rapidapi.com";
const SLICE_BASE_URL_DEV = "https://network-slicing2.p-eu.rapidapi.com";

const SLICE_ATTACH_BASE_URL_PROD =
    "https://network-slice-device-attachment.p-eu.rapidapi.com";
const SLICE_ATTACH_BASE_URL_DEV =
    "https://device-application-attach.p-eu.rapidapi.com";

const CONGESTION_INSIGHTS_BASE_URL_PROD =
    "https://congestion-insights.p-eu.rapidapi.com";
const CONGESTION_INSIGHTS_BASE_URL_DEV =
    "https://congestion-insights.p-eu.rapidapi.com";

const SIM_SWAP_BASE_URL_PROD =
    "https://sim-swap.p-eu.rapidapi.com/sim-swap/sim-swap/v0";
const SIM_SWAP_BASE_URL_DEV =
    "https://simswap.p-eu.rapidapi.com/sim-swap/sim-swap/v0";

const GEOFENCING_BASE_URL_PROD = "https://geofencing-subscriptions.p-eu.rapidapi.com/v0.3"
const GEOFENCING_BASE_URL_DEV = "https://geofencing-subscription.p-eu.rapidapi.com/v0.3"

const CREDENTIALS_BASE_URL = 
    "https://nac-authorization-server.p-eu.rapidapi.com";
const CREDENTIALS_BASE_URL_PROD = 
    "https://nac-authorization-server.p-eu.rapidapi.com";

const AUTHORIZATION_ENDPOINTS_BASE_URL = 
    "https://well-known-metadata.p-eu.rapidapi.com";
const AUTHORIZATION_ENDPOINTS_BASE_URL_PROD =
    "https://well-known-metadata.p-eu.rapidapi.com";

const NUMBER_VERIFICATION_BASE_URL = 
    "https://number-verification.p-eu.rapidapi.com";
const NUMBER_VERIFICATION_BASE_URL_PROD = 
    "https://number-verification.p-eu.rapidapi.com";

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
            qosBaseUrl = QOS_BASE_URL_DEV;
        }
        this.sessions = new QodAPI(
            qosBaseUrl,
            token,
            devMode
                ? qosBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : qosBaseUrl.replace("https://", "").replace("p-eu", "nokia"),
            agent
        );

        if (
            devMode &&
            locationRetrievalBaseUrl == LOCATION_RETRIEVAL_BASE_URL_PROD
        ) {
            locationRetrievalBaseUrl = LOCATION_RETRIEVAL_BASE_URL_DEV;
        }

        this.locationRetrieval = new LocationRetrievalAPI(
            locationRetrievalBaseUrl,
            token,
            devMode
                ? locationRetrievalBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : locationRetrievalBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
            agent
        );

        if (devMode && locationVerifyBaseUrl == LOCATION_VERIFY_BASE_URL_PROD) {
            locationVerifyBaseUrl = LOCATION_VERIFY_BASE_URL_DEV;
        }

        this.locationVerify = new LocationVerifyAPI(
            locationVerifyBaseUrl,
            token,
            devMode
                ? locationVerifyBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : locationVerifyBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
            agent
        );

        if (devMode && deviceStatusBaseUrl == DEVICE_STATUS_BASE_URL_PROD) {
            deviceStatusBaseUrl = DEVICE_STATUS_BASE_URL_DEV;
        }

        this.deviceStatus = new DeviceStatusAPI(
            deviceStatusBaseUrl,
            token,
            devMode
                ? deviceStatusBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : deviceStatusBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
            agent
        );

        if (devMode && sliceBaseUrl == SLICE_BASE_URL_PROD) {
            sliceBaseUrl = SLICE_BASE_URL_DEV;
        }

        this.slicing = new SliceAPI(
            sliceBaseUrl,
            token,
            devMode
                ? sliceBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : sliceBaseUrl.replace("https://", "").replace("p-eu", "nokia"),
            agent
        );

        if (devMode && sliceAttachBaseUrl == SLICE_ATTACH_BASE_URL_PROD) {
            sliceAttachBaseUrl = SLICE_ATTACH_BASE_URL_DEV;
        }

        this.sliceAttach = new AttachAPI(
            sliceAttachBaseUrl,
            token,
            devMode
                ? sliceAttachBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : sliceAttachBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
            agent
        );

        if (
            devMode &&
            congestionInsightsBaseUrl == CONGESTION_INSIGHTS_BASE_URL_PROD
        ) {
            congestionInsightsBaseUrl = CONGESTION_INSIGHTS_BASE_URL_DEV;
        }

        this.insights = new CongestionInsightsAPI(
            congestionInsightsBaseUrl,
            token,
            devMode
                ? congestionInsightsBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : congestionInsightsBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
            agent
        );

        if (devMode && simSwapBaseUrl == SIM_SWAP_BASE_URL_PROD) {
            simSwapBaseUrl = SIM_SWAP_BASE_URL_DEV;
        }

        this.simSwap = new SimSwapAPI(
            simSwapBaseUrl,
            token,
            devMode
                ? simSwapBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : simSwapBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
            agent
        );

        if (devMode && geofencingBaseUrl == GEOFENCING_BASE_URL_PROD) {
            geofencingBaseUrl = GEOFENCING_BASE_URL_DEV;
        }

        this.geofencing = new GeofencingAPI(
            geofencingBaseUrl,
            token,
            devMode
                ? geofencingBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : geofencingBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
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
            verificationBaseUrl = NUMBER_VERIFICATION_BASE_URL;
        }

        this.verification = new NumberVerificationAPI(
            verificationBaseUrl,
            token,
            devMode
                ? verificationBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia-dev")
                : verificationBaseUrl
                      .replace("https://", "")
                      .replace("p-eu", "nokia"),
            agent
        );

        this.accesstoken = new AccessTokenAPI(
            agent
        );
    }
}
