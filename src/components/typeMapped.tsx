
import {MappedType, MappedTypeModifiers} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: MappedType) {
    let readonlyState = "";
    if (type.readonly !== undefined) {
        readonlyState = <span class="keyword">readonly </span>;
        if (type.readonly === MappedTypeModifiers.NEGATED) readonlyState = "-" + readonlyState;
    }
    let questionMarkState = "";
    if (type.optional !== undefined) {
        questionMarkState = <span class="symbol">?</span>;
        if (type.optional === MappedTypeModifiers.NEGATED) questionMarkState = "-" + questionMarkState;
    }
    return <span class="item-name">
        {"{"}<br />
        <span style="margin-left: 20px">
            {readonlyState}[{type.typeParameter} 
            <span class="keyword"> in </span> 
            {gen.generateType(type.constraint!)}
            {type.as ? <><span class="keyword"> as </span> {gen.generateType(type.as)}</> : ""}]{questionMarkState}
            <span class="symbol">: </span>{gen.generateType(type.type!)}
        </span>
        <br />{"}"}
    </span>
}