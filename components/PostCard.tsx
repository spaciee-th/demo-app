import {
  Alert,
  ImageStyle,
  Share,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Router } from "expo-router";
import { theme } from "@/constants/theme";
import { hp, stripHtmlTags, wp } from "@/helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { downloadfile, getSupabaseFileUrl } from "@/services/imageService";
import { Video } from "expo-av";
import { insertPostLike, removePostLike } from "@/services/postService";
import Loading from "./Loading";

interface PostCardProps {
  item: any;
  currentUser: User;
  router: Router;
  hasShadow?: boolean;
  showMoreIcon?: boolean;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (item: any) => void;
}

interface content {
  message: string;
  url?: string;
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
  showDelete = false,
  onDelete,
  onEdit,
  showMoreIcon = true,
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

  const openPostDetails = () => {
    if (!showMoreIcon) return;
    router.push({
      pathname: "./postDetails",
      params: {
        postId: item.id,
      },
    });
  };

  const [likes, setLikes] = useState<any>([]);
  const [isloading, setIsLoading] = useState(false);

  const onLike = async () => {
    if (liked) {
      let updatedLikes = likes.filter(
        (like: any) => like.userId !== currentUser.id
      );
      setLikes([...updatedLikes]);
      let res = await removePostLike(item.id, currentUser.id);
      console.log("res", res);
      if (res && !res.success) {
        Alert.alert("Like", "Something went wrong");
      } else {
        console.log("response ", "removed like");
      }
      return;
    } else {
      let data = {
        userId: currentUser.id,
        postId: item.id,
      };
      setLikes([...likes, data]);
      let res = await insertPostLike(data);
      console.log("res", res);
      if (res && !res.success) {
        Alert.alert("Like", "Something went wrong");
      }
    }
  };

  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);
  const onShare = async () => {
    setIsLoading(true);
    let content: content = {
      message: stripHtmlTags(item?.body),
    };

    if (item?.file) {
      let uri = await downloadfile(getSupabaseFileUrl(item?.file)?.uri);
      if (uri)
        content = {
          ...content,
          url: uri,
        };
    }

    Share.share(content);
    setIsLoading(false);
  };

  let liked = likes.filter((like: any) => like.userId === currentUser.id)[0]
    ? true
    : false;

  const handlePostEvent = async (payload: any) => {
    Alert.alert("Logout", "Are you sure you want to do this ?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          onDelete  && onDelete(item.id);
        },
        style: "destructive",
      },
    ]);
  };

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

        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threeDotsHorizontal"
              size={hp(3.4)}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}

        {showDelete && currentUser.id === item?.user?.id && (
          <View style={styles.actions as StyleProp<ViewStyle>}>
            <TouchableOpacity
              onPress={() => {
                onEdit && onEdit(item);
              }}
            >
              <Icon name="edit" color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostEvent}>
              <Icon name="delete" color={theme.colors.rose} />
            </TouchableOpacity>
          </View>
        )}
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
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              size={24}
              fill={liked ? theme.colors.rose : "transparent"}
              strokeWidth={2}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count as StyleProp<TextStyle>}>
            {likes.length}
          </Text>
        </View>

        <View style={styles.footerButton as StyleProp<ViewStyle>}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="comment"
              size={24}
              strokeWidth={2}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count as StyleProp<TextStyle>}>
            {item?.comments?.length}
          </Text>
        </View>
        <View style={styles.footerButton as StyleProp<ViewStyle>}>
          {!isloading ? (
            <TouchableOpacity onPress={onShare}>
              <Icon
                name="share"
                size={24}
                strokeWidth={2}
                color={theme.colors.textLight}
              />
            </TouchableOpacity>
          ) : (
            <Loading size="small" />
          )}
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
