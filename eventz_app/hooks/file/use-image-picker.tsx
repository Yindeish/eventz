import { burnt } from '@/components/shared/burnt';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

export type PickedImage = {
    uri: string;
    width: number;
    height: number;
    fileName?: string;
    type?: string;
};

export const useImagePicker = () => {
    const [image, setImage] = useState<PickedImage | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pickImage = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                throw new Error('Media library permission denied');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];

                setImage({
                    uri: asset?.uri,
                    width: asset?.width,
                    height: asset?.height,
                    fileName: asset?.fileName as string,
                    type: asset?.type as string,
                });
            }
        } catch (e: any) {
            setError(e.message ?? 'Failed to pick image');
            burnt.toast({ title: e.message ?? 'Failed to pick image' })
        } finally {
            setLoading(false);
        }
    }, []);

    const pickReturnImage = async () => {
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
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];

                return ({
                    uri: asset?.uri,
                    width: asset?.width,
                    height: asset?.height,
                    fileName: asset?.fileName as string,
                    type: asset?.type as string,
                });
            }
        } catch (e: any) {
            setError(e.message ?? 'Failed to pick image');
            burnt.toast({ title: e.message ?? 'Failed to pick image' })
        } finally {
            setLoading(false);
        }
    };

    const clearImage = () => setImage(null);

    return {
        image,
        pickImage,
        clearImage,
        loading,
        error,
        pickReturnImage,
    };
};
