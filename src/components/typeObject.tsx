
import type {ObjectLiteral} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { Property } from "../partials/Property";

export function render(gen: Generator, type: ObjectLiteral) {
    return <span class="monospace">&#123;{type.properties.map(prop => Property(gen, prop, false)).join(", ")}&#125;</span>
}