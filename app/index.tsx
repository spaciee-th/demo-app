import {Text, Button } from "react-native";
import { useRouter } from 'expo-router'
import ScreenWrapper from "@/components/screenWrapper";

const Index = () => {
    const router = useRouter();
    return (
        <ScreenWrapper>
            <Text>Main Screen</Text>
            <Button title={'Click Me'} onPress={() => router.push("/welcome")} />
        </ScreenWrapper>
    )
}

export default Index
