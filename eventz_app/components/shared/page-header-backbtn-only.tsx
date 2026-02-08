import { To } from "@/components/shared/touchable-opacity";
import { Tv } from "@/components/shared/view";
import { router } from "expo-router";
// import HeaderBackBtn from "./header-back-btn";

export const pageHeaderBackBtnOnly = ({ onBack }: { onBack?: () => void }) => (
    {
        headerShown: true,
        header: () => (<Tv className={`w-full h-[64px] flex-row items-center px-[16px]`}>
            <To
                onPress={
                    () => {
                        onBack && onBack();
                        router.back();
                    }
                }>
                {/* <HeaderBackBtn /> */}
            </To>
        </Tv>)
    }
)