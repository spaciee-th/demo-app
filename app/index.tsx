import { Text, Button, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/screenWrapper";
import Loading from "@/components/Loading";

const Index = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Loading />
    </View>
  );
};

export default Index;
