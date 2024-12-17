import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import React from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  Pressable,
  View,
} from "react-native";
import Loading from "./Loading";

interface ButtonProps {
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  onPress?: () => void;
  loading?: boolean;
  hasShadow?: boolean;
}

export default function Button({
  buttonStyle,
  textStyle,
  title = "Button",
  onPress = () => {},
  loading = false,
  hasShadow = false,
}: ButtonProps) {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  if (loading) {
    return (
      <View
        style={[
          styles.button as StyleProp<ViewStyle>,
          buttonStyle,
          { backgroundColor: "white" },
          hasShadow && shadowStyle,
        ]}
      >
        <Loading />
      </View>
    );
  }
  return (
    <Pressable
      style={[
        styles.button as StyleProp<ViewStyle>,
        buttonStyle,
        hasShadow && shadowStyle,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={[styles.text as StyleProp<TextStyle>, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: hp(6.6),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
  },
  text: {
    color: "white",
    fontSize: hp(2.5),
    fontWeight: '800',
  },
});
