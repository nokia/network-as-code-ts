import { QodAPI } from './qodApi';
import { LocationRetrievalAPI } from './locationApi';

const QOS_BASE_URL_PROD =
	'https://quality-of-service-on-demand.p-eu.rapidapi.com';
const QOS_BASE_URL_DEV = 'https://qos-on-demand2.p-eu.rapidapi.com';

const LOCATION_RETRIEVAL_BASE_URL_PROD = ""
const LOCATION_RETRIEVAL_BASE_URL_DEV = ""

export class APIClient {
	sessions: QodAPI;
    locationRetrieval: LocationRetrievalAPI;
	constructor(
		token: string,
		qosBaseUrl: string = QOS_BASE_URL_PROD,
        locationRetrievalBaseUrl: string = LOCATION_RETRIEVAL_BASE_URL_PROD,
		devMode: boolean = false,
	) {
		if (devMode && qosBaseUrl == QOS_BASE_URL_PROD) {
			qosBaseUrl = QOS_BASE_URL_DEV;
		}
		this.sessions = new QodAPI(
			qosBaseUrl,
			token,
			devMode
				? qosBaseUrl
					.replace('https://', '')
					.replace('p-eu', 'nokia-dev')
				: qosBaseUrl.replace('https://', '').replace('p-eu', 'nokia')
		);

		if (devMode && locationRetrievalBaseUrl == LOCATION_RETRIEVAL_BASE_URL_PROD) {
			locationRetrievalBaseUrl = LOCATION_RETRIEVAL_BASE_URL_DEV;
		}

		this.locationRetrieval = new LocationRetrievalAPI(
			locationRetrievalBaseUrl,
			token,
			devMode
				? locationRetrievalBaseUrl
					.replace('https://', '')
					.replace('p-eu', 'nokia-dev')
				: locationRetrievalBaseUrl.replace('https://', '').replace('p-eu', 'nokia')
		);
	}
}
