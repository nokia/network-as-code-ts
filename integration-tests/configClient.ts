
import "dotenv/config";

import { NetworkAsCodeClient } from "../src";

export const configureClient = (): NetworkAsCodeClient => {
  const nacEnv = process.env["NAC_ENV"];
    
  let NAC_TOKEN = process.env["NAC_TOKEN"];

  if (nacEnv === "prod") {
    NAC_TOKEN = process.env["NAC_TOKEN_PROD"];
  } else if (nacEnv === "staging") {
    NAC_TOKEN = process.env["NAC_TOKEN_STAGE"];
  }

  const client = new NetworkAsCodeClient(
    NAC_TOKEN as string,
    nacEnv ? nacEnv : "dev"
  );
  return client;
}

export const configureNotificationServerUrl = () : string => {
    const notificationUrl = `${process.env["SDK_NOTIFICATION_SERVER_URL"]}typescript`;
    return notificationUrl 
}
