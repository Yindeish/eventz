import Post, { iPost } from "@/components/in/post";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Tv } from "@/components/shared/view";
import { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Explore from "@/components/in/home/explore";
import Following from "@/components/in/home/following";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { text } from "@/styles/text";
import { collections } from "@/firebase-web/services/collections";
import useAuth from "@/hooks/auth/useAuth";
import * as Burnt from "burnt";
import Communities from "@/components/in/home/communities";
import { burnt } from "@/components/shared/burnt";

const Tab = createMaterialTopTabNavigator();

const Index = () => {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [allPosts, setAllPosts] = useState<(iPost & { id: string })[]>([]);
  const [allFollowingPosts, setAllFollowingPosts] = useState<(iPost & { id: string })[]>([]);
  const [allFilteredFollowingPosts, setAllFilteredFollowingPosts] = useState<(iPost & { id: string })[]>([]);
  const [loadingFollowingPosts, setLoadingFollowingPosts] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<(iPost & { id: string })[]>([]);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const allPostsData = await collections.post.getAll();

      const sorted = (allPostsData || []).sort((a: any, b: any) => {
        const aTime = new Date(a.createdAt || a.startTimeStamp || 0).getTime();
        const bTime = new Date(b.createdAt || b.startTimeStamp || 0).getTime();
        return bTime - aTime;
      });

      const normalized = sorted.map((e: any) => ({
        id: e.id,
        ...e,
        authorImg: e.authorImg || user?.picture || 'https://media.istockphoto.com/id/1481759725/photo/404-error-isolated-on-white-background-page-not-found.webp?a=1&b=1&s=612x612&w=0&k=20&c=queRR4cQt4gV6g-F-CzI0huHd6I0BBPmXH71Gye5wK0=',
        authorName: e.authorName || user?.userName,
        commentsCount: e.commentsCount || 0,
        createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
      })) as (iPost & { id: string })[];

      setAllPosts(normalized);
      setFilteredPosts(normalized);
    } catch (err) {
      console.log("fetch posts error", err);
      Burnt.toast({ title: "Failed to load posts" });
    } finally {
      setLoadingPosts(false);
    }
  }, [user]);

  const fetchFollowingPosts = useCallback(async () => {
    setLoadingFollowingPosts(true);
    try {
      const res = await fetch(`https://eventz-server.vercel.app/api/posts/following/${user?.id}`);

      if (!res?.ok) {
        burnt.toast({ title: 'Error loading posts' })
        return;
      }

      const data = await res.json();
      const sorted = data?.data;
      console.log({ sorted })

      const normalized = sorted.map((e: any) => ({
        id: e.id,
        ...e,
        authorImg: e.authorImg || user?.picture || 'https://media.istockphoto.com/id/1481759725/photo/404-error-isolated-on-white-background-page-not-found.webp?a=1&b=1&s=612x612&w=0&k=20&c=queRR4cQt4gV6g-F-CzI0huHd6I0BBPmXH71Gye5wK0=',
        authorName: e.authorName || user?.userName,
        commentsCount: e.commentsCount || 0,
        createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
      })) as (iPost & { id: string })[];

      setAllFollowingPosts(normalized);
      setAllFilteredFollowingPosts(normalized);
    } catch (err) {
      console.log("fetch posts error", err);
      Burnt.toast({ title: "Failed to load posts" });
    } finally {
      setLoadingFollowingPosts(false);
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      await fetchPosts()
      fetchFollowingPosts()
    })()
  }, [fetchPosts, fetchFollowingPosts]);

  return (
    <Tv className="flex-1 bg-white">
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarIndicatorStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].tint,
          },
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      >
        <Tab.Screen
          name="explore"
          options={{
            tabBarLabel: ({ focused }) => (
              <Urbanist
                style={[
                  text.color(
                    focused
                      ? Colors[colorScheme ?? "light"].tint
                      : Colors[colorScheme ?? "light"].text
                  ),
                  focused ? text.bold : text.semiBold,
                ]}
              >
                Explore
              </Urbanist>
            ),
          }}
        >
          {() => (
            <Explore
              posts={allPosts}
              loading={loadingPosts}
              onRefresh={fetchPosts}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="following"
          options={{
            tabBarLabel: ({ focused }) => (
              <Urbanist
                style={[
                  text.color(
                    focused
                      ? Colors[colorScheme ?? "light"].tint
                      : Colors[colorScheme ?? "light"].text
                  ),
                  focused ? text.bold : text.semiBold,
                ]}
              >
                Following
              </Urbanist>
            ),
          }}
        >
          {() => (
            <Following
              posts={allFollowingPosts}
              loading={loadingFollowingPosts}
              onRefresh={fetchFollowingPosts}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="communities"
          options={{
            tabBarLabel: ({ focused }) => (<Urbanist style={[text.color(focused ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text)]} className="">
              Communities
            </Urbanist>)
          }}
        >
          {() => (
            <Communities
              // posts={allPosts.sort((a, b) => String(b?.createdAt).localeCompare(String(a?.createdAt)))}
              posts={allPosts}
              loading={loadingPosts}
              onRefresh={fetchPosts}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </Tv>
  );
};

export default Index;
