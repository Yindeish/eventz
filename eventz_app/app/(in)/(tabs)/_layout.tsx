import { router, Tabs, usePathname } from 'expo-router';
import React, { useEffect } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { text } from '@/styles/text';
import HomeActive from '@/components/in/svgs/tabs/home-active';
import { view } from '@/styles/view';
import { Sav } from '@/components/shared/safe-area-view';
import { Tv } from '@/components/shared/view';
import Urbanist from '@/components/shared/fonts/urbanist';
import Event from '@/components/in/svgs/tabs/event';
import Ticket from '@/components/in/svgs/tabs/ticket';
import Message from '@/components/in/svgs/tabs/message';
import Profile from '@/components/in/svgs/tabs/profile';
import Home from '@/components/in/svgs/tabs/home';
import EventActive from '@/components/in/svgs/tabs/event-active';
import TicketActive from '@/components/in/svgs/tabs/ticket-active';
import { Pr } from '@/components/shared/pressable';
import Search from '@/components/in/svgs/search';
import Bell from '@/components/in/svgs/bell';
import Plus from '@/components/in/home/svgs/plus';
import { useSheetRef } from '@/components/shared/sheet';
import SheetModal from '@/components/shared/sheet-modal';
import Post from '@/components/in/home/svgs/post';
import { Input, InputField } from '@/components/ui/input';
import Container from '@/components/shared/container';
import { Db } from '@/firebase-web/services/firestore.service';
import { iUser } from '@/state/types/auth';
import Options from '@/components/in/profile/svg/options';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const path = usePathname()
  const sheet = useSheetRef()

  const isHome = ['/', '/index/explore', '/index/following', '/index/communities'].some((route) => route === path);

  const isEvent = ['/events',].some((route) => route === path);

  return (
    <Sav>
      <Tv className='w-full h-full relative'>

        {/* Floating Action Btns */}
        {(isHome) && (
          <Pr onPress={sheet.open} className='w-[40px] h-[40px] flex-row items-center justify-center bg-[#73138C] rounded-[4px] absolute bottom-[65px] right-[24px] z-50'>
            <Plus />
          </Pr>
        )}

        {/* {(isEvent) && (
          <Pr onPress={sheet.open} className='w-fit h-[58px] flex-row items-center justify-center bg-[#73138C] px-[20px] rounded-full absolute bottom-[65px] right-[24px] z-50'>
            <Urbanist className='text-white text-[16px] font-bold'>Discover Happening!</Urbanist>
          </Pr>
        )} */}
        {/* Floating Action Btns */}

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            headerShadowVisible: false,
            tabBarStyle: [view.shadowXY(0, 0), view.shadowElevation(0), view.shadowColor('white'), view.borderWidth(0), view.borderColor('white'), view.h(52)]
          }}>
          <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: ({ focused }) => (focused) ? <HomeActive /> : <Home />,
              tabBarLabel: ({ color, focused }) => (
                <Urbanist weight='700' className={`text-[10px] ${focused ? 'font-bold' : 'font-medium'}`} style={[text.color(color)]}>Home</Urbanist>
              ),
              headerShown: true,
              header: ({ }) => (
                <Tv className='w-full h-[55px] bg-white px-[24px] flex-row items-center gap-[12px] pb-[16px]'>
                  <Urbanist onPress={sheet.open} className='flex-1 text-[16px] font-semibold'>Create Happening!</Urbanist>

                  <Pr onPress={() => router.push('/home/search')} className='p-[2px]'>
                    <Search />
                  </Pr>

                  {/* <Pr className='p-[2px] relative'>
                    <Tv className='w-[11px] h-[10px] flex-row items-center justify-center rounded-full bg-[#F75555] absolute top-0 right-0 z-2'>
                      <Urbanist className='text-[6px] text-white font-medium'>1</Urbanist>
                    </Tv>
                    <Bell />
                  </Pr> */}
                </Tv>
              )
            }}
          />

          <Tabs.Screen
            name="events"
            options={{
              tabBarIcon: ({ focused }) => (focused) ? <EventActive /> : <Event />,
              tabBarLabel: ({ color, focused }) => (
                <Urbanist weight='700' className={`text-[10px] ${focused ? 'font-bold' : 'font-medium'}`} style={[text.color(color)]}>Events</Urbanist>
              ),
              headerShown: true,
              header: ({ }) => (
                <Tv className='w-full h-[55px] bg-white px-[24px] flex-row items-center gap-[12px] pb-[16px]'>
                  <Urbanist className='flex-1 text-[16px] font-semibold'>Create Event</Urbanist>

                  <Pr onPress={() => router.push('/home/search')} className='p-[2px]'>
                    <Search />
                  </Pr>

                  {/* <Pr className='p-[2px] relative'>
                    <Tv className='w-[11px] h-[10px] flex-row items-center justify-center rounded-full bg-[#F75555] absolute top-0 right-0 z-2'>
                      <Urbanist className='text-[6px] text-white font-medium'>1</Urbanist>
                    </Tv>
                    <Bell />
                  </Pr> */}
                </Tv>
              )
            }}
          />

          <Tabs.Screen
            name="tickets"
            options={{
              tabBarIcon: ({ focused }) => (focused) ? <TicketActive /> : <Ticket />,
              tabBarLabel: ({ color, focused }) => (
                <Urbanist weight='700' className={`text-[10px] ${focused ? 'font-bold' : 'font-medium'}`} style={[text.color(color)]}>Tickets</Urbanist>
              ),
              headerShown: true,
              header: ({ }) => (
                <Tv className='w-full h-[55px] bg-white px-[24px] flex-row items-center gap-[12px] pb-[16px]'>
                  <Urbanist className='flex-1 text-[16px] font-semibold'>Tickets</Urbanist>

                  {/* <Pr onPress={() => router.push('/(in)/tickets/search')} className='p-[2px]'>
                    <Search />
                  </Pr> */}
                </Tv>
              )
            }}
          />

          <Tabs.Screen
            name="message"
            options={{
              tabBarIcon: ({ color }) => <Message />,
              tabBarLabel: ({ color, focused }) => (
                <Urbanist weight='700' className={`text-[10px] ${focused ? 'font-bold' : 'font-medium'}`} style={[text.color(color)]}>Message</Urbanist>
              ),
              headerShown: true,
              headerShadowVisible: false,
              header: () => (
                <Tv className='w-full h-[112px] flex-col bg-white'>
                  <Container className='h-full flex-col items-center gap-[20px]'>
                    <Tv className='flex-1 flex-row items-end'>
                      <Urbanist className='text-[#2A2A2A] text-[16px] font-semibold text-center'>Messages</Urbanist>
                    </Tv>

                    <Tv className={`w-full h-[50px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] rounded-[16px] mt-[2px]`}>
                      <Search />
                      <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                      >
                        <InputField className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Search.." />
                      </Input>
                    </Tv>
                  </Container>
                </Tv>
              )
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              tabBarIcon: ({ color }) => <Profile />,
              tabBarLabel: ({ color, focused }) => (
                <Urbanist weight='700' className={`text-[10px] ${focused ? 'font-bold' : 'font-medium'}`} style={[text.color(color)]}>Profile</Urbanist>
              ),
              headerShown: true,
              headerShadowVisible: false,
              header: () => (
                <Tv className='w-full h-[55px] bg-white px-[24px] flex-row items-center gap-[12px] pb-[16px]'>
                  <Urbanist className='flex-1 text-[16px] font-semibold'>Profile</Urbanist>

                  <Pr onPress={() => { }} className='p-[2px]'>
                    <Options />
                  </Pr>
                </Tv>
              )
            }}
          />

        </Tabs>

        {/* Sheets */}
        <SheetModal
          ref={sheet.ref}
          snapPoints={[211]}
          allowSwipeDown={true}
          closeOnBackdropPress={true}
        >
          <Tv className="w-full min-h-[211px] flex-col rounded-tr-[20px] rounded-tl-[20px] bg-white">
            <Tv className="w-full h-[58px] flex-row items-center pt-[20px] px-[24px] pb-[16px] border-b-[0.5px] border-b-[#9E9E9E]">
              <Urbanist className="text-[16px] font-medium">Choose Option</Urbanist>
            </Tv>

            <Tv className="w-full flex-1 flex-col gap-[16px] pt-[16px] px-[24px]">
              {[
                {
                  label: 'Create an Event',
                  icon: <Event />,
                  action: () => {
                    sheet.close()
                    router.push('/home/create-event')
                  }
                },
                {
                  label: 'Create a Post',
                  icon: <Post />,
                  action: () => {
                    sheet.close()
                    router.push('/home/create-post')
                  }
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
        </SheetModal>
        {/* Sheets */}
      </Tv>
    </Sav>
  );
}
