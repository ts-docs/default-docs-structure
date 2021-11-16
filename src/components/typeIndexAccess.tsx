import type {IndexAccessedType} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, types: IndexAccessedType) {
    return <span class="item-name">{gen.generateType(types.object)}[{gen.generateType(types.index)}]</span>
}