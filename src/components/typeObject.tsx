
import type {ObjectLiteral} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { Property } from "../partials/Property";

export function render(gen: Generator, type: ObjectLiteral) {
    return <span>
        {type.properties.map(prop => Property(gen, prop, false))}
    </span>
}