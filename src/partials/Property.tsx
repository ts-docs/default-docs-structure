import type { ObjectProperty } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { RealName } from "./RealName";

export function Property(gen: Generator, prop: ObjectProperty, isInterface: boolean) {
    if (!isInterface) {
        if (prop.prop) {
            return <span class="item-name">
                <span class="property-name">{RealName(gen, prop.prop)}</span>
                {prop.prop.isOptional ? <span class="symbol">?</span> : ""}
                <span class="symbol">: </span>
                {gen.generateType(prop.prop.type!)}
            </span>
        }
        else if (prop.index) {
            return <span class="item-name">[key<span class="symbol">: </span>{gen.generateType(prop.index.key!)}]<span class="symbol">: </span> {gen.generateType(prop.index.type)}</span>
        } 
        else if (prop.call) return gen.generateConstructType(prop.call, false);
        else if (prop.construct) return gen.generateConstructType(prop.construct, true);
    } else {
        let full = "";
        const [blockComment, inlineComment] = gen.generateComment(prop.jsDoc, true) || [undefined, ""];
        if (prop.prop) {
            full += <div class="item" id={`.${prop.prop.rawName}`}>
                <span class="item-name">
                    {prop.prop.isReadonly ? <span class="modifier">readonly </span> : ""}
                    <a class="property-name" href={`#.${prop.prop.rawName}`}>{RealName(gen, prop.prop)}</a>
                    {prop.prop.isOptional ? <span class="symbol">?</span> : ""}
                    <span class="symbol">: </span>{gen.generateType(prop.prop.type!)}
                </span>
                {inlineComment}
            </div>
        }
        else if (prop.index) {
            full += <div class="item">
                <span class="item-name">[key<span class="symbol">: </span> {gen.generateType(prop.index.key!)}]<span class="symbol">: </span> {gen.generateType(prop.index.type)}</span>
                {inlineComment}
            </div>
        } 
        else if (prop.call) full += <div class="item">{gen.generateConstructType(prop.call, false)}</div>;
        else if (prop.construct) full += <div class="item">{gen.generateConstructType(prop.construct, true)}</div>
        return full + (blockComment ? <div class="docblock">{blockComment}</div> : "")
    }
}