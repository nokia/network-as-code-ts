import { QodAPI } from "./qodApi";
import { LocationRetrievalAPI, LocationVerifyAPI } from "./locationApi";
import { DeviceStatusAPI } from "./deviceStatusAPI";
import { AttachAPI, SliceAPI } from "./sliceApi";

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
    "https://network-slice-device-attach-norc.p-eu.rapidapi.com";
const SLICE_ATTACH_BASE_URL_DEV =
    "https://device-attach-norc1.p-eu.rapidapi.com";

export class APIClient {
    sessions: QodAPI;
    locationRetrieval: LocationRetrievalAPI;
    locationVerify: LocationVerifyAPI;
    deviceStatus: DeviceStatusAPI;
    slicing: SliceAPI;
    sliceAttach: AttachAPI;

    constructor(
        token: string,
        qosBaseUrl: string = QOS_BASE_URL_PROD,
        locationRetrievalBaseUrl: string = LOCATION_RETRIEVAL_BASE_URL_PROD,
        locationVerifyBaseUrl: string = LOCATION_VERIFY_BASE_URL_PROD,
        deviceStatusBaseUrl: string = DEVICE_STATUS_BASE_URL_PROD,
        sliceBaseUrl: string = SLICE_BASE_URL_PROD,
        sliceAttachBaseUrl: string = SLICE_ATTACH_BASE_URL_PROD,
        devMode: boolean = false
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
                : qosBaseUrl.replace("https://", "").replace("p-eu", "nokia")
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
                      .replace("p-eu", "nokia")
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
                      .replace("p-eu", "nokia")
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
                      .replace("p-eu", "nokia")
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
                : sliceBaseUrl.replace("https://", "").replace("p-eu", "nokia")
        );

        if (devMode && sliceAttachBaseUrl == SLICE_BASE_URL_PROD) {
            sliceAttachBaseUrl = SLICE_BASE_URL_DEV;
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
                      .replace("p-eu", "nokia")
        );
    }
}
