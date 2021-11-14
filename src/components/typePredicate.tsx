
import type {TypePredicateType} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: TypePredicateType) {
    return <span>
        {typeof type.parameter === "string" ? type.parameter : gen.generateType(type.parameter)}
        <span class="keyword"> is </span>
        {gen.generateType(type.type)}
    </span>
}