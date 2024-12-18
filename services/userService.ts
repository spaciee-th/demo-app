import { supabase } from "@/lib/supabase";

export const getUserData = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
        if (error) {
            console.log(error)
            return { success: false, msg: error?.message }
        } else {
            return { success: true, data }
        }
    } catch (e) {
        console.log(e)
    }
}


export const updateUserData = async (userId: string, data: any) => {
    try {
        const { error } = await supabase
            .from("users")
            .update(data)
            .eq("id", userId)
        if (error) {
            console.log(error)
            return { success: false, msg: error?.message }
        } else {
            return { success: true, data }
        }
    } catch (e) {
        console.log(e)
    }
}