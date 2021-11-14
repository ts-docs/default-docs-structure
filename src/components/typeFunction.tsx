
import type { FunctionSignature } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { FunctionHead } from "../partials/FunctionHead";

export function render(gen: Generator, type: FunctionSignature) {
    return FunctionHead(gen, true, type);
}