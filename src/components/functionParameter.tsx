
import { FunctionParameter } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: FunctionParameter) {
    return <span class="item-name">
        {type.rest ? <span class="symbol">...</span> : ""}
        <span class="param-name">{type.name}</span>
        {type.isOptional ? <span class="symbol">?</span> : ""}
        {type.type ? <>
            <span class="symbol">: </span>
            {gen.generateType(type.type)}
        </> : ""}
        {type.defaultValue ? <>
            <span class="symbol"> = </span>
            {gen.generateType(type.defaultValue)}
        </> : ""}
    </span>
}