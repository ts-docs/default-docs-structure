import type {Tuple} from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";

export function render(gen: Generator, staticData: StaticDocumentationData, types: Tuple) {
    return <span>
        [{types.types.map(t => gen.generateType(t)).join(", ")}]
    </span>
}