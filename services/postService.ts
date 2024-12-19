import { supabase } from "@/lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post: any) => {
    try {

        if (post.file && typeof post.file === "object") {
            let isImage = post?.file?.type === "image";
            let folderName = isImage ? "postImages" : "postVideos";
            let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
            if (fileResult.success) post.file = fileResult.data;
            else {
                return fileResult
            }
        }
        const { data, error } = await supabase.
            from("posts")
            .upsert(post)
            .select();

        if (error) {
            console.log("create Post Error", error);
            return { success: false, msg: 'Could not create your post' };
        }
        return { success: true, data: data };

    } catch (error) {
        console.log("create Post Error", error);
        return { success: false, msg: 'Could not create your post' }
    }
};



export const fetchPost = async (limit: number = 10) => {
    try {

        const { data, error } = await supabase.
            from("posts")
            .select(`
                *,
                user:users (id, name, image)
              `)
            .order("created_at", { ascending: false })
            .limit(limit);



        if (error) {
            console.log("create fetching Error", error);
            return { success: false, msg: 'Could not fetch your post' }
        }
        return { success: true, data: data };

    } catch (error) {
        console.log("create fetching Error", error);
        return { success: false, msg: 'Could not fetch your post' }
    }
};