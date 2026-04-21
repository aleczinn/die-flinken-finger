import { SbBlokData } from "@storyblok/react";

const LCP_SEARCH_LIMIT = 2;
const COMPONENTS_WITH_LCP_IMAGE = new Set([
    'hero',
    'media_with_text'
]);

export function findLcpBlockIndex(blocks: SbBlokData[] | undefined): number {
    if (!blocks) return -1;
    for (let i = 0; i < Math.min(blocks.length, LCP_SEARCH_LIMIT); i++) {
        if (COMPONENTS_WITH_LCP_IMAGE.has(blocks[i].component ?? '')) {
            return i;
        }
    }
    return -1;
}