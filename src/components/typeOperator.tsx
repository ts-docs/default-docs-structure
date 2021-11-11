
import type {Type} from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";

export function render(gen: Generator, staticData: StaticDocumentationData, type: {name: string, type: Type}) {
    return <span>
        <span class="keyword">{type.name}</span>
        {gen.generateType(type.type)}
    </span>
}