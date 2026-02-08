import { burnt } from '@/components/shared/burnt';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

export type PickedVideo = {
    uri: string;
    width: number;
    height: number;
    duration?: number;
    fileName?: string;
    type?: string;
};

export const useVideoPicker = () => {
    const [video, setVideo] = useState<PickedVideo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pickVideo = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                throw new Error('Media library permission denied');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];

                setVideo({
                    uri: asset?.uri,
                    width: asset?.width,
                    height: asset?.height,
                    duration: asset?.duration as number,
                    fileName: asset?.fileName as string,
                    type: asset?.type as string,
                });
            }
        } catch (e: any) {
            setError(e.message ?? 'Failed to pick video');
            burnt.toast({ title: e.message ?? 'Failed to pick video' })
        } finally {
            setLoading(false);
        }
    }, []);

    const pickReturnVideo = async () => {
        setLoading(true);
        setError(null);

        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                burnt.toast({ title: 'Media library permission denied' })
                throw new Error('Media library permission denied');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];

                return ({
                    uri: asset?.uri,
                    width: asset?.width,
                    height: asset?.height,
                    duration: asset?.duration,
                    fileName: asset?.fileName as string,
                    type: asset?.type as string,
                });
            }
        } catch (e: any) {
            setError(e.message ?? 'Failed to pick video');
            burnt.toast({ title: e.message ?? 'Failed to pick video' })
        } finally {
            setLoading(false);
        }
    };

    const clearVideo = () => setVideo(null);

    return {
        video,
        pickVideo,
        clearVideo,
        loading,
        error,
        pickReturnVideo,
    };
};