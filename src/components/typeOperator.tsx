
import type { Type } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: {name: string, type: Type}) {
    return <span>
        <span class="keyword">{type.name} </span>{" "}
        {gen.generateType(type.type)}
    </span>
}