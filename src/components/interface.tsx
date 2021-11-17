
import type { InterfaceDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { Property } from "../partials/Property";
import { getPathFileName } from "../utils";

export function render(gen: Generator, type: InterfaceDecl) {
    return <div>
        <h1>Interface <span class="referenceLink object">{type.name}</span></h1>
        {type.typeParameters ? <p>&lt;{type.typeParameters.map(p => gen.generateTypeParameter(p))}&gt;</p> : ""}
        {type.extends ? <p class="item-name"><span class="keyword">extends </span> {type.extends.map(ext => gen.generateType(ext))}</p> : ""}
        {type.implements ? <p class="item-name"><span class="keyword">implements </span> {type.implements.map(ext => gen.generateType(ext))}</p> : ""}

        {...type.loc.map(l => l.sourceFile ? <p><a class="secondary-text" href={l.sourceFile}>Defined in {getPathFileName(l.sourceFile)}</a></p> : "")}

        {type.jsDoc ? gen.generateComment(type.jsDoc) : ""}

        {type.properties.length ? <div>
            <h2 id="properties"><a href="#properties">Properties</a></h2>
            <div>
                {type.properties.map(p => Property(gen, p, true)).join("")}
            </div>
        </div> : ""}
    </div>
}