import Btn from "@/components/shared/btn";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import Spinner from "@/components/shared/spinner";
import { Tv } from "@/components/shared/view";
import { view } from "@/styles/view";

const CreatEventSuccessful = ({ onClose, msg }: { onClose: () => void, msg: string }) => {
    return (
        <Tv className="w-full h-auto flex-col items-center gap-[32px] rounded-[52px] bg-white py-[40px] px-[32px]">
            <Img className="w-[186px] h-[180px]" source={require('@/assets/images/in/tickets/success.png')} />

            <Tv className="w-auto flex-col items-center gap-[16px]">
                <Urbanist className="text-[#73138C] text-[24px] font-bold text-center">Successful!</Urbanist>
                <Urbanist className="text-[#212121] text-[16px] text-center">
                    {msg}
                </Urbanist>
                {/* <Btn
                    container={{
                        onPress: onClose
                    }}
                    text={{
                        className: 'w-full text-center',
                        children: 'Ok'
                    }}
                /> */}
                <Spinner style={[view.w(60), view.h(60)]} />
            </Tv>
        </Tv>
    );
}

export default CreatEventSuccessful;