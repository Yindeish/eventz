import { useState } from "react";

type tPushMessage = {
    to: string;
    title: string;
    body: string;
    data?: any;
};

const useExpoNotification = () => {
    const [sending, setSending] = useState(false)

    const sendADeviceNotification = async ({ expoPushToken, body, title }: { expoPushToken: string, title: string, body: string }) => {
        setSending(true)
        try {
            const res = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: expoPushToken,
                    title,
                    body,
                }),
            });

            const data = await res.json();
            return data;
        } catch (error) {
            setSending(false)
            throw error;
        }
        finally {
            setSending(false);
        }
    }

    const sendDevicesNotification = async ({ body, expoPushTokens, title }: { expoPushTokens: string[], title: string, body: string }) => {
        setSending(true);

        try {
            const messages: tPushMessage[] = expoPushTokens.map(token => ({
                to: token,
                title,
                body,
            }));

            const res = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messages),
            });

            const data = await res.json();
            return data;
        }
        catch (error) {
            setSending(false)
            throw error;
        }
        finally {
            setSending(false);
        }
    }

    return {
        sendADeviceNotification, sendDevicesNotification, sending
    }

}

export default useExpoNotification;