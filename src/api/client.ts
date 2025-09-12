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
import { CallForwardingApi } from "./callForwardingApi";
import { KnowYourCustomerAPI } from "./knowYourCustomerApi";

const QOS_URL = "/qod/v0";

const LOCATION_RETRIEVAL_URL = "/location-retrieval/v0";

const LOCATION_VERIFY_URL = "/location-verification/v1";

const DEVICE_STATUS_URL = "/device-status/v0";

const SLICE_URL = "/slice/v1";

const SLICE_ATTACH_URL = "/device-attach/v0";

const CONGESTION_INSIGHTS_URL = "/congestion-insights/v0";

const SIM_SWAP_URL = "/passthrough/camara/v1/sim-swap/sim-swap/v0";

const GEOFENCING_URL = "/geofencing-subscriptions/v0.3";

const CREDENTIALS_URL = "/oauth2/v1";

const AUTHORIZATION_ENDPOINTS_URL = "/.well-known";

const NUMBER_VERIFICATION_URL =  "/passthrough/camara/v1/number-verification/number-verification/v0";

const CALL_FORWARDING_URL = "/passthrough/camara/v1/call-forwarding-signal/call-forwarding-signal/v0.3"

const KNOW_YOUR_CUSTOMER_URL = "/passthrough/camara/v1/kyc-match/v0.3"

const agent = new ProxyAgent();

/*
 * Return the environment hostname based on given environment mode
 */
const environmentHostname = (envMode: string | undefined): string => {
  if (envMode === "dev") {
    return "network-as-code1.nokia-dev.rapidapi.com"
  }

  if (envMode === "staging") {
    return "network-as-code.nokia-stage.rapidapi.com"
  }

  return "network-as-code.nokia.rapidapi.com"
};

const environmentBaseUrl = (envMode: string | undefined) => {
  if (envMode === "dev") {
    return "https://network-as-code1.p-eu.rapidapi.com";
  }

  if (envMode === "staging") {
    return "https://network-as-code.p-eu.rapidapi.com";
  }

  return "https://network-as-code.p-eu.rapidapi.com";
};

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
    callForwarding: CallForwardingApi;
    knowYourCustomer: KnowYourCustomerAPI;

    constructor(
        token: string,
        envMode: string | undefined = undefined,
        qosBaseUrl: string | undefined = undefined,
        locationRetrievalBaseUrl: string | undefined = undefined,
        locationVerifyBaseUrl: string | undefined = undefined,
        deviceStatusBaseUrl: string | undefined = undefined,
        sliceBaseUrl: string | undefined = undefined,
        sliceAttachBaseUrl: string | undefined = undefined,
        congestionInsightsBaseUrl: string | undefined = undefined,
        simSwapBaseUrl: string | undefined = undefined,
        geofencingBaseUrl: string | undefined = undefined,
        authorizationEndpointsBaseUrl: string | undefined = undefined,
        credentialsBaseUrl: string | undefined = undefined,
        verificationBaseUrl: string | undefined = undefined,
        callForwardingBaseUrl: string | undefined = undefined,
        knowYourCustomerBaseUrl: string | undefined = undefined
    ) {
      const baseUrl = environmentBaseUrl(envMode);
      const hostname = environmentHostname(envMode);

      if (!qosBaseUrl) {
        qosBaseUrl = `${baseUrl}${QOS_URL}`
      }
      this.sessions = new QodAPI(
        qosBaseUrl,
        token,
        hostname,
        agent
      );

      if (!locationRetrievalBaseUrl) {
        locationRetrievalBaseUrl = `${baseUrl}${LOCATION_RETRIEVAL_URL}`
      }
      this.locationRetrieval = new LocationRetrievalAPI(
        locationRetrievalBaseUrl,
        token,
        hostname,
        agent
      );

      if (!locationVerifyBaseUrl) {
        locationVerifyBaseUrl = `${baseUrl}${LOCATION_VERIFY_URL}`
      }

      this.locationVerify = new LocationVerifyAPI(
        locationVerifyBaseUrl,
        token,
        hostname,
        agent
      );

      if (!deviceStatusBaseUrl) {
        deviceStatusBaseUrl = `${baseUrl}${DEVICE_STATUS_URL}`
      }

      this.deviceStatus = new DeviceStatusAPI(
        deviceStatusBaseUrl,
        token,
        hostname,
        agent
      );

      if (!sliceBaseUrl) {
        sliceBaseUrl = `${baseUrl}${SLICE_URL}`
      }

      this.slicing = new SliceAPI(
        sliceBaseUrl,
        token,
        hostname,
        agent
      );

      if (!sliceAttachBaseUrl) {
        sliceAttachBaseUrl = `${baseUrl}${SLICE_ATTACH_URL}`
      }

      this.sliceAttach = new AttachAPI(
        sliceAttachBaseUrl,
        token,
        hostname,
        agent
      );

      if (!congestionInsightsBaseUrl) {
        congestionInsightsBaseUrl = `${baseUrl}${CONGESTION_INSIGHTS_URL}`
      }

      this.insights = new CongestionInsightsAPI(
        congestionInsightsBaseUrl,
        token,
        hostname,
        agent
      );

      if (!simSwapBaseUrl) {
        simSwapBaseUrl = `${baseUrl}${SIM_SWAP_URL}`
      }

      this.simSwap = new SimSwapAPI(
        simSwapBaseUrl,
        token,
        hostname,
        agent
      );

      if (!geofencingBaseUrl) {
        geofencingBaseUrl = `${baseUrl}${GEOFENCING_URL}`
      }

      this.geofencing = new GeofencingAPI(
        geofencingBaseUrl,
        token,
        hostname,
        agent
      );

      if (!authorizationEndpointsBaseUrl) {
        authorizationEndpointsBaseUrl = `${baseUrl}${AUTHORIZATION_ENDPOINTS_URL}`
      }

      this.authorizationEndpoints = new AuthorizationEndpointsAPI(
        authorizationEndpointsBaseUrl,
        token,
        hostname,
        agent
      );

      if (!credentialsBaseUrl) {
        credentialsBaseUrl = `${baseUrl}${CREDENTIALS_URL}`
      }

      this.credentials = new CredentialsAPI(
        credentialsBaseUrl,
        token,
        hostname,
        agent
      );

      if (!verificationBaseUrl) {
        verificationBaseUrl = `${baseUrl}${NUMBER_VERIFICATION_URL}`
      }

      this.verification = new NumberVerificationAPI(
        verificationBaseUrl,
        token,
        hostname,
        agent
      );

      this.accesstoken = new AccessTokenAPI(
        agent
      );

      if (!callForwardingBaseUrl) {
        callForwardingBaseUrl = `${baseUrl}${CALL_FORWARDING_URL}`
      }

      this.callForwarding = new CallForwardingApi(
        callForwardingBaseUrl,
        token,
        hostname,
        agent
      );

      if (!knowYourCustomerBaseUrl) {
        knowYourCustomerBaseUrl = `${baseUrl}${KNOW_YOUR_CUSTOMER_URL}`
      }

      this.knowYourCustomer = new KnowYourCustomerAPI(
        knowYourCustomerBaseUrl,
        token,
        hostname,
        agent
      );
    }
}
