
import type { FunctionParameter, Type, TypeParameter } from "@ts-docs/extractor";
import { Generator } from "@ts-docs/ts-docs";


export function FunctionHead(gen: Generator, arrow: boolean, thing: {parameters?: Array<FunctionParameter>, returnType?: Type, typeParameters?: Array<TypeParameter>}) {
    return <span class="monospace">
        {thing.typeParameters ? <span>&lt;{thing.typeParameters.map(p => gen.generateTypeParameter(p))}&gt;</span> : ""}
        ({thing.parameters ? thing.parameters.map(p => gen.generateParameter(p)) : ""})
        {thing.returnType ? <>
            {arrow ? <span class="symbol">=&gt; </span> : <span>:</span>}
            {gen.generateType(thing.returnType)}
        </> : ""}

    </span>
}