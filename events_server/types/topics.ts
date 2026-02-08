import { iEvent } from "./event";


export interface iTopic {
    id: string,
    title: string,
    description: string,
    category: iEvent['category'],
}