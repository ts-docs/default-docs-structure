import { UnionOrIntersection } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { isComplexType } from "../utils";

export function render(gen: Generator, types: UnionOrIntersection) {
    return <span>
        {types.types.map(t => isComplexType(t) ? `(${gen.generateType(t)})` : gen.generateType(t)).join(<span class='symbol'> & </span>)}
    </span>
}