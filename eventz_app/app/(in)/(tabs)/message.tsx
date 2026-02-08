import Post, { iPost } from "@/components/in/post";
import PostSvg from "@/components/in/home/svgs/post";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import { useSheetRef } from "@/components/shared/sheet";
import SheetModal from "@/components/shared/sheet-modal";
import { Tv } from "@/components/shared/view";
import { useState } from "react";
import { FlatList } from "react-native";
import Event from "@/components/in/svgs/tabs/event";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Explore from "@/components/in/home/explore";
import Following from "@/components/in/home/following";
import Communities from "@/components/in/home/communities";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { text } from "@/styles/text";
import { view } from "@/styles/view";
import { usePathname } from "expo-router";
import Messages from "@/components/in/message/messages";


const Tab = createMaterialTopTabNavigator();

const Message = () => {
    const sheet = useSheetRef();
    const colorScheme = useColorScheme();
    const path = usePathname()

    const is = (route: string) => path === route;


    return (
        <Tv className="flex-1 flex-col gap-[12px] bg-[#FBFCFF]">
            <Container>
                {/* Tabs */}
                <Tab.Navigator
                    screenOptions={{
                        swipeEnabled: true,
                        tabBarIndicatorStyle: [view.borderWidth(0)],
                        tabBarIndicatorContainerStyle: [view.borderWidth(0)],
                        tabBarIndicator: ({ }) => <Tv />,
                        tabBarContentContainerStyle: [view.gap(10), view.h(60), view.pt(12)],
                    }}
                >
                    <Tab.Screen
                        name="all"
                        options={{
                            tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(is('/message/all') ? 'white' : '#A0A0A0'), focused ? text.bold : text.semiBold, text.size(12)]} className="">
                                All
                            </Urbanist>),
                            tabBarItemStyle: [view.bg(is('/message/all') ? '#73138C' : '#F7F7F7'), view.rounded(8), view.border(is('/message/all') ? '#73138C' : '#F7F7F7'), view.h(38), view.px(1), view.flex_1],
                        }}
                        component={Messages} />
                    <Tab.Screen
                        name="primary"
                        options={{
                            tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(is('/message/primary') ? 'white' : '#A0A0A0'), focused ? text.bold : text.semiBold, text.size(12)]} className="">
                                Primary
                            </Urbanist>),
                            tabBarItemStyle: [view.bg(is('/message/primary') ? '#73138C' : '#F7F7F7'), view.rounded(8), view.border(is('/message/primary') ? '#73138C' : '#F7F7F7'), view.h(38), view.px(1), view.flex_1],
                        }}
                        component={Messages} />
                    <Tab.Screen
                        name="unread"
                        options={{
                            tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(is('/message/unread') ? 'white' : '#A0A0A0'), focused ? text.bold : text.semiBold, text.size(12)]} className="">
                                Unread
                            </Urbanist>),
                            tabBarItemStyle: [view.bg(is('/message/unread') ? '#73138C' : '#F7F7F7'), view.rounded(8), view.border(is('/message/unread') ? '#73138C' : '#F7F7F7'), view.h(38), view.px(1), view.flex_1],
                        }}
                        component={Messages} />
                    <Tab.Screen
                        name="archived"
                        options={{
                            tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(is('/message/archived') ? 'white' : '#A0A0A0'), focused ? text.bold : text.semiBold, text.size(12)]} className="">
                                Archived
                            </Urbanist>),
                            tabBarItemStyle: [view.bg(is('/message/archived') ? '#73138C' : '#F7F7F7'), view.rounded(8), view.border(is('/message/archived') ? '#73138C' : '#F7F7F7'), view.h(38), view.px(1), view.flex_1],
                        }}
                        component={Messages} />

                </Tab.Navigator>
                {/* Tabs */}
            </Container>
        </Tv>
    );
}

export default Message;