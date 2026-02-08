// import ArrowBack from "@/components/shared/svgs/arrow-back";
import { Tt } from "@/components/shared/text";
import { To } from "@/components/shared/touchable-opacity";
import { Tv } from "@/components/shared/view";
import { router } from "expo-router";

export const pageHeaderBackBtnTile = ({ headerTitle, onBack }: { headerTitle: string, onBack?: () => void }) => {
    return {
        headerShadowVisible: false,
        headerTitle: '',
        header: () => (
            <Tv className={`w-full h-[74px] flex flex-row items-end justify-between px-[16px] pb-[12px]`
            } >
                <To
                    onPress={
                        () => {
                            onBack && onBack();
                            router.back();
                        }
                    }
                    className={`bg-transparent`
                    }>
                    {/* <ArrowBack /> */}
                </To>

                < Tt className={`flex-1 text-[#1F1F1F] text-[18px] font-semibold text-center capitalize`}> {headerTitle} </Tt>
            </Tv>
        )
    }
}