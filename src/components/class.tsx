
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
        {type.typeParameters ? <>&lt;{type.typeParameters.map(p => gen.generateTypeParameter(p))}&gt;</> : ""}
        {type.isAbstract ? <p class="item-name"><span class="keyword">abstract class</span></p> : ""}
        {type.extends ? <p class="item-name"><span class="keyword">extends</span> {gen.generateType(type.extends)}</p> : ""}
        {type.implements ? <p class="item-name"><span class="keyword">implements</span> {type.implements.map(t => gen.generateType(t))}</p> : ""}
        {type.loc.sourceFile ? <p><a class="secondary-text" href={type.loc.sourceFile}>Defined in {getPathFileName(type.loc.sourceFile)}</a></p> : ""}

        {type.jsDoc ? gen.generateComment(type.jsDoc) : ""}

        {type._constructor ? <>
            <h2>Constructor</h2>
            {FunctionSignatures(type._constructor.signatures, (sig) => <div id="class.constructor" class="item">
                <span class="keyword">constructor</span>{FunctionHead(gen, false, sig)}

                {sig.jsDoc ? <div class="docblock">
                    {gen.generateComment(sig.jsDoc, true)}
                </div> : ""}
            </div>)}
        </> : ""}

        {type.properties.length ? <>
            <h2>Properties</h2>
            {...type.properties.map(prop => {
                let item = <>
                    {prop.isStatic ? <span class="modifier">static</span> : ""}
                    {prop.isProtected ? <span class="modifier">protected</span> : ""}
                    {prop.isAbstract ? <span class="modifier">abstract</span> : ""}
                    {prop.isPrivate ? <span class="modifier">private</span> : ""}
                    {prop.isReadonly ? <span class="modifier">readonly</span> : ""}
                </>
                if (prop.index) {
                    item += <span class="item-name">[key<span class="symbol">:</span> {gen.generateType(prop.index.key!)}]<span class="symbol">:</span> {gen.generateType(prop.index.type)}</span>
                } else {
                    item = <>
                        <span class="item-name"><span class="property-name">{RealName(gen, prop.prop!)}</span>
                            {prop.prop!.isOptional ? <span class="symbol">?</span> : ""}
                            {prop.prop!.type ? <><span class="symbol">:</span> {gen.generateType(prop.prop!.type)}</> : ""}
                            {prop.prop!.initializer ? <><span class="symbol">=</span> {gen.generateType(prop.prop!.initializer)}</> : ""}
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
            <h2>Methods</h2>
            {...type.methods.map(method => <div id={`.${method.rawName}`} class="item">
                {FunctionSignatures(method.signatures, (sig) => <div class="item">
                    {method.isStatic ? <span class="modifier">static</span> : ""}
                    {method.isProtected ? <span class="modifier">protected</span> : ""}
                    {method.isAbstract ? <span class="modifier">abstract</span> : ""}
                    {method.isPrivate ? <span class="modifier">private</span> : ""}
                    {method.isGetter ? <span class="modifier">get</span> : ""}
                    {method.isSetter ? <span class="modifier">set</span> : ""}

                    <span class="item-name method-name">{RealName(gen, method)}</span>
                    {FunctionHead(gen, false, sig)}
                </div>)}
            </div>)}
        </> : ""}

    </div>
}