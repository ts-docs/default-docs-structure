
import type { FunctionDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { FunctionHead } from "../partials/FunctionHead";
import { getPathFileName } from "../utils";

export function render(gen: Generator, type: FunctionDecl) {
    const definedIn = getPathFileName(type.loc.sourceFile);
    const typeParams = type.signatures[0].typeParameters;
    return <div>
        <h1>Function <span class="referenceLink method-name">{type.name}</span></h1>
        {typeParams ? `<${typeParams.map(gen.generateTypeParameter)}>` : ""}
        {definedIn ? <p><a class="secondary-text" href={type.loc.sourceFile}>Defined in {definedIn}</a></p> : ""}

        {...type.signatures.map(sig => <div>
            {FunctionHead(gen, false, sig)}

            {sig.jsDoc ? <div class="docblock">
                {gen.generateComment(sig.jsDoc)}
            </div> : ""}
        </div>)}
    </div>
}