import { supabase } from "@/lib/supabase";

export const createNotification = async (data: any) => {
    try {
        const { data: notificationData, error } = await supabase
            .from("notifications")
            .insert(data)
            .select()
            .single();
        if (error) {
            console.log(error)
            return { success: false, msg: error?.message }
        } else {
            console.log("notification success",notificationData)
            return { success: true, data: notificationData }
        }
    } catch (e) {
        console.log(e)
    }
}