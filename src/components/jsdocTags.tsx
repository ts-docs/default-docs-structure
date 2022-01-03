
import { Type } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: {
    tagName: string,
    comment?: string,
    arg: string,
    type: Type
}) {
    switch (type.tagName) {
        case "example":
            return { block: <><h3 class="section-header">Example</h3>{type.comment}</> }
        case "returns":
            return { block: <><h3 class="section-header">Returns</h3>{type.comment}</> }
        case "param":
            return { block: <div class="no-p">· <span class="item-name"><span class="param-name">{type.arg}</span> - <span>{type.comment}</span></span></div> }
        case "deprecated":
            return type.comment ? { block: <><h3 class="section-header" style="color:red">Deprecated</h3>{type.comment}</> } : { inline: <span class="badge danger">deprecated</span> };
        case "beta":
            return { inline: <span class="badge danger">beta</span> };
        case "since":
            if (!type.comment) return "";
            return { inline: <span class="badge warning">since {type.comment}</span> };
        default:
            return "";
    }
}