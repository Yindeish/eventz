import { burnt } from "@/components/shared/burnt";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { captureRef } from "react-native-view-shot";

const useShare = ({ viewRef }: { viewRef: number | React.ReactInstance | React.RefObject<unknown> }) => {
    const [loading, setLoading] = useState(false);

    const handleShare = async ({ onShared }: { onShared?: (uri?: string) => void }) => {
        try {
            setLoading(true)
            const uri = await captureRef(viewRef, {
                format: "png",
                quality: 1,
            });
            await Sharing.shareAsync(uri);
           
            onShared && onShared(uri)
        } catch (error) {
            console.error("Error sharing receipt:", error);
            burnt.toast({ title: "Could not share receipt." });
        } finally {
            setLoading(false)
        }
    };

    return {
        handleShare, sharing: loading
    }
}

export default useShare;