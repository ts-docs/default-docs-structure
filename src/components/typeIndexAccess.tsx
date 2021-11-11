import type {IndexAccessedType} from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";

export function render(gen: Generator, staticData: StaticDocumentationData, types: IndexAccessedType) {
    return <span class="item-name">
        {gen.generateType(types.object)}[{gen.generateType(types.index)}]
    </span>
}