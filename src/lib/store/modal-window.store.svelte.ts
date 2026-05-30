import type { Component, Snippet } from "svelte";
import type { ClassValue } from "svelte/elements";

import { browser } from "$app/environment";

export const modalWindowOpenEvent = new Event('modalWindowOpen');
export const modalWindowCloseEvent = new Event('modalWindowClose');

interface Data {
    contents: Snippet | Component;
    lock?: boolean;

    backgroundEffects?: boolean | {
        blur?: boolean,
        contrast?: boolean
    };

    window?: boolean | {
        mode?: 'fullscreen' | 'window' | 'none',
        controls?: boolean,
        square?: boolean
    }

    title?: string | Snippet | Component;
    class?: ClassValue;

    priority?: number;
}

export class ModalWindowManager {
    public constructor() { }

    public open(data: Data): boolean {
        if (!browser) { return false; }

        if (this._data && ((this._data.priority ?? 0) < (data.priority ?? 0))) {
            return false;
        }

        if (data.backgroundEffects === undefined) { data.backgroundEffects = true; }
        if (data.window === undefined) { data.window = true; }

        document.body.classList.add("overflow-hidden");
        this._data = undefined; // 初期化
        this._data = data;

        this._opened = true;
        document.dispatchEvent(modalWindowOpenEvent);

        return true;
    }

    public close() {
        if (!browser) { return; }

        // this._data = undefined;
        document.body.classList.remove("overflow-hidden");

        this._opened = false;
        document.dispatchEvent(modalWindowCloseEvent);
    }

    public get data() {
        return this._data;
    }

    public get opened() {
        return this._opened;
    }

    private _data: Data | undefined = $state(undefined);
    private _opened: boolean = $state(false);
}

export const modalWindow = new ModalWindowManager();
