
import type {TypeParameter} from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";

export function render(gen: Generator, staticData: StaticDocumentationData, type: TypeParameter) {
    return <span>
        {type.name}
        {type.constraint ? <span><span class="symbol">:</span> {gen.generateType(type.constraint)}</span>:""}
        {type.default ? <span><span class="symbol">=</span> {gen.generateType(type.default)}</span>:""}
    </span>
}