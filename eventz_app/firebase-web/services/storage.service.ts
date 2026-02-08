import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const S3 = {
  async upload(uri: string, path: string) {
    const res = await fetch(uri);
    const blob = await res.blob();

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  },

  async getUrl(path: string) {
    return await getDownloadURL(ref(storage, path));
  },
};
