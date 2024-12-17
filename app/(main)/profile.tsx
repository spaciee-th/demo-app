import {
  Alert,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/screenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { Router, useRouter } from "expo-router";
import { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import { supabase } from "@/lib/supabase";
import Avatar from "@/components/Avatar";

interface UserHeaderProps {
  user: any;
  router: Router;
  handleLogout: () => void;
}

const Profile = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();
  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
  };
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          onLogout();
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <ScreenWrapper bg="white">
      <UserHeader user={user} router={router} handleLogout={handleLogout} />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, handleLogout }: UserHeaderProps) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title="Profile" marginBottom={30} />
        <TouchableOpacity
          style={styles.logoutButton as StyleProp<ViewStyle>}
          onPress={handleLogout}
        >
          <Icon
            name="logout"
            size={hp(3.2)}
            strokeWidth={2}
            color={theme.colors.rose}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={hp(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("/editProfile")}
            >
              <Icon
                name="edit"
                strokeWidth={2.5}
                size={20}
                color={theme.colors.text}
              />
            </Pressable>
          </View>

          {/* userName and address */}

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName as StyleProp<TextStyle>}>
              {user && user?.name}
            </Text>

            <Text style={styles.infoText as StyleProp<TextStyle>}>
              {user && user?.address ? user?.address : "Add Address"}
            </Text>
          </View>
          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              <Icon name="mail" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText as StyleProp<TextStyle>}>
                {user && user?.email}
              </Text>
            </View>

            {user && user?.phoneNumber && (
              <View style={styles.info}>
                <Icon name="call" size={20} color={theme.colors.textLight} />
                <Text style={styles.infoText as StyleProp<TextStyle>}>
                  {user && user?.phoneNumber}
                </Text>
              </View>
            )}

            {user && user?.bio && (
              <Text style={styles.infoText as StyleProp<TextStyle>}>
                {" "}
                {user?.bio}{" "}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
    right: -12,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: theme.colors.textLight,
  },
  info: {
    gap: 10,
    alignItems: "center",
    flexDirection: "row",
  },
});
