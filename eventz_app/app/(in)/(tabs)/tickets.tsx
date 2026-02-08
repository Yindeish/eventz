import Post, { iPost } from "@/components/in/post";
import PostSvg from "@/components/in/home/svgs/post";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import { useSheetRef } from "@/components/shared/sheet";
import SheetModal from "@/components/shared/sheet-modal";
import { Tv } from "@/components/shared/view";
import { useCallback, useEffect, useState } from "react";
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
import Upcoming from "@/components/in/tickets/tabs/upcoming";
import { iTicket } from "@/state/types/create-event";
import { collection } from "firebase/firestore";
import { collections } from "@/firebase-web/services/collections";
import useAuth from "@/hooks/auth/useAuth";


const Tab = createMaterialTopTabNavigator();

const Tickets = () => {
    const sheet = useSheetRef();
    const colorScheme = useColorScheme();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // All tickets belonging to user
    const [allTickets, setAllTickets] = useState<iTicket[]>([]);

    // Split tickets by status
    const upcomingTickets = allTickets.filter(t => t?.status === 'pending' || t?.status === 'paid');
    const completedTickets = allTickets.filter(t => t?.status === 'completed');
    const cancelledTickets = allTickets.filter(t => t?.status === 'cancelled');

    const fetchUserTickets = useCallback(async (isRefresh = false) => {
        if (!user?.id) {
            setAllTickets([]);
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            // Prefer querying tickets by userId if the collection stores this field
            let tickets: Partial<iTicket & { id: string }>[] = [];

            try {
                // try to fetch by 'userId' field (many apps store purchaser as userId)
                tickets = await collections.ticket.findByField('userId' as any, user.uId as any);
            } catch (e) {
                // If findByField fails (e.g. no such field/index), fall back to getAll and filter
                console.log("findByField ticket by userId failed, falling back to getAll", e);
            }

            if (!tickets || tickets.length === 0) {
                const all = await collections.ticket.getAll();
                // attempt to filter by possible fields that might hold user reference
                const filtered = (all || []).filter((t: any) =>
                    t?.userId === user.id ||
                    t?.buyerId === user.id ||
                    t?.purchaserId === user.id ||
                    (t?.user && (t.user.id === user.id || t.user.id === user.id)) ||
                    (t?.userId === user.id) // fallback to Redux user id if needed
                );
                tickets = filtered;
            }

            // Normalize tickets into app iTicket shape where possible
            const normalized = (tickets || []).map((t: any) => ({
                id: t.id || t?.ticketId || '',
                eventId: t.eventId || t?.event?.id || '',
                event: t.event || t?.event || undefined,
                type: t.type || t?.ticketType || 'free',
                status: t.status || 'pending',
                price: typeof t.price === 'number' ? t.price : (t?.price ? Number(t.price) : 0),
                quantity: t.quantity || 1,
            })) as iTicket[];

            setAllTickets(normalized);
        } catch (err) {
            console.log("fetchUserTickets error", err);
            setAllTickets([]);
        } finally {
            if (isRefresh) setRefreshing(false);
            else setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUserTickets();
    }, [fetchUserTickets]);

    const onRefresh = async () => {
        await fetchUserTickets(true);
    };

    return (
        <Tv className="flex-1 flex-col gap-[12px] bg-white">
            <Container className="bg-white">
                {/* Tabs */}
                <Tab.Navigator
                    screenOptions={{
                        swipeEnabled: true,
                        tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme ?? 'light'].tint },
                        tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
                    }}
                >
                    <Tab.Screen
                        name="upcoming"
                        options={{
                            tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(focused ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text), focused ? text.bold : text.semiBold]} className="">
                                Upcoming
                            </Urbanist>)
                        }}
                        component={() => <Upcoming tickets={allTickets.filter((t) => t?.status === 'pending' || t?.status === 'paid')} loading={loading} onRefresh={() => fetchUserTickets(false)} />} />
                    <Tab.Screen
                        name="completed"
                        options={{
                            tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(focused ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text)]} className="">
                                Completed
                            </Urbanist>)
                        }}
                        component={() => <Upcoming tickets={allTickets.filter((t) => t?.status === 'completed')} loading={loading} onRefresh={() => fetchUserTickets(false)} />} />
                    <Tab.Screen
                        name="cancelled"
                        options={{
                            tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(focused ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text)]} className="">
                                Cancelled
                            </Urbanist>)
                        }}
                        component={() => <Upcoming tickets={allTickets.filter((t) => t?.status === 'cancelled')} loading={loading} onRefresh={() => fetchUserTickets(false)} />} />
                </Tab.Navigator>
                {/* Tabs */}
            </Container>
        </Tv>
    );
}

export default Tickets;