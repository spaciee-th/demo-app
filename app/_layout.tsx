import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer:",
  "Warning: MemoizedTNodeRenderer:",
  "Warning: TRenderEngineProvider:",
]);
const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      // console.log("session", session?.user);
      if (session && session?.user) {
        setAuth(session?.user);
        updateUserData(session?.user.id, session?.user.email);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (userId: string, email?: string) => {
    let res = await getUserData(userId);
    if (res && res.success) {
      setUserData({ ...res.data, email });
    }
  };
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(main)/postDetails" options={{
      presentation: "modal"
    }} />
  </Stack>;
};
export default _layout;
