import Btn from "@/components/shared/btn";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import { Ts } from "@/components/shared/scroll-view";
import { Tv } from "@/components/shared/view";
import { Grid, GridItem } from "@/components/ui/grid";
import { postsArr } from "@/constants/posts";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { text } from "@/styles/text";
import { view } from "@/styles/view";
import { useRef, useState } from "react";
import { FlatList, ImageSourcePropType } from "react-native";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
} from '@/components/ui/alert-dialog';
import ChevronLeftCurved from "@/components/in/events/svg/chevron-left-curved";
import ChevronRightCurved from "@/components/in/events/svg/chevron-right-curved";
import { img } from "@/styles/img";
import { useAppSelector } from "@/state/hooks/useRtk";
import { RootState } from "@/state/state";
import { Easing, FadeIn, FadeInLeft, FadeOutLeft, LinearTransition } from "react-native-reanimated";
import PagerView from "react-native-pager-view";



const Gallery = () => {
    const { insets } = useSafeAreaView();
    const { currentEvent } = useAppSelector((s: RootState) => s.event)
    const pagerRef = useRef<null | PagerView>(null)

    const imgs = (currentEvent?.gallery || []).map((img, index) => ({ img, number: index }));

    const [dialogOpen, setDialogOpen] = useState(false);
    const [allImgs, setAllImgs] = useState(imgs);
    let [currentImgIndex, setCurrentImgIndex] = useState(0);

    const selectImg = (index: number) => {
        setDialogOpen(true);
        setCurrentImgIndex(index);
        pagerRef?.current?.setPage(index)
    };

    const handlePrev = () => {
        if (currentImgIndex > 0) {
            setCurrentImgIndex(currentImgIndex - 1)
            pagerRef?.current?.setPage(currentImgIndex - 1)
        }
    };

    const handleNext = () => {
        if (currentImgIndex < (allImgs.length - 1)) {
            setCurrentImgIndex(currentImgIndex + 1)
            pagerRef?.current?.setPage(currentImgIndex + 1)
        }
    };


    return (
        <Tv className="flex-1 bg-white" style={[view.mb(insets.bottom)]}>
            <Container className="h-auto flex-1 pt-[24px]">
                <Ts>
                    <Grid className="gap-[20px]" _extra={{ className: 'grid-cols-3' }}>
                        {allImgs.map(({ img, number }, index) => (
                            <GridItem
                                className="flex-1 h-[118px]"
                                _extra={{ className: 'col-span-1' }}
                                key={index}
                            >
                                <Pr onPress={() => selectImg(number)}>
                                    <Img className="w-full h-full rounded-[20px]" source={{ uri: img }} />
                                </Pr>
                            </GridItem>
                        ))}
                    </Grid>
                </Ts>

            </Container>

            {/* Dialog */}
            <AlertDialog isOpen={dialogOpen} onClose={() => {
                setDialogOpen(false);
            }}>
                <AlertDialogBackdrop className="" />
                <AlertDialogContent className="bg-transparent border-none p-[0px]" style={[view.borderWidth(0)]}>
                    <Tv className="w-full h-[410px] flex-row items-center relative">
                        {/* Prev */}
                        <Tv className="w-auto h-full flex-row items-center absolute top-0 left-0" style={[view.zIndex(3)]}>
                            <Pr onPress={handlePrev} className="w-[44px] h-[44px] flex-row items-center justify-center rounded-full bg-white">
                                <ChevronLeftCurved />
                            </Pr>
                        </Tv>
                        {/* Prev */}

                        {/* Img */}
                        {/* <Tv className="w-full h-full px-[22px] absolute top-0 left-0">
                            <Img source={{uri: currentImg?.img}} className="w-full h-full rounded-[8px]" style={[img.zIndex(2)]} />
                        </Tv> */}
                        {/* <Tv className="w-full h-full px-[22px] overflow-hidden absolute top-0 left-0">
                            <FlatList
                                data={allImgs}
                                renderItem={(({ index, item: { img: image, number } }) => {
                                    const active = Number(currentImg?.index) === number;

                                    return (
                                        <Animated.View
                                            entering={FadeInLeft.damping(30).stiffness(200)}
                                            exiting={FadeOutLeft.damping(30).stiffness(200)}
                                            layout={LinearTransition.easing(Easing.linear)}
                                            className="w--full h--full object-cover object-center absolute top-0 left-0 transition-transform duration-300 ease-in-out"
                                            style={{ transform: `translateX(${(index - currentImgIndex) * 100}%)` }}
                                            key={index}>
                                            <Img source={{ uri: image }} className="w-full h-full rounded-[8px]" style={[img.zIndex(2)]} />
                                        </Animated.View>
                                    )
                                })}
                            />
                        </Tv> */}
                        <PagerView
                            ref={pagerRef}
                            style={[view.wFull, view.hFull]}
                            initialPage={currentImgIndex}
                            onPageSelected={({ nativeEvent: { position } }) => {
                                setCurrentImgIndex(position);
                            }}
                            scrollEnabled={false}
                        >
                            {allImgs.map(({ img: image, number }, index) => (
                                <Tv className="flex-1 w-full h-full pt-[24px] px-[24px]" key={index}>
                                    <Img className="flex-1 w-full h-full" style={[img.object('contain')]} source={{ uri: image }} />
                                </Tv>
                            ))}
                        </PagerView>
                        {/* Img */}

                        {/* Next */}
                        <Tv className="w-auto h-full flex-row items-center absolute top-0 right-0" style={[view.zIndex(3)]}>
                            <Pr onPress={handleNext} className="w-[44px] h-[44px] flex-row items-center justify-center rounded-full bg-white">
                                <ChevronRightCurved />
                            </Pr>
                        </Tv>
                        {/* Next */}
                    </Tv>
                </AlertDialogContent>
            </AlertDialog>
            {/* Dialog */}
        </Tv>
    );
}

export default Gallery;