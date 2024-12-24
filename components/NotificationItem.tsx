import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { Router } from "expo-router";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import Avatar from "./Avatar";

interface NotificationItemProps {
  item: any;
  index: number;
  router: Router;
}

const Notificationitem = ({ item, index, router }: NotificationItemProps) => {
  console.log("item", item);

  const handleClick = () => {
    let {
          postId,
          commentId
        } = JSON.parse(item?.data);
    router.back();

    router.push({
      pathname: "./postDetails",
      params: {
        postId,
        commentId
      } ,
    });
  };
  return (
    <TouchableOpacity
      style={styles.container as StyleProp<ViewStyle>}
      onPress={handleClick}
    >
      <Avatar uri={item.sender.image} size={hp(6)} rounded={theme.radius.xxl} />
      <View style={styles.nameTitle as StyleProp<ViewStyle>}>
        <Text style={[styles.text as StyleProp<TextStyle>,{fontWeight: theme.fonts.bold, color: theme.colors.textDark} as StyleProp<TextStyle>]}>
          {item?.sender?.name ?? ""}
        </Text>

        <Text style={styles.text as StyleProp<TextStyle>}>
          {item?.title ?? ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Notificationitem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  nameTitle: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
});
