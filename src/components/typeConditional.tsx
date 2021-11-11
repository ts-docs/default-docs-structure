
import type { ConditionalType } from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";

export function render(gen: Generator, staticData: StaticDocumentationData, type: ConditionalType) {
    return <span class="item-name">
        {gen.generateType(type.checkType)} 
        <span class="keyword">extends</span>
        {gen.generateType(type.extendsType)} 
        <span class="symbol">?</span>
        {gen.generateType(type.trueType)}
        <span class="symbol">:</span>
        {gen.generateType(type.falseType)}
    </span>
}