import { atom } from "jotai";

export const categoryAtom = atom<string | null>(null);
export const availabilityAtom = atom<string | null>(null);
export const sortByAtom = atom<string | null>(null);
export const searchAtom = atom<string>("");
