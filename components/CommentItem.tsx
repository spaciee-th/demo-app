import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";

interface CommentItemProps {
  comment: string;
  item: any;
  canDelete?: boolean;
  onDelete: (id: string) => void;
}

const CommentItem = ({
  comment,
  item,
  canDelete = false,
  onDelete
}: CommentItemProps) => {
  const createdAt = moment(item?.created_at).format("MMM D");
  const handleDelete = () => {
        Alert.alert("Logout", "Are you sure you want to do this ?", [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: () => {
                onDelete(item.id);
              },
              style: "destructive",
            },
          ]);
  }
  return (
    <View style={styles.container as StyleProp<ViewStyle>}>
      <Avatar uri={item?.user?.image} size={hp(5)} rounded={theme.radius.xl} />
      <View style={styles.content as StyleProp<ViewStyle>}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.nameContainer as StyleProp<ViewStyle>}>
            <Text style={styles.text as StyleProp<TextStyle>}>
              {item?.user?.name}
            </Text>
            <Text>.</Text>
            <Text
              style={[
                styles.text as StyleProp<TextStyle>,
                { color: theme.colors.textLight },
              ]}
            >
              {createdAt}
            </Text>
          </View>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <Icon name="delete" color={theme.colors.rose} />
            </TouchableOpacity>
          )}
        </View>
        <Text
          style={[
            styles.text as StyleProp<TextStyle>,
            { fontWeight: "normal" },
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  highlight: {
    borderWidth: 0.2,
    backgroundColor: "white",
    borderColor: theme.colors.dark,
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    backgroundColor: "rgba(0,0,0,0.06)",
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
  },
});
