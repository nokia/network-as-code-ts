
const QOS_BASE_URL_PROD = "https://quality-of-service-on-demand.p-eu.rapidapi.com"
const QOS_BASE_URL_DEV = "https://qos-on-demand2.p-eu.rapidapi.com"

export class APIClient {
	constructor(token: string, qos_base_url: string = QOS_BASE_URL_PROD, dev_mode: boolean = false, ...args: any[]) {
        if(dev_mode && qos_base_url == QOS_BASE_URL_PROD){
            qos_base_url = QOS_BASE_URL_DEV
        }
    }
}