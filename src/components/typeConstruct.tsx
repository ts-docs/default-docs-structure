
import type { ConstructorType, FunctionSignature } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { FunctionHead } from "../partials/FunctionHead";

export function render(gen: Generator, type: { fn: FunctionSignature | ConstructorType, includeNew: boolean }) {
    return <span class="monospace">
        {type.includeNew ? <span class="keyword">new </span> : ""}
        {FunctionHead(gen, true, type.fn)}
    </span>
}