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

import { QoDSession } from "../models/session";
import { Namespace } from "./namespace";

/**
 *  Representation of a mobile subscription.
 * 
 * Through this class many of the parameters of a
    subscription can be configured on the network.
 */
export class Sessions extends Namespace {
    /**
     *  Get a QoS Session by its ID.
     * 
     * Args:
            @param id (string): ID of the QoS Session
            @returns Promise QoDSession
    */
    async get(id: string): Promise<QoDSession> {
        const session = await this.api.sessions.getSession(id);
        return QoDSession.convertSessionModel(
            this.api,
            await session.device,
            session
        );
    }
}
