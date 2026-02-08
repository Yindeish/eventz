import { UploadApiOptions, upload } from "cloudinary-react-native";
import cloudinary from "./cloudinary.config";
import { CLOUDINARY_UNSIGNED_PRESET } from "./cloudinary.constants";
import { burnt } from "@/components/shared/burnt";

const uploadImage = async ({ fnToRn, folderName, imagePath }: { imagePath: string, folderName: string, fnToRn: (path: string) => void }) => {
    const options: UploadApiOptions = {
        upload_preset: CLOUDINARY_UNSIGNED_PRESET,
        unsigned: true,
        folder: folderName
    }

    await upload(cloudinary, {
        file: imagePath, options: options, callback: (error: any, response: any) => {
            if (response) fnToRn(response?.secure_url);
            if (error) {
                console.log('Cloudinary upload error', error)
                burnt.toast({ title: error?.message || 'An error occurred while uploading image to cloudinary' })
            }
        }
    });
}

const uploadVideo = async ({ fnToRn, folderName, videoPath }: { videoPath: string, folderName: string, fnToRn: (path: string) => void }) => {
    const options: UploadApiOptions = {
        upload_preset: CLOUDINARY_UNSIGNED_PRESET,
        unsigned: true,
        folder: folderName,
        resource_type: 'video'
    }

    await upload(cloudinary, {
        file: videoPath, options: options, callback: (error: any, response: any) => {
            if (response) fnToRn(response?.secure_url);
            if (error) {
                console.log('Cloudinary upload error', error)
                burnt.toast({ title: error?.message || 'An error occurred while uploading video to cloudinary' })
            }
        }
    });
}

const CloudinaryServices = {
    uploadImage,
    uploadVideo,
}

export default CloudinaryServices;