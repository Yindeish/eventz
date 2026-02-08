import * as FirebaseNotifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) return null;

    const { status: existingStatus } =
        await FirebaseNotifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await FirebaseNotifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    const token = (await FirebaseNotifications.getExpoPushTokenAsync()).data;

    if (Platform.OS === 'android') {
        FirebaseNotifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: FirebaseNotifications.AndroidImportance.MAX,
        });
    }

    return token;
}

// For reminders, alarms (within the same device)
const scheduleNotify = ({ body, title, repeat = false, seconds = 5, date = null }: { title: string, body: string, seconds?: number, repeat?: boolean, date?: Date | null }) => {
    FirebaseNotifications.scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger: !date ? {
            type: FirebaseNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds,
            repeats: repeat,
        } : {
            type: FirebaseNotifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(Date.now() + 5000),
        },
    });
}
// For reminders, alarms (within the same device)


export const Notifications = {
    registerForPushNotificationsAsync, scheduleNotify,
}