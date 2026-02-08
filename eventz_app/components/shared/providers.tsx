import { persistor, store } from "@/state/state";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GluestackUIProvider } from "../ui/gluestack-ui-provider";



const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GluestackUIProvider mode="light">
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <KeyboardProvider>
                {children}
              </KeyboardProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
