import { ActivityIndicator } from "react-native";
import useInter from "./use-urbanist";

export default function useGoogleFonts() {
  const { urbanistLoaded } = useInter();

  if (!urbanistLoaded) return <ActivityIndicator />;

  return null;
}
