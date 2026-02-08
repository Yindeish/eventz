import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tv } from "@/components/shared/view";
import { Grid, GridItem } from "@/components/ui/grid";
import { postsArr } from "@/constants/posts";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { router } from "expo-router";
import { useState } from "react";
import Trash from "../svgs/trash";
import { view } from "@/styles/view";
import { img } from "@/styles/img";
import UploadImg from "../svgs/upload-img";
import { useImagePicker } from "@/hooks/file/use-image-picker";
import { RootState } from "@/state/state";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { iGallery } from "@/state/types/create-event";
import { setCreateEventState } from "@/state/slices/create-event";
import { burnt } from "@/components/shared/burnt";

const GallerySheet = ({ onClose }: { onClose: () => void }) => {
    const { insets: { top } } = useSafeAreaView();
    const { pickReturnImage } = useImagePicker();
    const { gallery } = useAppSelector((s: RootState) => s.createEvent);
    const dispatch = useAppDispatch()

    const addImage = async () => {
        if (gallery.length == 3) {
            burnt.toast({ title: 'Upgrade to pro to upload more images' })
            return;
        }
        const image = await pickReturnImage();

        const lastImage = gallery[gallery.length - 1];
        if (!lastImage) {
            const firstImage = {
                id: 0,
                uri: image?.uri
            } as iGallery;
            dispatch(setCreateEventState({ key: 'gallery', value: [firstImage] }));
            return;
        }

        const newImage = {
            id: Number(lastImage?.id) + 1,
            uri: image?.uri
        } as iGallery;
        dispatch(setCreateEventState({ key: 'gallery', value: [...gallery, newImage] }));
        return;
    }

    const removeImg = (imgId: number) => {
        const updatedGallery = gallery.filter((item) => item.id !== imgId)
        dispatch(setCreateEventState({ key: 'gallery', value: updatedGallery }))
    }

    const uploadImg = (imgId: number, url: string) => {
        const updatedGallery = gallery.map((item) => {
            if (item.id === imgId) return ({ ...item, url });
            else return item;
        })
        dispatch(setCreateEventState({ key: 'gallery', value: updatedGallery }))
    }


    return (
        <Tv className="w-full h-full min-h-[856px] flex-1">
            <Container className="flex-col gap-[24px]">
                <Tv className="w-full h-auto bg-white flex-row items-center gap-[16px]" style={[{ marginTop: top }]}>
                    <Pr onPress={onClose}>
                        <BackArrow />
                    </Pr>
                    <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                        Gallery (Pre-Event)
                    </Urbanist>
                </Tv>

                <Tv className="w-full h-full flex-1">
                    {(gallery.length < 1) ? (<Tv className="flex-1 flex-col items-center justify-center">
                        <Pr onPress={addImage} className="w-full h-auto flex-col items-center justify-end gap-[12px] py-[30px] border-[1px] border-[#757575] rounded-[8px]" style={[view.border('#757575')]}>
                            <UploadImg color="#757575" />
                            <Urbanist className="text-[#757575] text-[18px] font-bold">
                                Upload event banner
                            </Urbanist>
                            <Urbanist className="text-[#757575] text-[14px] font-medium">
                                Not more than 20MB
                            </Urbanist>
                        </Pr>
                    </Tv>) : (
                        <Tv className="flex-1 flex-col items-center gap-[20px]">
                            <Grid className="w-full h-auto gap-[20px]" _extra={{ className: 'grid-cols-3' }}>
                                {gallery.map((galleryItem, index) => (
                                    <GridItem
                                        className="flex-1 h-[118px] relative"
                                        _extra={{ className: 'col-span-1' }}
                                        style={[view.relative]}
                                        key={index}
                                    >
                                        <Tv className="w-full h-full flex-row justify-end p-[7px] absolute top-0 left-0 z-3">
                                            <Pr onPress={() => removeImg(galleryItem.id)} className="w-[28px] h-[28px] flex-row items-center justify-center rounded-full bg-white">
                                                <Trash />
                                            </Pr>
                                        </Tv>
                                        <Img className="w-full h-full rounded-[20px]" style={[img.zIndex(-1)]} source={{ uri: galleryItem?.uri }} />
                                    </GridItem>
                                ))}
                            </Grid>

                            <Urbanist onPress={addImage} className="text-[#73138C] text-[16px] font-medium px-4">Add image</Urbanist>
                        </Tv>)}
                </Tv>
            </Container>
        </Tv>
    );
}

export default GallerySheet;