const useUriToBlob = () => {

    const uriToBlob = async (
        uri: string,
        name = 'image.jpg',
        type = 'image/jpeg'
    ): Promise<File> => {
        const res = await fetch(uri);
        const blob = await res.blob();

        return new File([blob], name, { type });
    };


    return {uriToBlob}
}

export default useUriToBlob;