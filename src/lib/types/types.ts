import type { ClassValue } from "svelte/elements";
import type { Component } from "svelte";

export type SectionName = "home" | "profile" | "skill" | "works" | "contact";

export const sectionIndexes: Readonly<SectionName[]> = [
    "home",
    "profile",
    "skill",
    "works",
    "contact"
]

export const SECTION_COUNT = 4;

export interface SvgComponentProps {
    width: number;
    height: number;
    class: ClassValue;
}

export type SvgComponent = Component<SvgComponentProps>;
