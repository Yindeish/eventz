import { Pr } from "@/components/shared/pressable";
import Event from "../../svgs/tabs/event";
import Post from "../svgs/post";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Tv } from "@/components/shared/view";

const CreateEventPost = () => {
    return (
        <Tv className="w-full min-h-[211px] flex-col rounded-tr-[20px] rounded-tl-[20px] bg-white">
            <Tv className="w-full h-[58px] flex-row items-center pt-[20px] px-[24px] pb-[16px] border-b-[0.5px] border-b-[#9E9E9E]">
                <Urbanist className="text-[16px] font-medium">Choose Option</Urbanist>
            </Tv>
            <Tv className="w-full flex-1 flex-col gap-[16px] pt-[16px] px-[24px]">
                {[
                    {
                        label: 'Create a Post',
                        icon: <Post />,
                        action: () => { }
                    },
                    {
                        label: 'Create an Event',
                        icon: <Event />,
                        action: () => { }
                    },
                ].map(({ action, label, icon }, index) => (
                    <Pr onPress={action} className="w-full flex-row items-center gap-[12px]" key={index}>
                        {icon}
                        <Urbanist className="text-[16px] font-medium">
                            {label}
                        </Urbanist>
                    </Pr>
                ))}
            </Tv>
        </Tv>
    );
}

export default CreateEventPost;