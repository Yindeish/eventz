import { iEvent, iFeed, iTrending } from "./create-event";


export interface iSearchSlice {
    currentFeed: iFeed | null,
    currentTrending: iTrending | null,
}