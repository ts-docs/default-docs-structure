
import type {ObjectLiteral} from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";
import { Property } from "../partials/Property";

export function render(gen: Generator, staticData: StaticDocumentationData, type: ObjectLiteral) {
    return <span>
        {type.properties.map(prop => Property(gen, prop, false))}
    </span>
}