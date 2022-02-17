
import type { TypeDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: TypeDecl) {
    const [blockComment, inlineComment] = gen.generateComment(type.jsDoc, false) || ["", ""];
    return <div>
        <h1>Type alias <span class="referenceLink object">{type.name}</span>{inlineComment}</h1>
        {type.typeParameters ? <p>&lt;{type.typeParameters.map(p => gen.generateTypeParameter(p)).join(", ")}&gt;</p> : ""}
        {type.loc.filename ? <p><a class="secondary-text" href={type.loc.sourceFile}>Defined in {type.loc.filename}</a></p> : ""}

        {blockComment}

        {type.value ? <div class="item-name">{gen.generateType(type.value)}</div> : ""}
    </div>
}