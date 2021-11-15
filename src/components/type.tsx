
import type { TypeDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { getPathFileName } from "../utils";

export function render(gen: Generator, type: TypeDecl) {
    const definedIn = getPathFileName(type.loc.sourceFile);
    const comment = gen.generateComment(type.jsDoc, false);
    return <div>
        <h1>Type alias <span class="referenceLink object">{type.name}</span></h1>
        {type.typeParameters ? <p>&lt;{type.typeParameters.map(p => gen.generateTypeParameter(p)).join(", ")}&gt;</p> : ""}
        {definedIn ? <p><a class="secondary-text" href={type.loc.sourceFile}>Defined in {definedIn}</a></p> : ""}

        {comment ? <p>{comment}</p> : ""}

        {type.value ? <div class="item-name">{gen.generateType(type.value)}</div> : ""}
    </div>
}