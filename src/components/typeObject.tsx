
import type {ObjectLiteral} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { Property } from "../partials/Property";
import { isLargeObject } from "../utils";

export function render(gen: Generator, type: ObjectLiteral) {
    return <span class="monospace">&#123;{isLargeObject(type) ? type.properties.map(prop => <div class="left-item">{Property(gen, prop, false)}</div>).join(",<br>") : type.properties.map(prop => Property(gen, prop, false)).join(", ")}&#125;</span>
}