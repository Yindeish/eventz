import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { setAuthPersistState } from "@/state/slices/auth.persist";
import { RootState } from "@/state/state";
import { iUser } from "@/state/types/auth";
import { useState } from "react";

const useAuth = () => {
    const dispatch = useAppDispatch()
    const auth = useAppSelector((s: RootState) => s.auth);
    const authPersist = useAppSelector((s: RootState) => s.authPersist);

    const [refreshing, setRefreshing] = useState(false);


    const setUser = (user: iUser) => {
        dispatch(setAuthPersistState({ key: 'user', value: user }))
    }

    const resetUser = () => {
        dispatch(setAuthPersistState({ key: 'user', value: null }))
    }

    const setUserId = (id: string) => {
        dispatch(setAuthPersistState({ key: 'userId', value: id }))
    }

    const resetUserId = () => {
        dispatch(setAuthPersistState({ key: 'userId', value: null }))
    }

    const setSignedin = (value: boolean) => {
        dispatch(setAuthPersistState({ key: 'signedIn', value: value }))
    }

    const resetSignedin = () => {
        dispatch(setAuthPersistState({ key: 'signedIn', value: false }))
    }

    // const resetPin = () => {
    //     dispatch(setAuthState({ key: 'pin', value: null }))
    // }

    const setVisitedBefore = (value: boolean) => {
        dispatch(setAuthPersistState({ key: 'visitedBefore', value: value }))
    }

    const setUserToken = (token: string) => {
        dispatch(setAuthPersistState({ key: 'userToken', value: token }))
    }

    const resetUserToken = () => {
        dispatch(setAuthPersistState({ key: 'userToken', value: null }))
    }

    const login = (user: iUser) => {
        setSignedin(true);
        setUser(user);
        setUserId(user?.id)
    }

    const logout = () => {
        resetSignedin();
        resetUser();
        // resetPin();

        // dispatch(setRouteState({ key: 'lastRoute', value: null }))
    }

    const isSigninTimeExpired = () => {
        // if (!auth.signinTime) return true;

        // const SIX_HOURS = 6 * 60 * 60 * 1000;
        // const now = Date.now();

        // return now - auth.signinTime >= SIX_HOURS;
    };


    return {
        ...auth,
        ...authPersist,
        setUser, resetUser,
        setUserId, resetUserId,
        setSignedin, resetSignedin,
        setUserToken, resetUserToken,
        login, logout, setVisitedBefore,
        refreshing, isSigninTimeExpired,
    }
}

export default useAuth;