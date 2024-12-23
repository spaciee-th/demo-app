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

var limit = 10;
const Home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const handlePostEvent = async (payload: any) => {
    console.log(payload.eventType === "INSERT" && payload?.new?.id);
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];

      let res = await getUserData(newPost?.userId);
      newPost.user = res?.success ? res?.data : {};
      console.log("newPost", newPost);
      setPost((prevPosts: any) => [newPost, ...prevPosts]);
    }

    if (payload.eventType === "DElETE" && payload?.old?.id) {
      setPost((prevPosts: any) =>
        prevPosts.filter((post: any) => post.id !== payload.old.id)
      );
    }

    if (payload.eventType === "UPDATE" && payload?.new?.id) {
      setPost((prevPosts: any) =>
        prevPosts.map((post: any) => {
          if (post.id === payload.new.id) {
            return { ...post, ...payload.new };
          }
          return post;
        })
      );
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        handlePostEvent
      )
      .subscribe();


      let postChannel2 = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
        },
        handlePostEvent
      )
      .subscribe();

    getPosts();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(postChannel2);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return;
    limit = limit + 4;
    console.log("limit", limit);
    let res = await fetchPost(limit);
    if (res && res.success && res.data) {
      if (post.length === res.data.length) setHasMore(false);
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
          onEndReached={() => getPosts()}
          onEndReachedThreshold={0}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: post.length === 0 ? 200 : 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.noPosts as StyleProp<TextStyle>}>
                  No more posts
                </Text>
              </View>
            )
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
