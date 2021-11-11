
import type { ConstructorType, FunctionSignature } from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";
import { FunctionHead } from "../partials/FunctionHead";

export function render(gen: Generator, staticData: StaticDocumentationData, type: { fn: FunctionSignature | ConstructorType, includeNew: boolean }) {
    return <span class="monospace">
        {type.includeNew ? <span class="keyword">new </span> : ""}
        {FunctionHead(gen, true, type.fn)}
    </span>
}