
import type {TypePredicateType} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, {parameter, type}: TypePredicateType) {
    return <span>
        {typeof parameter === "string" ? parameter : gen.generateType(parameter)}
        <span class="keyword"> is </span>
        {type ? gen.generateType(type) : ""}
    </span>
}