
import { ClassDecl, TypeKinds } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { FunctionHead } from "../partials/FunctionHead";
import { FunctionSignatures } from "../partials/FunctionSignatures";
import { RealName } from "../partials/RealName";
import { SourceCodeIcon } from "../partials/SourceCodeIcon";

export function render(gen: Generator, type: ClassDecl) {
    const classComment = gen.generateComment(type.jsDoc, true) || ["", ""];
    return <div>
        <h1>Class <span class="referenceLink object">{type.name}</span> {classComment[1]}</h1>
        {type.typeParameters ? <p class="item-name">&lt;{type.typeParameters.map(p => gen.generateTypeParameter(p)).join(", ")}&gt;</p> : ""}
        {type.isAbstract ? <p class="item-name"><span class="keyword">abstract class</span></p> : ""}
        {type.extends ? <p class="item-name"><span class="keyword">extends </span> {gen.generateType(type.extends)}</p> : ""}
        {type.implements ? <p class="item-name"><span class="keyword">implements </span> {type.implements.map(t => gen.generateType(t))}</p> : ""}
        {type.loc.sourceFile ? <p><a class="secondary-text" href={type.loc.sourceFile}>Defined in {type.loc.filename}</a></p> : ""}

        {classComment[0]}

        {type._constructor ? <>
            <h2 id="constructor"><a href="#constructor">Constructor</a></h2>
            {FunctionSignatures(type._constructor.signatures, (sig) => {
            const sigComment = gen.generateComment(sig.jsDoc, true, {}, "constructor") || [undefined, ""];
            return <div id="class.constructor" class="item">
                <span class="keyword">constructor</span>{FunctionHead(gen, false, sig)}{sigComment[1]}

                {sigComment[0] ? <div class="docblock">
                    {sigComment[0]}
                </div> : ""}
            </div>
        })}
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
                const [blockComment, inlineComment] = gen.generateComment(prop.jsDoc, true) || [undefined, ""];
                return <div class="item" id={prop.prop ? `.${prop.prop.rawName}` : ""}>
                    {item}{inlineComment}
                    <SourceCodeIcon {...prop.loc.sourceFile!} />

                    {blockComment ? <div class="docblock">
                        {blockComment}
                    </div> : ""}
                </div>
            })}
        </> : ""}

        {type.methods.length ? <>
            <h2 id="methods"><a href="#methods">Methods</a></h2>
            {...type.methods.map((method) => {
            const fnName = typeof method.name === "string" ? <a class="item-name method-name" href={`#.${method.rawName}`}>{method.name}</a> :
            <span class="item-name">[<a class="method-name" href={`#.${method.rawName}`}>{method.name.kind === TypeKinds.ANY ? method.rawName.slice(1, -1) : gen.generateType(method.name)}</a>]</span>
            return <div id={`.${method.rawName}`} class="item">
                {FunctionSignatures(method.signatures, (sig, ind) => {
                const [blockComment, inlineComment] = gen.generateComment(sig.jsDoc, true, {}, method.rawName) || [undefined, ""];
                return <div class="item">
                    {method.isStatic ? <span class="modifier">static </span> : ""}
                    {method.isProtected ? <span class="modifier">protected </span> : ""}
                    {method.isAbstract ? <span class="modifier">abstract </span> : ""}
                    {method.isPrivate ? <span class="modifier">private </span> : ""}
                    {method.isGetter ? <span class="modifier">get </span> : ""}
                    {method.isSetter ? <span class="modifier">set </span> : ""}

                    {fnName}
                    {FunctionHead(gen, false, sig)}
                    {inlineComment}
                    {ind === 0 ? <SourceCodeIcon {...method.loc.sourceFile!} /> : ""}

                    {blockComment ? <div class="docblock">
                        {blockComment}
                    </div> : ""}
                </div>
            })}
            </div>})}
        </> : ""}

    </div>
}