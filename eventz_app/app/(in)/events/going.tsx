import Btn from "@/components/shared/btn";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Tv } from "@/components/shared/view";
import { postsArr } from "@/constants/posts";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { text } from "@/styles/text";
import { view } from "@/styles/view";
import { FlatList } from "react-native";


const Going = () => {
    const { insets } = useSafeAreaView();

    return (
        <Tv className="flex-1 bg-white" style={[view.mb(insets.bottom)]}>
            <Container className="h-auto flex-1 pt-[24px]">
                <FlatList
                    data={postsArr.concat(postsArr.concat(postsArr))}
                    renderItem={(({ index, item }) => {
                        const following = (index % 2);

                        return (
                            <Tv className="w-full flex-row items-center gap-[20px]" key={index}>
                                <Img className="w-[60px] h-[60px] rounded-full" source={item?.authorImg} />
                                <Urbanist className="flex-1 text-[#212121] text-[18px] font-bold">{item?.authorName}</Urbanist>
                                <Btn
                                    container={{
                                        className: `px-[16px] border-[2px] border-[#73138C] ${following ? 'bg-white' : 'bg-[#73138C]'}`,
                                        style: [view.wAuto, view.h(32)]
                                    }}
                                    text={{
                                        children: !following ? 'Follow' : 'Following',
                                        style: [text.color(following ? '#73138C' : 'white')]
                                    }}
                                />
                            </Tv>
                        )
                    })}
                    contentContainerClassName="flex-col gap-[24px]"
                    className="flex-1"
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                />
            </Container>
        </Tv>
    );
}

export default Going;