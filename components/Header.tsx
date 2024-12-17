import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import BackButton from "./BackButton";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  marginBottom?: number;
}

const Header = ({
  title = "",
  showBackButton = true,
  marginBottom = 10,
}: HeaderProps) => {
  const router = useRouter();
  return (
    <View style={[styles.container as StyleProp<ViewStyle>, { marginBottom: marginBottom }]}>
      {showBackButton && (
        <View style={styles.showBackButton as StyleProp<ViewStyle>}>
          <BackButton onPress={router} />
        </View>
      )}

      <Text style={styles.title as StyleProp<TextStyle>}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    gap: 10,
  },
  title: {
    fontSize: hp(2.7),
    fontWeight:theme.fonts.semiBold,
    color: theme.colors.textDark
  },
  showBackButton: {
    position: "absolute",
    left: 0,
  },
});
