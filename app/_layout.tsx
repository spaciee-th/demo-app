import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

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
        updateUserData(session?.user.id);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (userId: string) => {
    let res = await getUserData(userId);
    if (res && res.success) {
      setUserData(res.data);
    }
  };
  return <Stack screenOptions={{ headerShown: false }} />;
};
export default _layout;
