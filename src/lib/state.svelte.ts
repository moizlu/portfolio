import { browser } from "$app/environment";

import type { SectionName } from "./types";

let _isModalOpened = $state(false);
let _activeSectionId: SectionName = $state("home");

export const isModalOpened = () => {
    return _isModalOpened;
}
export const setModalOpened = (value: boolean) => {
    _isModalOpened = value;

    if (browser) {
        if (_isModalOpened) {
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
