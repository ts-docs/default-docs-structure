
import type { FunctionParameter, Type, TypeParameter } from "@ts-docs/extractor";
import { Generator } from "@ts-docs/ts-docs";
import { isLargeSignature } from "../utils";


export function FunctionHead(gen: Generator, arrow: boolean, thing: {parameters?: Array<FunctionParameter>, returnType?: Type, typeParameters?: Array<TypeParameter>}) {
    return <span class="item-name">
        {thing.typeParameters ? <span>&lt;{thing.typeParameters.map(p => gen.generateTypeParameter(p)).join(", ")}&gt;</span> : ""}
        <>({thing.parameters ? ( isLargeSignature(thing) ? <div class="left-item">{thing.parameters.map(p => gen.generateParameter(p)).join(",<br>")}</div> : thing.parameters.map(p => gen.generateParameter(p)).join(", ")) : ""})</>
        {thing.returnType ? <>
            {arrow ? <span class="symbol"> =&gt; </span> : <span>: </span>}
            {gen.generateType(thing.returnType)}
        </> : ""}
    </span>
}