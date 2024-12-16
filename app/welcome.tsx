import ScreenWrapper from "../components/screenWrapper";
import {
  Text,
  StyleSheet,
  View,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "@/components/Button";

const Welcome = () => {
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container as StyleProp<ViewStyle>}>
        <Image
          style={styles.welcomeImage as StyleProp<ImageStyle>}
          resizeMode="contain"
          source={require("../assets/images/welcome.png")}
        />
        {/* title */}

        <View style={{ gap: 20 }}>
          <Text style={styles.title as StyleProp<TextStyle>}>LinkUp!</Text>
          <Text style={styles.punchline as StyleProp<TextStyle>}>
            Where every thought finds a home and every image tells a story!
          </Text>
        </View>

        <View style={styles.footer as StyleProp<ViewStyle>}>
          <Button
            title="Getting Started"
            buttonStyle={{ marginHorizontal: wp(3) }}
          />
          <View style={styles.bottomTextContainer as StyleProp<ViewStyle>}>
            <Text style={styles.loginText as StyleProp<TextStyle>}>
              Already have an account?
            </Text>
            <Pressable>
              <Text
                style={[
                  styles.loginText as StyleProp<TextStyle>,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.bold,
                  } as StyleProp<TextStyle>,
                ]}
              >
                login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(80),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: `${theme.fonts.bold}`,
  },
  punchline: {
    textAlign: "center",
    paddingHorizontal: wp(4),
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
  footer: {
    width: "100%",
    gap: 30,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
