
import type {TypePredicateType} from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";

export function render(gen: Generator, staticData: StaticDocumentationData, type: TypePredicateType) {
    return <span>
        {typeof type.parameter === "string" ? type.parameter : gen.generateType(type.parameter)}
        <span class="keyword"> is </span>
        {gen.generateType(type.type)}
    </span>
}