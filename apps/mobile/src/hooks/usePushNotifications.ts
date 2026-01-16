import { useState, useEffect, useCallback } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface PushNotificationToken {
  token: string;
  platform: "ios" | "android" | "web";
}

export interface NotificationSettings {
  enabled: boolean;
  conversions: boolean;
  updates: boolean;
  marketing: boolean;
  sounds: boolean;
  vibrations: boolean;
}

export function usePushNotifications() {
  const [notificationPermission, setNotificationPermission] =
    useState<boolean>(false);
  const [notificationToken, setNotificationToken] =
    useState<PushNotificationToken | null>(null);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      enabled: true,
      conversions: true,
      updates: true,
      marketing: false,
      sounds: true,
      vibrations: true,
    });

  useEffect(() => {
    if (Platform.OS === "web") {
      if ("Notification" in window) {
        setNotificationPermission(Notification.permission === "granted");
      }
      return;
    }

    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = useCallback(async () => {
    if (!Device.isDevice) {
      console.log("Push notifications require a physical device");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission denied");
      return;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID,
      });

      setNotificationToken({
        token: tokenData.data,
        platform: Platform.OS as "ios" | "android",
      });

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#2563eb",
        });

        Notifications.setNotificationChannelAsync("conversions", {
          name: "Conversions",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        });

        Notifications.setNotificationChannelAsync("updates", {
          name: "Updates",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    } catch (error) {
      console.error("Failed to get push token:", error);
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (Platform.OS === "web") {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission === "granted");
        return permission === "granted";
      }
      return false;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === "granted";
    setNotificationPermission(granted);
    return granted;
  }, []);

  const updateSettings = useCallback(
    async (settings: Partial<NotificationSettings>) => {
      const newSettings = { ...notificationSettings, ...settings };
      setNotificationSettings(newSettings);

      try {
        await fetch("/api/notifications/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSettings),
        });
      } catch (error) {
        console.error("Failed to save notification settings:", error);
      }
    },
    [notificationSettings],
  );

  const sendLocalNotification = useCallback(
    async (
      title: string,
      body: string,
      data?: Record<string, string>,
      channelId: string = "default",
    ) => {
      if (!notificationPermission) {
        console.warn("Notification permission not granted");
        return;
      }

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: data || {},
            sound: notificationSettings.sounds,
            vibration: notificationSettings.vibrations
              ? [0, 250, 250, 250]
              : false,
          },
          trigger: null,
        });
      } catch (error) {
        console.error("Failed to send local notification:", error);
      }
    },
    [notificationPermission, notificationSettings],
  );

  const cancelAllNotifications = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Failed to cancel notifications:", error);
    }
  }, []);

  return {
    notificationPermission,
    notificationToken,
    notificationSettings,
    requestNotificationPermission,
    updateSettings,
    sendLocalNotification,
    cancelAllNotifications,
    registerForPushNotifications,
  };
}

export function useNotificationObserver() {
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        setLastNotification(notification);
        console.log("Notification received:", notification);
      },
    );

    return () => subscription.remove();
  }, []);

  return { lastNotification };
}
