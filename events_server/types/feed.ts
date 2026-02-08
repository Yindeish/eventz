import { iEvent } from "./event";


export interface iFeed {
    id: string,
    headline: string,
    summary: string,
    events: iEvent[]
}