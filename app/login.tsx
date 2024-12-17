import {
  Alert,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/screenWrapper";
import { StatusBar } from "expo-status-bar";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const router = useRouter();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields!");
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    setLoading(true);
    const {error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false);
    console.log("error", error);
    if(error){
      Alert.alert("Login", error.message);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container as StyleProp<ViewStyle>}>
        <BackButton onPress={router} />
        <View style={styles.welcomeText as StyleProp<ViewStyle>}>
          <Text style={styles.welcomeTextText as StyleProp<TextStyle>}>Hey,</Text>
          <Text style={styles.welcomeTextText as StyleProp<TextStyle>}>Welcome Back</Text>
        </View>

        <View style={styles.form as StyleProp<ViewStyle>}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please login to continue{" "}
          </Text>

          <Input
            placeholder="Enter your email"
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            onChangeText={(text: string) => (emailRef.current = text)}
          />

          <Input
            placeholder="Enter your password"
            secureTextEntry
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            onChangeText={(text: string) => (passwordRef.current = text)}
          />

          <Text style={styles.forgotPassowrd as StyleProp<TextStyle>}>Forgot Password?</Text>
          <Button title="Login" onPress={onSubmit} loading={loading} />
        </View>

        <View style={styles.footer as StyleProp<ViewStyle>}>
          <Text style={styles.footerText as StyleProp<TextStyle>}>Don't have an account?</Text>
          <Pressable onPress={() => router.push("/signUp")}>
            <Text
              style={[
                styles.footerText as StyleProp<TextStyle>,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semiBold,
                } as StyleProp<TextStyle>,
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    marginBottom: 15,
  },
  welcomeTextText: {
    fontSize: hp(4),
    fontWeight: "700", // Using a valid weight (700) for bold text
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassowrd: {
    textAlign: "right",
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
