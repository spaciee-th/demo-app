import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchPost, fetchPostDetails } from "@/services/postService";
import { hp, wp } from "@/helpers/common";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const inputRef = useRef<TextInput>(null);
  const commentRef = useRef("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (postId) {
      getPostDetails();
    }
  }, [postId]);

  const getPostDetails = async () => {
    try {
      setLoading(true); // Start loading
      const res = await fetchPostDetails(postId); // Ensure postId is a number
      if (res?.success) {
        setPost(res.data);
        console.log("Post fetched successfully:", res.data);
      } else {
        console.error("Failed to fetch post:", res?.message);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.center as StyleProp<ViewStyle>}>
        <Loading />
      </View>
    );
  }

  // Handle case where post is not found or is empty
  if (!post || Object.keys(post).length === 0) {
    return (
      <View style={styles.center as StyleProp<ViewStyle>}>
        <Text>No post found</Text>
      </View>
    );
  }

  const onNewComment = async () => {
    try {
    } catch (error) {}
  };

  return (
    <View style={styles.container as StyleProp<ViewStyle>}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list as StyleProp<ViewStyle>}
      >
        <PostCard
          item={post}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
        />

        <View style={styles.inputContainer as StyleProp<ViewStyle>}>
          <Input
            inputRef={inputRef}
            placeholder="Add a comment..."
            containerStyle={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xxl,
            }}
            onChangeText={(text) => (commentRef.current = text)}
            placeholderTextColor={theme.colors.textLight}
          />
          {loading ? (
            <View style={styles.loading as StyleProp<ViewStyle>}>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.sendIcon as StyleProp<ViewStyle>}
              onPress={onNewComment}
            >
              <Icon name="send" color={theme.colors.primaryDark} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: wp(7),
  },
  list: {
    paddingHorizontal: wp(4),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    gap: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.xxl,
    height: hp(5.8),
    width: hp(5.8),
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
});
