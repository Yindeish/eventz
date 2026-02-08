import Message from "@/components/in/events/svg/message";
import About from "@/components/in/events/tabs/about";
import Events from "@/components/in/events/tabs/events";
import Posts from "@/components/in/events/tabs/posts";
import PersonPlus from "@/components/in/profile/erson-plus";
import Btn from "@/components/shared/btn";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import { Ts } from "@/components/shared/scroll-view";
import { Tv } from "@/components/shared/view";
import { Grid, GridItem } from "@/components/ui/grid";
import { postsArr } from "@/constants/posts";
import { Colors } from "@/constants/theme";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { text } from "@/styles/text";
import { view } from "@/styles/view";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { router } from "expo-router";
import { FlatList } from "react-native";

const Tab = createMaterialTopTabNavigator();

const Organizer = () => {
    const colorScheme = useColorScheme();
    const { insets } = useSafeAreaView();


    return (
        <Tv className="w-full h-full bg-white" style={[view.mb(insets.bottom + insets.bottom)]}>
            <Container className="pt-[10px] h-auto flex-col items-center gap-[16px]"
            >
                <Img className="w-[90px] h-[90px] rounded-full" source={postsArr[1]?.authorImg} />

                <Urbanist className="text-[#212121] text-[27px] font-bold">World of Music</Urbanist>

                {/* Divider */}
                <Tv className="w-full h-[1px] bg-[#EEEEEE]" />
                {/* Divider */}

                {/* Events, Followers, Following */}
                <Grid className="h-[55px] gap-[0px]" _extra={{ className: 'grid-cols-3 h-[72px]', }}>
                    <GridItem
                        className="h-full"
                        _extra={{ className: 'col-span-1' }}
                    >
                        <Pr className="h-full flex-col justify-between items-center border-r border-r-[#EEEEEE]">
                            <Urbanist className="text-[#212121] text-[25px] font-bold">
                                24
                            </Urbanist>
                            <Urbanist className="text-[#616161] text-[14px] font-medium">
                                Events
                            </Urbanist>
                        </Pr>
                    </GridItem>
                    <GridItem
                        className="h-full"
                        _extra={{ className: 'col-span-1' }}
                    >
                        <Pr onPress={() => router.push('/(in)/events/followers')} className="h-full flex-col justify-between items-center border-r border-r-[#EEEEEE]">
                            <Urbanist className="text-[#212121] text-[25px] font-bold">
                                967K
                            </Urbanist>
                            <Urbanist className="text-[#616161] text-[14px] font-medium">
                                Followers
                            </Urbanist>
                        </Pr>
                    </GridItem>
                    <GridItem
                        className="h-full"
                        _extra={{ className: 'col-span-1' }}
                    >
                        <Pr onPress={() => router.push('/(in)/events/following')} className="h-full flex-col justify-between items-center">
                            <Urbanist className="text-[#212121] text-[25px] font-bold">
                                20
                            </Urbanist>
                            <Urbanist className="text-[#616161] text-[14px] font-medium">
                                Following
                            </Urbanist>
                        </Pr>
                    </GridItem>
                </Grid>
                {/* Events, Followers, Following */}

                {/* Follow, Messsage */}
                <Tv className="w-full flex-row gap-[12px]">
                    <Btn
                        container={{
                            className: `flex-1 flex-row gap-[8px] items-center px-[16px] border-[2px] border-[#73138C] bg-[#73138C]`,
                            style: [view.wAuto, view.h(40)]
                        }}
                        text={{
                            children: 'Follow',
                            style: [text.color('white')]
                        }}
                        leftIcon={<PersonPlus />}
                    />
                    <Btn
                        container={{
                            className: `flex-1 flex-row gap-[8px] items-center px-[16px] border-[2px] border-[#73138C] bg-white`,
                            style: [view.wAuto, view.h(40)]
                        }}
                        text={{
                            children: 'Message',
                            style: [text.color('#73138C')]
                        }}
                        leftIcon={<Message />}
                    />
                </Tv>
                {/* Follow, Messsage */}

                {/* Tabs */}
                <Tv className="w-full flex-1 bg-green-700">
                    <Tab.Navigator
                        screenOptions={{
                            swipeEnabled: true,
                            tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme ?? 'light'].tint },
                            tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
                        }}
                    >
                        <Tab.Screen
                            name="events"
                            options={{
                                tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(focused ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text), focused ? text.bold : text.semiBold]} className="">
                                    Events
                                </Urbanist>)
                            }}
                            component={Events} />
                        <Tab.Screen
                            name="posts"
                            options={{
                                tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(focused ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text)]} className="">
                                    Posts
                                </Urbanist>)
                            }}
                        >
                            {() => (
                                <Posts posts={[]} />
                            )}
                        </Tab.Screen>
                        <Tab.Screen
                            name="about"
                            options={{
                                tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(focused ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text)]} className="">
                                    About
                                </Urbanist>)
                            }}
                            component={About} />
                    </Tab.Navigator>
                </Tv>
                {/* Tabs */}

                <Tv className="w-full h-[100px] bg-white" />
            </Container>
        </Tv>
    );
}

export default Organizer;