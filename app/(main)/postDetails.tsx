import {
  Alert,
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
import {
  createComment,
  fetchPost,
  fetchPostDetails,
  removePost,
  removePostComment,
} from "@/services/postService";
import { hp, wp } from "@/helpers/common";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import CommentItem from "@/components/CommentItem";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";
import { createNotification } from "@/services/notification";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [sendComment, setSendComment] = useState(false);
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


  useEffect(() => {
    let commentChannel = supabase.channel('comments')
      .on('postgres_changes',{
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `postId=eq.${post?.id}`
      }, handleNewComment)
      .subscribe();


      return () => {
        supabase.removeChannel(commentChannel);
      }
  }, [post]);

  const handleNewComment = async (payload: any) => {
    console.log("Realtime Event Received:", payload);
    if(payload.new){
      let newComment = {...payload.new};
      let res = await getUserData(newComment?.userId);
      newComment.user = res?.success ? res?.data : {};
      setPost((prevPost: any) => ({
        ...prevPost,
        comments: [newComment,...prevPost.comments ],
      }));
    }
  }

  const getPostDetails = async () => {
    try {
      setLoading(true); // Start loading
      const res = await fetchPostDetails(postId); 
      if (res?.success) {
        setPost(res.data);
        // console.log("Post fetched successfully:", res.data);
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

  const onDelete = async (id: string) => {
    let res = await removePostComment(id);
    if(res && res.success){
        setPost((prevPost: any) => ({
          ...prevPost,
          comments: prevPost.comments.filter((comment: any) => comment.id !== id),
        }))
    }else{
      Alert.alert("Delete Comment", "Something went wrong");
    }
  }

  const onNewComment = async () => {
    try {
      if (!commentRef.current) return null;
      let data = {
        postId: post.id,
        userId: user?.id,
        text: commentRef.current,
      };
      setSendComment(true);
      let res = await createComment(data);
      setSendComment(false);
      if (res && res.success) {
        // getPostDetails();
        inputRef.current?.clear();
        commentRef.current = "";

        if(user?.id !== post?.userId){
            let notify = {
              senderId: user?.id,
              receiverId: post?.userId,
              title: "New Comment",
              data:JSON.stringify({
                postId: post?.id,
                commentId: res?.data?.id ?? 0  
              })
            }

            const res =  await createNotification(notify);
        }
      }
      // Alert.alert("Create Comment", "your comment created successfully");
    } catch (error) {
      setSendComment(false);
      console.error("Error creating comment:", error);
      Alert.alert("Create Comment", "Could not create your comment");
    }
  };


  const onEditPost = (item: any) => {
    console.log("postId", item);
    router.back();
    router.push({
      pathname: "./newPost",
      params: {
        ...item
      },
    });
  }

  const onDeletePost = async(
    postId: string,
  ) => {
    console.log("postId", postId);
    let res = await removePost(postId);
    if(res && res.success){
      router.back();
    }else{
      Alert.alert("Delete Post", "Something went wrong");
    }
  }

  return (
    <View style={styles.container as StyleProp<ViewStyle>}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list as StyleProp<ViewStyle>}
      >
        <PostCard
          item={{
            ...post,
            // comments: [{ count: post?.comments.length }],
          }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
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
          {sendComment ? (
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

        <View style={{ marginVertical: 15, gap: 17 }}>

          {post?.comments?.map((comment: any) => (
            <CommentItem key={comment.id} comment={comment} item={comment} canDelete={user?.id === comment?.user?.id || user?.id === post?.user?.id}  onDelete={onDelete}/>
          ))}

          {post?.comments?.length === 0 && (
            <Text
              style={{
                textAlign: "center",
                fontSize: 14,
                color: theme.colors.textLight,
              }}
            >
              Be first to comment!
            </Text>
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
