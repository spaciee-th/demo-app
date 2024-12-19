import {
  FlatList,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/screenWrapper";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { getUserImageSrc } from "@/services/imageService";
import { fetchPost } from "@/services/postService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { getUserData } from "@/services/userService";

var limit = 0;
const Home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<any>([]);
  const handlePostEvent = async (payload: any) => {
    console.log("Realtime Event Received:", payload);
    console.log(payload.eventType === "INSERT" && payload?.new?.id)
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
  
      let res = await getUserData(newPost?.userId);
      newPost.user = res?.success ? res?.data : {};
      console.log("newPost", newPost);
      setPost((prevPosts: any) => [newPost, ...prevPosts]);

    }
  };

  useEffect(() => {
    let postChannel = supabase.channel("posts").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "posts",
      },
      handlePostEvent
    ).subscribe();
    getPosts();

    return() => {
      supabase.removeChannel(postChannel);
    }
  }, []);

 

  const getPosts = async () => {
    let res = await fetchPost();
    if (res && res.success && res.data) {
      setPost(res.data);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container as StyleProp<ViewStyle>}>
        <View style={styles.header as StyleProp<ViewStyle>}>
          <Text style={styles.title as StyleProp<TextStyle>}>LinkUp</Text>
          <View style={styles.icons as StyleProp<ViewStyle>}>
            <Pressable onPress={() => router.push("/notifications")}>
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("/newPost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={post}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listSyle as StyleProp<ViewStyle>}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          ListFooterComponent={
            <View style={{ marginVertical: post.length === 0 ? 200 : 30 }}>
              <Loading />
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  listSyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {},
});
