
import type { InterfaceDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { Property } from "../partials/Property";

export function render(gen: Generator, type: InterfaceDecl) {
    const [blockComment, inlineComment] = gen.generateComment(type.jsDoc, true) || [undefined, ""];
    return <div>
        <h1>Interface <span class="referenceLink object">{type.name}</span>{inlineComment}</h1>
        {type.typeParameters ? <p>&lt;{type.typeParameters.map(p => gen.generateTypeParameter(p))}&gt;</p> : ""}
        {type.extends ? <p class="item-name"><span class="keyword">extends </span> {type.extends.map(ext => gen.generateType(ext))}</p> : ""}
        {type.implements ? <p class="item-name"><span class="keyword">implements </span> {type.implements.map(ext => gen.generateType(ext))}</p> : ""}

        {...type.loc.map(l => l.sourceFile ? <p><a class="secondary-text" href={l.sourceFile}>Defined in {l.filename}</a></p> : "")}

        {blockComment}

        {type.properties.length ? <div>
            <h2 id="properties"><a href="#properties">Properties</a></h2>
            <div style="margin-left: 10px;">
                {type.properties.map(p => Property(gen, p, true)).join("")}
            </div>
        </div> : ""}
    </div>
}