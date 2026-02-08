import ChevronRightThin from "@/components/in/events/svg/chevron-right-thin";
import Message from "@/components/in/events/svg/message";
import About from "@/components/in/events/tabs/about";
import Events from "@/components/in/events/tabs/events";
import Posts from "@/components/in/events/tabs/posts";
import Person from "@/components/in/home/svgs/person";
import PersonPlus from "@/components/in/profile/erson-plus";
import Invite from "@/components/in/profile/svg/invite";
import Logout from "@/components/in/profile/svg/logout";
import Payment from "@/components/in/profile/svg/payment";
import Security from "@/components/in/profile/svg/security";
import Bell from "@/components/in/svgs/bell";
import Ticket from "@/components/in/svgs/tabs/ticket";
import Calendar from "@/components/onboarding/setup/svgs/calendar";
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
import useAuth from "@/hooks/auth/useAuth";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { text } from "@/styles/text";
import { view } from "@/styles/view";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { router } from "expo-router";
import { FlatList } from "react-native";

const Profile = () => {
    const { logout, user } = useAuth();
    const colorScheme = useColorScheme();
    const { insets } = useSafeAreaView();

    const signout = () => {
        logout();
        // router.replace('/(onboarding)/signin')
    }


    return (
        <Tv className="w-full h-full bg-white" style={[view.mb(insets.bottom + insets.bottom)]}>
            <Container className="pt-[10px] h-auto flex-col items-center gap-[16px]"
            >
                <Img className="w-[90px] h-[90px] rounded-full" source={{ uri: user?.picture }} />

                <Urbanist className="text-[#212121] text-[27px] font-bold">
                    {user?.userName}
                </Urbanist>

                {/* Divider */}
                <Tv className="w-full h-[1px] bg-[#EEEEEE]" />
                {/* Divider */}

                {/* Events, Followers, Following */}
                <Grid className="h-[55px] gap-[0px]" _extra={{ className: 'grid-cols-3 h-[72px]', }}>
                    <GridItem
                        className="h-full"
                        _extra={{ className: 'col-span-1' }}
                    >
                        <Pr
                            onPress={() => router.push('/(in)/profile/events')}
                            className="h-full flex-col justify-between items-center border-r border-r-[#EEEEEE]">
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

                {/* Divider */}
                <Tv className="w-full h-[1px] bg-[#EEEEEE]" />
                {/* Divider */}

                <Pr className="w-full h-[28px] flex-row items-center gap-[20px]">
                    <Calendar color="#212121" />
                    <Urbanist className="flex-1 text-[#212121] text-[18px] font-semibold">Manage Events</Urbanist>
                    <ChevronRightThin />
                </Pr>

                {/* Divider */}
                <Tv className="w-full h-[1px] bg-[#EEEEEE]" />
                {/* Divider */}

                {[
                    {
                        icon: <Person />,
                        label: 'Profile',
                        action: () => {
                            router.push('/(in)/profile/profile')
                        }
                    },
                    {
                        icon: <Bell />,
                        label: 'Notification',
                        action: () => { }
                    },
                    {
                        icon: <Payment />,
                        label: 'Payments',
                        action: () => { }
                    },
                    {
                        icon: <Ticket />,
                        label: 'Ticket Issues',
                        action: () => { }
                    },
                    {
                        icon: <Security />,
                        label: 'Security',
                        action: () => { }
                    },
                    {
                        icon: <Invite />,
                        label: 'Invite Friends',
                        action: () => { }
                    },
                ].map(({ action, icon, label }, index) => (
                    <Pr onPress={action} className="w-full h-[28px] flex-row items-center gap-[20px]" key={index}>
                        {icon}
                        <Urbanist className="flex-1 text-[#212121] text-[18px] font-semibold">
                            {label}
                        </Urbanist>
                        <ChevronRightThin />
                    </Pr>
                ))}

                <Pr onPress={signout} className="w-full h-[28px] flex-row items-center gap-[20px]">
                    <Logout />
                    <Urbanist className="flex-1 text-[#F75555] text-[18px] font-semibold">
                        Logout
                    </Urbanist>
                </Pr>

                <Tv className="w-full h-[100px] bg-white" />
            </Container>
        </Tv>
    );
}

export default Profile;