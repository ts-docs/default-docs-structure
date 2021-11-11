
import type { FunctionSignature } from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";
import { FunctionHead } from "../partials/FunctionHead";

export function render(gen: Generator, staticData: StaticDocumentationData, type: FunctionSignature) {
    return FunctionHead(gen, true, type);
}