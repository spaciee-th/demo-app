import {
  Alert,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/screenWrapper";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";
import { useRouter } from "expo-router";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseFileUrl } from "@/services/imageService";
import { Image } from "expo-image";
import { Video } from "expo-av";
import { createOrUpdatePost } from "@/services/postService";

const NewPost = () => {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<any>(null);

  const onPickImage = async (isImage: boolean) => {
    let mediaConfig: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };
    if (!isImage) {
      console.log("video");
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    console.log("file", result && result.assets && result.assets[0]);
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const isLocaFile = (file: any) => {
    if (!file) return false;
    if (typeof file === "object") return true;
    return false;
  };

  const getFileType = (file: any) => {
    if (!file) return null;
    if (isLocaFile(file)) {
      return file.type;
    }
    if (file.includes("postImages")) {
      return "image";
    }
    return "video";
  };

  const getFileUri = (file: any) => {
    if (!file) return null;
    if (isLocaFile(file)) {
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  };
  const onSubmit = async () => {
    if (!bodyRef.current ) {
      Alert.alert("Create Post", "Please fill all the fields!");
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    }

    setLoading(true);
    let res =  await createOrUpdatePost(data);
    setLoading(false);
    if(res && res.success){
      setFile(null);
      bodyRef.current = "";
      editorRef.current = null;
      router.back();
    }else{
      Alert.alert("Create Post", 'Could not create your post');
    }
  };
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container as StyleProp<ViewStyle>}>
        <Header title="Create Post " />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          <View style={styles.header as StyleProp<ViewStyle>}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.username as StyleProp<TextStyle>}>
                {user?.name}
              </Text>

              <Text style={styles.publicText as StyleProp<TextStyle>}>
                Public
              </Text>
            </View>
          </View>
          <View style={styles.textEditor as StyleProp<ViewStyle>}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body: string) => (bodyRef.current = body)}
            />
          </View>
          {file && (
            <View style={styles.file as StyleProp<ViewStyle>}>
              {getFileType(file) === "video" ? (
                <Video
                  style={{ flex: 1 }}
                  source={{ uri: getFileUri(file) }}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                />
              ) : (
                <Image
                  source={{ uri: getFileUri(file) }}
                  resizeMode="cover"
                  style={{ flex: 1 }}
                />
              )}

              <Pressable
                style={styles.closeIcon as StyleProp<ViewStyle>}
                onPress={() => setFile(null)}
              >
                <Icon name="delete" size={20} color={"white"} />
              </Pressable>
            </View>
          )}

          <View style={styles.media as StyleProp<ViewStyle>}>
            <Text style={styles.addImageText as StyleProp<TextStyle>}>
              Add to your post
            </Text>
            <View style={styles.mediaIcons as StyleProp<ViewStyle>}>
              <TouchableOpacity onPress={() => onPickImage(true)}>
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPickImage(false)}>
                <Icon name="video" size={34} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          buttonStyle={{ height: hp(6.2) }}
          title="Post"
          onPress={onSubmit}
          hasShadow={false}
          loading={loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255,0,0,0.7)",
    padding: 5,
  },
  video: {},
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addImageText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  textEditor: {},
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
    textAlign: "center",
  },
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
});
