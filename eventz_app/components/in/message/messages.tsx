import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Tv } from "@/components/shared/view";
import { postsArr } from "@/constants/posts";
import { FlatList } from "react-native";

const Messages = () => {
    return (
        <Tv className="w-full h-full bg-white flex pt-[24px]">
            <FlatList
                // data={Array.from({ length: 13 })}
                data={[]}
                renderItem={({ index }) => (
                    <Tv

                        className="w-full h-[46px] flex-row gap-[8px] border-b-[0.5px] border-b-[#F7F7F7] pb-[14px]" key={index}>
                        <Img className="w-[34px] h-[34px] rounded-full" source={postsArr[1]?.authorImg} />
                        <Tv className="flex-1 flex-col justify-between">
                            <Urbanist className="text-[#2A2A2A] text-[12px]">
                                John Chris
                            </Urbanist>
                            <Urbanist className="text-[#5A5A5A] text-[10px]">
                                I’m on my way, lad!
                            </Urbanist>
                        </Tv>

                        <Tv className="flex-col justify-between">
                            <Tv className='w-[11px] h-[10px] flex-row items-center justify-center rounded-full bg-[#73138C]'>
                                <Urbanist className='text-[6px] text-white font-medium'>1</Urbanist>
                            </Tv>
                            <Urbanist className="text-[#5A5A5A] text-[8px]">
                                12:00 PM
                            </Urbanist>
                        </Tv>
                    </Tv>
                )}
                contentContainerClassName="flex-col gap-[14px]"
                horizontal={false}
                showsVerticalScrollIndicator={false}
            />
        </Tv>
    );
}

export default Messages;