import { Img } from "@/components/shared/img";
import Spinner from "@/components/shared/spinner";
import { Tv } from "@/components/shared/view";
import useAuth from "@/hooks/auth/useAuth";
import { router } from "expo-router";
import { useEffect } from "react";



const Index = () => {
    const { user, signedIn, visitedBefore } = useAuth();

    const notauthenticated = Boolean(user == null && signedIn !== true);

    useEffect(() => {
        setTimeout(() => {
            if (notauthenticated) {
                if (visitedBefore === true) {
                    router.replace('/(onboarding)/signin')
                    return;
                }

                else {
                    router.replace('/(onboarding)/welcome')
                    return;
                }
            }
            else {
                if ((user?.profileSetup && Boolean(user.profileSetup) == false) || user?.profileSetup == undefined) {
                    router.replace('/(onboarding)/profile')
                    return;
                }
                if ((user?.role && user.role === 'organizer') && ((user?.businessSetup && Boolean(user.businessSetup) === false) || user?.businessSetup == undefined)) {
                    router.replace('/(onboarding)/business-info')
                    return;
                }

                router.replace('/(in)/(tabs)')
            }
        }, 2500)

    }, [])

    return (
        <Tv className="w-full h-full bg-white"
        >
            <Tv className="flex-1 flex-col justify-center items-center">
                {/* <Img className="w-[250px] h-[60px] object-fill" source={require('@/assets/images/icon.png')} /> */}
                <Img className="w-[250px] h-[60px] object-fill" source={require('@/assets/images/favicon.png')} />
            </Tv>
            <Tv className="w-full flex-col justify-center items-center pb-[100px]">
                <Spinner />
            </Tv>
        </Tv>
    );
}

export default Index;