import { QodAPI } from './qodApi';

const QOS_BASE_URL_PROD =
	'https://quality-of-service-on-demand.p-eu.rapidapi.com';
const QOS_BASE_URL_DEV = 'https://qos-on-demand2.p-eu.rapidapi.com';

export class APIClient {
	sessions: QodAPI;
	constructor(
		token: string,
		qosBaseUrl: string = QOS_BASE_URL_PROD,
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
	}
}
