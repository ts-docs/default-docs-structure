
import type {ObjectLiteral} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { Property } from "../partials/Property";
import { isLargeObject } from "../utils";

export function render(gen: Generator, type: ObjectLiteral) {
    return <span class="monospace">&#123;{isLargeObject(type) ? <div class="left-item">{type.properties.map(prop => Property(gen, prop, false)).join(",<br>")}</div> : type.properties.map(prop => Property(gen, prop, false)).join(", ")}&#125;</span>
}