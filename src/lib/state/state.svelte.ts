import type { SectionName } from "../types";

export const sectionState = $state({
    _activeSectionId: 'home' as SectionName,
    getActiveSectionId: () => sectionState._activeSectionId,
    setActiveSectionId: (id: SectionName) => sectionState._activeSectionId = id
});
