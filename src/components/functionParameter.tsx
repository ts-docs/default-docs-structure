
import { FunctionParameter } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: FunctionParameter) {
    if (type.jsDoc?.tags.some(t => t.name === "ignore")) return "";
    const comment = type.jsDoc && gen.generateInlineComment([type.jsDoc]);
    return <span>
        {comment ? <><span style="color: gray">/** {comment} */</span><br /></> : ""}
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