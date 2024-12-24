import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import ScreenWrapper from "@/components/screenWrapper";
import { fetchPostNotifications } from "@/services/postService";
import { useAuth } from "@/contexts/AuthContext";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import NotificationItem from "@/components/NotificationItem";
import { useRouter } from "expo-router";
import Header from "@/components/Header";

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetchPostNotifications(user?.id);
      if (res?.success && res.data) {
        setNotifications(res.data);
      } else {
        console.warn("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container as StyleProp<ViewStyle>}>
        <Header title="Notifications" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle as StyleProp<ViewStyle>}
        >
          {notifications.length === 0 ? (
            <Text style={styles.noData as StyleProp<TextStyle>}>
              No Notifications
            </Text>
          ) : (
            notifications.map((item, index) => (
              <NotificationItem
                key={index}
                item={item}
                router={router}
                index={index}
              />
            ))
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: "center",
  },
});
