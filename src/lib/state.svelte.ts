import { browser } from "$app/environment";

import type { SectionName } from "./types";

let _isWorkModalOpened = $state(false);
let _activeSectionId: SectionName = $state("home");

export const isWorkModalOpened = () => {
    return _isWorkModalOpened;
}
export const setWorkModalOpened = (value: boolean) => {
    _isWorkModalOpened = value;

    if (browser) {
        if (_isWorkModalOpened) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

    }
}

export const getActiveSectionId = () => {
    return _activeSectionId;
}
export const setActiveSectionId = (id: SectionName) => {
    _activeSectionId = id;
}
