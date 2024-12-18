import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/screenWrapper";
import { hp, wp } from "@/helpers/common";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/theme";
import Header from "@/components/Header";
import { Image } from "expo-image";
import { useAuth } from "@/contexts/AuthContext";
import { getUserImageSrc, uploadFile } from "@/services/imageService";
import Icon from "@/assets/icons";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { updateUserData } from "@/services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    image: "",
    bio: "",
    address: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        image: currentUser.image || null,
        bio: currentUser.bio || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  const onSubmit = async () => {
    let userData = {
      ...user,
    };
    let { name, phoneNumber, bio, address, image } = userData;
    if (!name || !phoneNumber || !bio || !address || !image) {
      Alert.alert("Edit Profile", "Please fill all the fields!");
      return;
    }
    setLoading(true);
    console.log(typeof image);
    if (
      typeof image === "string" &&
      currentUser &&
      currentUser.image !== image
    ) {
      console.log("image", image);
      let imageRes = await uploadFile("profiles", image, true);
      console.log("imageRes", imageRes);
      if (imageRes && imageRes.success) {
        userData.image = imageRes.data || "";
      } else {
        userData.image = "";
      }
    }
    if (currentUser && currentUser?.id) {
      const res = await updateUserData(currentUser?.id, userData);
      setLoading(false);
      if (res && res.success) {
        setUserData({
          ...currentUser,
          ...userData,
        });

        Alert.alert("Edit Profile", "Profile updated successfully");
        router.back();
      }
    }
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0].uri });
    }
  };

  //   const uploadImage = async () => {
  //     if(user && user.image){
  //         console.log("user.image", user.image);
  //         let imageRes = await uploadFile("profiles", user.image, true);
  //     }

  //   };
  let imageSource = getUserImageSrc(user?.image ?? "");
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />

          {/* form */}

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon
                  name="camera"
                  size={20}
                  strokeWidth={2.5}
                  color={theme.colors.text}
                />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder="Enter your Name"
              value={user.name}
              onChangeText={(value) => {
                setUser({ ...user, name: value });
              }}
            />

            <Input
              icon={<Icon name="call" />}
              value={user.phoneNumber}
              placeholder="Enter your phone Number"
              onChangeText={(value) => {
                setUser({ ...user, phoneNumber: value });
              }}
            />

            <Input
              icon={<Icon name="location" />}
              placeholder="Enter your Address"
              value={user.address}
              onChangeText={(value) => {
                setUser({ ...user, address: value });
              }}
            />

            <Input
              placeholder="Enter your bio"
              value={user.bio}
              multiline
              containerStyle={styles.bio}
              onChangeText={(value) => {
                setUser({ ...user, bio: value });
              }}
            />
            {/* <Button
              title="update image"
              loading={loading}
              onPress={uploadImage}
            /> */}
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  cameraIcon: {
    position: "absolute",
    right: -10,
    bottom: 0,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
});
