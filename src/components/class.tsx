
import type { ClassDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { FunctionHead } from "../partials/FunctionHead";
import { FunctionSignatures } from "../partials/FunctionSignatures";
import { RealName } from "../partials/RealName";
import { getPathFileName } from "../utils";
import { SourceCodeIcon } from "../partials/SourceCodeIcon";

export function render(gen: Generator, type: ClassDecl) {
    return <div>
        <h1>Class <span class="referenceLink object">{type.name}</span></h1>
        {type.typeParameters ? <p class="item-name">&lt;{type.typeParameters.map(p => gen.generateTypeParameter(p)).join(", ")}&gt;</p> : ""}
        {type.isAbstract ? <p class="item-name"><span class="keyword">abstract class</span></p> : ""}
        {type.extends ? <p class="item-name"><span class="keyword">extends </span> {gen.generateType(type.extends)}</p> : ""}
        {type.implements ? <p class="item-name"><span class="keyword">implements </span> {type.implements.map(t => gen.generateType(t))}</p> : ""}
        {type.loc.sourceFile ? <p><a class="secondary-text" href={type.loc.sourceFile}>Defined in {getPathFileName(type.loc.sourceFile)}</a></p> : ""}

        {type.jsDoc ? gen.generateComment(type.jsDoc) : ""}

        {type._constructor ? <>
            <h2 id="constructor"><a href="#constructor">Constructor</a></h2>
            {FunctionSignatures(type._constructor.signatures, (sig) => <div id="class.constructor" class="item">
                <span class="keyword">constructor</span>{FunctionHead(gen, false, sig)}

                {sig.jsDoc ? <div class="docblock">
                    {gen.generateComment(sig.jsDoc, true)}
                </div> : ""}
            </div>)}
        </> : ""}

        {type.properties.length ? <>
            <h2 id="properties"><a href="#properties">Properties</a></h2>
            {...type.properties.map(prop => {
                let item = <>
                    {prop.isStatic ? <span class="modifier">static </span> : ""}
                    {prop.isProtected ? <span class="modifier">protected </span> : ""}
                    {prop.isAbstract ? <span class="modifier">abstract </span> : ""}
                    {prop.isPrivate ? <span class="modifier">private </span> : ""}
                    {prop.isReadonly ? <span class="modifier">readonly </span> : ""}
                </>
                if (prop.index) {
                    item += <span class="item-name">[key<span class="symbol">: </span> {gen.generateType(prop.index.key!)}]<span class="symbol">: </span> {gen.generateType(prop.index.type)}</span>
                } else {
                    item += <>
                        <span class="item-name"><a class="property-name" href={`#.${prop.prop!.rawName}`}>{RealName(gen, prop.prop!)}</a>
                            {prop.prop!.isOptional ? <span class="symbol">?</span> : ""}
                            {prop.prop!.type ? <><span class="symbol">: </span> {gen.generateType(prop.prop!.type)}</> : ""}
                            {prop.prop!.initializer ? <><span class="symbol"> = </span> {gen.generateType(prop.prop!.initializer)}</> : ""}
                        </span>
                    </>
                }
                return <div class="item" id={prop.prop ? `.${prop.prop.rawName}` : ""}>
                    {item}
                    <SourceCodeIcon {...prop.loc.sourceFile!} />

                    {prop.jsDoc ? <div class="docblock">
                        {gen.generateComment(prop.jsDoc, true)}
                    </div> : ""}
                </div>
            })}
        </> : ""}

        {type.methods.length ? <>
            <h2 id="methods"><a href="#methods">Methods</a></h2>
            {...type.methods.map((method) => <div id={`.${method.rawName}`} class="item">
                {FunctionSignatures(method.signatures, (sig, ind) => <div class="item">
                    {method.isStatic ? <span class="modifier">static </span> : ""}
                    {method.isProtected ? <span class="modifier">protected </span> : ""}
                    {method.isAbstract ? <span class="modifier">abstract </span> : ""}
                    {method.isPrivate ? <span class="modifier">private </span> : ""}
                    {method.isGetter ? <span class="modifier">get </span> : ""}
                    {method.isSetter ? <span class="modifier">set </span> : ""}

                    {typeof method.name === "string" ? <a class="item-name method-name" href={`#.${method.rawName}`}>{method.name}</a> : <span class="item-name">[<a class="method-name" href={`#.${method.rawName}`}>{gen.generateType(method.name)}</a>]</span>}
                    {FunctionHead(gen, false, sig)}
                    {ind === 0 ? <SourceCodeIcon {...method.loc.sourceFile!} /> : ""}
                </div>)}
            </div>)}
        </> : ""}

    </div>
}