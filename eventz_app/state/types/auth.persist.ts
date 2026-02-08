import { iUser } from "./auth";

export interface iAuthPersistSlice {
    visitedBefore: boolean;
    signedInBefore: boolean;
    signedIn: boolean;
    userToken: string | null,
    userId: string | null,
    user: iUser | null;
    signinTime: number | null,
    profileSetup: boolean,
    businessProfileSetup: boolean
}