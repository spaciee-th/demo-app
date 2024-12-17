import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { Image, ImageStyle } from "expo-image";
import { theme } from "@/constants/theme";
import { getUserImageSrc } from "@/services/imageService";

interface AvatarProps {
  uri?: string;
  size?: number;
  rounded?: number;
  style?: StyleProp<ViewStyle>;
}

const Avatar = ({ uri, size, rounded, style }: AvatarProps) => {
  return (
    <Image
      source={getUserImageSrc(uri)}
      style={[
        { width: size, height: size, borderRadius: rounded },
        styles.avatar,
        style as StyleProp<ImageStyle>,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
    avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});
