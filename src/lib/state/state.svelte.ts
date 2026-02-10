import { browser } from "$app/environment";
import { sectionIndexes, type SectionName } from "$lib/types";

export class SectionStateManager {
    public get activeSection() { return this._activeSectionId; }
    public get targetSection() { return this._targetSectionId; }
    public set activeSection(id: SectionName) { this._activeSectionId = id; }
    public setActiveSectionByIndex(index: number) { this._activeSectionId = sectionIndexes[index]; }
    public set targetSection(id: SectionName) { this._targetSectionId = id; }

    public isActive(id: SectionName) { return this._activeSectionId === id; }
    public getIndex(id: SectionName) { return sectionIndexes.findIndex((section) => section === id); }

    private _activeSectionId: SectionName = $state('home');
    private _targetSectionId: SectionName = $state('home');
}

export class TurnstileStateManager {
    public get isVerified() { return this._isVerified; }
    public set isVerified(value: boolean) { this._isVerified = value; }
    private _isVerified: boolean = $state(false);
}

export class ScrollStateManager {
    public constructor(sectionStateManager: SectionStateManager) {
        this._sectionStateManager = sectionStateManager;

        if (!browser) { return; }

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', () => {
                this.isScrollingProgrammatically = true;
                // this._sectionStateManager.targetSection = (anchor as HTMLAnchorElement).href.split('#')[1] as SectionName;
            });
        });

        document.addEventListener('scrollend', () => {
            this.isScrollingProgrammatically = false;
        });
    }

    public get isScrollingProgrammatically() {
        return this._isScrollingProgrammatically;
    }

    private set isScrollingProgrammatically(value: boolean) {
        this._isScrollingProgrammatically = value;
    }

    private _isScrollingProgrammatically = $state(false);
    private _sectionStateManager;
}

export const sectionState = new SectionStateManager();
export const turnstileState = new TurnstileStateManager();
export const scrollState = new ScrollStateManager(sectionState);
