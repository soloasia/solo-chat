import PushNotification from "react-native-push-notification";

export const onPushPublicNotification = (data: any) => {
    PushNotification.configure({
        onNotification: function (notification: any) {
            if (notification.action === 'Clear') {
                // PushNotification.cancelAllLocalNotifications();
            }
        },
        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         */
        requestPermissions: true
    })

    PushNotification.localNotification({
        channelId: "solochat-notification",
        title: data.title,
        message: data.body
    });
}