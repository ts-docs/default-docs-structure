
import type { FunctionDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { FunctionHead } from "../partials/FunctionHead";

export function render(gen: Generator, type: FunctionDecl) {
    const typeParams = type.signatures[0].typeParameters;
    return <div>
        <h1>Function <span class="referenceLink method-name">{type.name}</span></h1>
        {typeParams ? <p class="item-name">&lt;{typeParams.map(p => gen.generateTypeParameter(p)).join(", ")}&gt;</p> : ""}
        {type.loc.filename ? <p><a class="secondary-text" href={type.loc.sourceFile}>Defined in {type.loc.filename}</a></p> : ""}

        {...type.signatures.map(sig => {
        const [blockComment, inlineComment] = gen.generateComment(sig.jsDoc, true, {}, type.name) || [undefined, ""];
        return <div>
            {FunctionHead(gen, false, {...sig, typeParameters: undefined})}{inlineComment}

            {blockComment ? <div class="docblock">
                {blockComment}
            </div> : ""}
        </div>
    })}
    </div>
}