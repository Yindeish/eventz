import { useFocusEffect } from "expo-router";
import { useCallback } from "react";


export function useOnGoBack(callback: () => void) {
    useFocusEffect(
        useCallback(() => {

            return () => {
                callback();
            };
        // }, [callback])
        }, [])
    );
}