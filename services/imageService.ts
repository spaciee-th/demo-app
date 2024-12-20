import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

// Function to get the user image source
export const getUserImageSrc = (imagePath?: string) => {
    if (imagePath) {
        return getSupabaseFileUrl(imagePath);
    } else {
        return require("../assets/images/defaultUser.png");
    }
};

export const getLocalFilepath = (filepath: string) => {
    let fileName = filepath.split("/").pop();
    return `${FileSystem.documentDirectory}${fileName}`
}
export const downloadfile = async (filepath?: string) => {
    try {
        if(!filepath) return null
        const {uri} = await FileSystem.downloadAsync(
            filepath, getLocalFilepath(filepath)
        )
        return uri;
    } catch (error) {
        return null;
    }
}





// Function to upload a file
export const uploadFile = async (
    folderName: string,
    fileUri: string,
    isImage: boolean = true
) => {
    try {
        // Generate the file path for storage
        const fileName = getFilePath(folderName, isImage);
        console.log("fileName", fileName);

        // Read the file as Base64 string from the file URI
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        console.log("fileBase64 length:", fileBase64.length);
        let imageData = decode(fileBase64);
        console.log("imageData :", imageData);
        // Upload the file directly to Supabase as Base64
        const { data, error } = await supabase.storage
            .from("uploads") // Your storage bucket name in Supabase
            .upload(fileName, imageData, {
                cacheControl: "3600",
                contentType: isImage ? "image/*" : "video/*",
                upsert: false,
            });

        if (error) {
            console.error("Supabase Upload error:", error.message);
            throw error;
        }

        console.log("Uploaded file:", data);
        return { success: true, data: data.path };
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            return { success: false, msg: error.message };
        } else {
            console.error("Unknown error:", error);
            return { success: false, msg: "An unknown error occurred" };
        }
    }
};

// Function to generate a unique file path for storage
export const getFilePath = (folderName: string, isImage: boolean = true) => {
    return `${folderName}/${Date.now()}${isImage ? ".jpg" : ".mp4"}`;
};



export const getSupabaseFileUrl = (filepath?: string) => {
    if (filepath) {
        return { uri: `${process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_URL}/storage/v1/object/public/uploads/${filepath}` }
    }
    return null;
}


