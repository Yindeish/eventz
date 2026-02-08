import { GoogleGenAI } from "@google/genai";

const API_KEY_TEST = 'AIzaSyDMR4_7B6ZUH1E83meQ1yW0gKHN6_0fF3c';
const API_KEY = 'AIzaSyDzhthyN-hW2T3EDW-3P0xBqbKsPbpKrJs';

export const ai = new GoogleGenAI({
    apiKey: API_KEY,
});
