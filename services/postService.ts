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



export const fetchPost = async (limit: number = 10, userId?: string) => {
    try {


        if (userId) {
            const { data, error } = await supabase.
                from("posts")
                .select(`
                *,
                user:users (id, name, image),
                postLikes (*),
                comments (*, user: users (id, name, image))
              `)
                .order("created_at", { ascending: false })
                .eq("userId", userId)
                .limit(limit);



            if (error) {
                console.log("create fetching Error", error);
                return { success: false, msg: 'Could not fetch your post' }
            }
            return { success: true, data: data };
        } else {

            const { data, error } = await supabase.
                from("posts")
                .select(`
                *,
                user:users (id, name, image),
                postLikes (*),
                comments (*, user: users (id, name, image))
              `)
                .order("created_at", { ascending: false })
                .limit(limit);



            if (error) {
                console.log("create fetching Error", error);
                return { success: false, msg: 'Could not fetch your post' }
            }
            return { success: true, data: data };
        }


    } catch (error) {
        console.log("create fetching Error", error);
        return { success: false, msg: 'Could not fetch your post' }
    }
};


export const insertPostLike = async (postLike: any) => {
    try {
        console.log("postLike", postLike);

        const { data, error } = await supabase.
            from("postLikes")
            .insert(postLike)
            .select()
            .single();


        if (error) {
            console.log("post like Error", error);
            return { success: false, msg: 'Could not Like  post' }
        }
        return { success: true, data: data };

    } catch (error) {
        console.log("post like Error", error);
        return { success: false, msg: 'Could not Like  post' }
    }
};

export const removePostLike = async (postId: number, userId: string) => {
    try {


        const { data, error } = await supabase.
            from("postLikes")
            .delete()
            .eq("postId", postId)
            .eq("userId", userId)


        if (error) {
            console.log("post remove like Error", error);
            return { success: false, msg: 'Could not remove Like  post' }
        }
        return { success: true, data: data };

    } catch (error) {
        console.log("post remove like Error", error);
        return { success: false, msg: 'Could not remove Like  post' }
    }
};




export const fetchPostDetails = async (postId: string) => {
    try {

        const { data, error } = await supabase.
            from("posts")
            .select(`
                *,
                user:users (id, name, image),
                postLikes (*),
                comments (*, user: users (id, name, image))
              `)
            .eq("id", postId)
            .order("created_at", { ascending: false, foreignTable: "comments" })
            .single();



        if (error) {
            console.log("fetch PostDetails Error", error);
            return { success: false, msg: 'Could not fetch post Details' }
        }
        return { success: true, data: data };

    } catch (error) {
        console.log("fetch PostDetails Error", error);
        return { success: false, msg: 'Could not fetch post Details' }
    }
};


export const createComment = async (comment: any) => {
    try {
        console.log("creating commen", comment);

        const { data, error } = await supabase.
            from("comments")
            .insert(comment)
            .select()
            .single();


        if (error) {
            console.log("comment Error", error);
            return { success: false, msg: 'Could not create your comment' }
        }
        return { success: true, data: data };

    } catch (error) {
        console.log("comment Error", error);
        return { success: false, msg: 'Could not create your comment' }
    }
};

export const removePostComment = async (commentId: string,) => {
    try {


        const { data, error } = await supabase.
            from("comments")
            .delete()
            .eq("id", commentId)


        if (error) {
            console.log("comment remove like Error", error);
            return { success: false, msg: 'Could not remove comment' }
        }
        return { success: true, data: commentId };

    } catch (error) {
        console.log("comment remove like Error", error);
        return { success: false, msg: 'Could not remove comment' }
    }
};



export const removePost = async (postId: string,) => {
    try {


        const { data, error } = await supabase.
            from("posts")
            .delete()
            .eq("id", postId)


        if (error) {
            console.log("post remove like Error", error);
            return { success: false, msg: 'Could not remove post' }
        }
        return { success: true, data: postId };

    } catch (error) {
        console.log("post remove like Error", error);
        return { success: false, msg: 'Could not remove post' }
    }
};



export const fetchPostNotifications = async (recID?: string) => {
    try {

        const { data, error } = await supabase.
            from("notifications")
            .select(`
                *,
                sender:users (id, name, image),
              `)
            .eq("receiverId", recID)
            .order("created_at", { ascending: false });



        if (error) {
            console.log("fetch Notifications Error", error);
            return { success: false, msg: 'Could not fetch notifications' }
        }
        return { success: true, data: data };



    } catch (error) {
        console.log("fetch Notifications Error", error);
        return { success: false, msg: 'Could not fetch notifications' }
    }
};