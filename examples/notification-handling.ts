// Notification handling for multiple NaC functionalities:

import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json())

// QoD notification handling
interface QodNotification {
    event: {
        eventType: string,
        eventTime: string,
        eventDetail: {
            sessionId: string,
            qosStatus: string,
            statusInfo: string
        }
    }
}

app.post("/qod", (req: Request, res: Response) => {
    const notification: QodNotification = req.body;

    // We can now use the notification object to react to changes

    res.status(200).end();
});

// Slice network notifications
interface SliceNotification {
    resource: string,
    action: string,
    outcome: string,
    current_slice_state: string
}

app.post("/slice", (req: Request, res: Response) => {
    const notification: SliceNotification = req.body;

    // We can now use the notification object to react to changes

    res.status(200).end();
});

// Device status notifications
interface DeviceStatusNotification {
    eventSubscriptionId: string,
    event: {
        eventType: string,
        eventTime: string,
        eventDetail: {
            device: {
                phoneNumber?: string,
                networkAccessIdentifier?: string,
                ipv4Address?: {
                    publicAddress: string,
                    privateAddress?: string,
                    publicPort?: string
                },
                ipv6Address?: string
            },
            deviceStatus?: string,
            roaming?: boolean,
            countryCode?: number,
            countryName?: [string],
            terminationReason?: string
        }
    }
}

app.post("/device-status", (req: Request, res: Response) => {
    const notification: DeviceStatusNotification = req.body;

    // We can now use the notification object to react to changes

    res.status(200).end();
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
