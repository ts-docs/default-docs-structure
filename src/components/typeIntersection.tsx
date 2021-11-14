import type {UnionOrIntersection} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, types: UnionOrIntersection) {
    return <span>
        {types.types.map(t => gen.generateType(t)).join(<span class='symbol'> & </span>)}
    </span>
}