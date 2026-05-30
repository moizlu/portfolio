import type { Snippet, Component } from "svelte";

import type { SectionName } from "$lib/types";

export const getSectionName = (id: SectionName | ""): SectionName => {
    if (id === "") { return "home"; }
    return id;
}

export const isComponent = (contents: Snippet | Component | undefined): contents is Component => {
    return (contents !== undefined) && ('element' in contents);
}
