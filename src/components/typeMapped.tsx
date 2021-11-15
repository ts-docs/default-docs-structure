
import type {MappedType} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: MappedType) {
    return <span class="item-name">
        {"{["}{type.typeParameter} <span class="keyword"> in </span> {gen.generateType(type.constraint!)}]<span class="symbol">: </span> {gen.generateType(type.type!)} {"}"}
    </span>
}