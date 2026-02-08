import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';

type Args = {
    onSuccess: (idToken: string) => void;
    onFailure: (error?: any) => void;
};

const useGoogleId = ({ onSuccess, onFailure }: Args) => {
    const [gettingToken, setGettingToken] = useState(false);

    const [request, response, promptAsync] =
        Google.useIdTokenAuthRequest({
            clientId: '152750030288-ju62j94e3ahc61hs6s3lfoc8m0g9er1b.apps.googleusercontent.com',
        });

    useEffect(() => {
        if (!response) return;

        setGettingToken(false);

        if (response.type === 'success') {
            const { id_token } = response.params;
            onSuccess(id_token);
        } else {
            onFailure(response);
        }
    }, [response]);

    // ✅ Imperative action only calls promptAsync
    const getGoogleIdToken = async () => {
        try {
            setGettingToken(true);
            await promptAsync();
        } catch (error) {
            setGettingToken(false);
            onFailure(error);
        }
    };

    return {
        getGoogleIdToken,
        gettingToken,
        request,
    };
};

export default useGoogleId;
