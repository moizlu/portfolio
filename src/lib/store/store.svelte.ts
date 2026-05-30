import { browser } from "$app/environment";
import { resolve } from "$app/paths";
import { goto } from "$app/navigation";

import { sectionIndexes, type SectionName } from "$lib/types";

export const splashHiddenEvent = new Event('splashHidden');

export class SectionStore {
    public get active() { return this._activeSectionId; }
    public get target() { return this._targetSectionId; }
    public get activeIndex() { return this.getIndex(this.active); }
    public set active(id: SectionName) { this._activeSectionId = id; }
    public set activeByIndex(index: number) { this._activeSectionId = sectionIndexes[index]; }
    public set target(id: SectionName | undefined) { this._targetSectionId = id; }

    public goto(id: SectionName | "") {
        if (!id || id === "home") {
            this.target = "home";
            goto(resolve("/"));
            return;
        }

        this.target = id;
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        goto(`#${id}`);
    }

    public isActive(id: SectionName) { return this._activeSectionId === id; }
    public getIndex(id: SectionName) { return sectionIndexes.findIndex((section) => section === id); }

    private _activeSectionId: SectionName = $state('home');
    private _targetSectionId: SectionName | undefined = $state(undefined);
}

export class CaptchaStore {
    public get verified() { return this._verified; }
    public set verified(value: boolean) { this._verified = value; }
    private _verified: boolean = $state(false);
}

export class ScrollStore {
    public constructor(sectionStoreManager: SectionStore) {
        this._sectionStoreManager = sectionStoreManager;

        if (!browser) { return; }

        document.querySelectorAll('a[href="/"], a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                let target = (anchor as HTMLAnchorElement).href.split('#')[1];
                if (!target) {
                    target = "home";
                }

                if (this._sectionStoreManager.active === target) {
                    e.preventDefault();
                    return;
                }

                this._sectionStoreManager.target = target as SectionName;
            });
        });

        document.addEventListener('scrollend', () => {
            if (this._sectionStoreManager.active === this._sectionStoreManager.target) {
                this._sectionStoreManager.target = undefined;
            }
        });
    }

    private _sectionStoreManager;
}

export class SplashStore {
    public get appeared() { return this._appeared; }
    public set appeared(value: boolean) {
        this._appeared = value;

        if (!this._appeared) {
            document.dispatchEvent(splashHiddenEvent);
        }
    }
    private _appeared = $state(true);
}

export class FormActionStore {
    public get submitting() { return this._submitting; }
    public get status() { return this._status; }
    public get type() { return this._type; }

    public set submitting(submitting: boolean) { this._submitting = submitting; }
    public set status(status: number | undefined) { this._status = status; }
    public set type(type: "error" | "success" | "redirect" | "failure" | "none") {
        this._type = type;
    }


    private _submitting = $state(false);
    private _status: number | undefined = $state(undefined);
    private _type: "error" | "success" | "redirect" | "failure" | "none" = $state("none");
}

export const splashStore = new SplashStore();
export const sectionStore = new SectionStore();
export const captchaStore = new CaptchaStore();
export const scrollStore = new ScrollStore(sectionStore);
export const formActionStore = new FormActionStore();
