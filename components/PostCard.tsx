import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { User } from "@supabase/supabase-js";
import { Router } from "expo-router";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { getSupabaseFileUrl } from "@/services/imageService";
import { Video } from "expo-av";

interface PostCardProps {
  item: any;
  currentUser: User;
  router: Router;
  hasShadow?: boolean;
}

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};
const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
}: PostCardProps) => {
  const shadowStyle = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 1,
  };

  const createdAt = (date: string) => {
    return moment(date).format("MMM D");
  };

  const openPostDetails = () => {};
  let liked = false;
  const likes = [];

  return (
    <View
      style={[
        styles.container as StyleProp<ViewStyle>,
        hasShadow && shadowStyle,
      ]}
    >
      <View style={styles.header as StyleProp<ViewStyle>}>
        {/* user info and post time */}
        <View style={styles.userInfo as StyleProp<ViewStyle>}>
          <Avatar
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.userName as StyleProp<TextStyle>}>
              {item?.user?.name}
            </Text>

            <Text style={styles.postTime as StyleProp<TextStyle>}>
              {createdAt(item?.created_at)}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={openPostDetails}>
          <Icon
            name="threeDotsHorizontal"
            size={hp(3.4)}
            strokeWidth={3}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* post body and media */}
      <View style={styles.content as StyleProp<ViewStyle>}>
        <View style={styles.postBody as StyleProp<ViewStyle>}>
          {item?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>

        {item?.file && item?.file?.includes("postImages") && (
          <Image
            source={getSupabaseFileUrl(item?.file)}
            transition={100}
            style={styles.postMedia as StyleProp<ImageStyle>}
            contentFit="cover"
          />
        )}

        {item?.file && item?.file?.includes("postVideos") && (
          <Video
            source={getSupabaseFileUrl(item?.file)}
            style={[
              styles.postMedia as StyleProp<ViewStyle>,
              { height: hp(30) },
            ]}
            useNativeControls
            isLooping
            resizeMode="cover"
          />
        )}
      </View>

      {/* post actions */}
      <View style={styles.footer as StyleProp<ViewStyle>}>
        <View style={styles.footerButton as StyleProp<ViewStyle>}>
          <TouchableOpacity>
            <Icon
              name="heart"
              size={24}
              fill={liked ? theme.colors.rose : 'transparent'}
              strokeWidth={2}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count as StyleProp<TextStyle>}>
            {likes.length}
          </Text>
        </View>

        <View style={styles.footerButton as StyleProp<ViewStyle>}>
          <TouchableOpacity>
            <Icon
              name="comment"
              size={24}
              strokeWidth={2}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count as StyleProp<TextStyle>}>
            0
          </Text>
        </View>
        <View style={styles.footerButton as StyleProp<ViewStyle>}>
          <TouchableOpacity>
            <Icon
              name="share"
              size={24}
              strokeWidth={2}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  postBody: {
    marginLeft: 5,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  content: {
    gap: 10,
  },
  postTime: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  userName: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    shadowColor: "#000",
    borderColor: theme.colors.gray,
    borderWidth: 0.5,
    backgroundColor: "white",
    paddingVertical: 12,
    padding: 10,
    borderCurve: "continuous",
    borderRadius: theme.radius.xxl * 1.1,
    marginBottom: 15,
    gap: 10,
  },
});
