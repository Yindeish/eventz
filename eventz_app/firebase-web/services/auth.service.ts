import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  // OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const Auth = {
  register: (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password),

  login: (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password),

  logout: () => signOut(auth),

  loginWithGoogle: (idToken: string) => {
    const credential = GoogleAuthProvider.credential(idToken);
    return signInWithCredential(auth, credential);
  },

  loginWithFacebook: (token: string) => {
    // const credential = FacebookAuthProvider.credential(token);
    // return signInWithCredential(auth, credential);
  },

  loginWithApple: (identityToken: string, nonce?: string) => {
    // const provider = new OAuthProvider('apple.com');
    // const credential = provider.credential({
    //   idToken: identityToken,
    //   rawNonce: nonce,
    // });
    // return signInWithCredential(auth, credential);
  },
};
