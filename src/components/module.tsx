
import { Module, TypeKinds } from "@ts-docs/extractor";
import type { AliasedReference, ExportedElement, FileExports } from "@ts-docs/extractor/dist/extractor/ExportHandler";
import type { Generator } from "@ts-docs/ts-docs";
import { Collapsible } from "../partials/Collapsible";
import { SourceCodeIcon } from "../partials/SourceCodeIcon";

export function ExportedReference(gen: Generator, ref: AliasedReference) {
    return <div>
        {gen.generateRef({kind: TypeKinds.REFERENCE, type: ref})} 
        {ref.alias ? <><span class="keyword">as</span> <span class="item-name object">{ref.alias}</span></> : ""}
    </div>
}

export function ReExportedReference(gen: Generator, re: ExportedElement) {
    // Everything is exported
    if (re.references.length === 0) {
        if (re.reExportsOfReExport) return <div><span class="keyword">exports</span> <span class="item-name object">{re.reExportsOfReExport}</span> {re.namespace ? <><span class="keyword"> as</span> <span class="item-name object">${re.namespace}</span></>:""} <span class="keyword">from</span> {gen.generateRef({kind: TypeKinds.REFERENCE, type: re.module})}</div>;
        return <div><span class="keyword">exports</span> <span class="symbol">*</span> {re.namespace ? <><span class="keyword"> as</span> <span class="item-name object">${re.namespace}</span></>:""} <span class="keyword">from</span> {gen.generateRef({kind: TypeKinds.REFERENCE, type: re.module})}</div>;
    } else if (re.references.length === 1) return <div><span class="keyword">exports</span> {ExportedReference(gen, re.references[0])} {re.namespace ? <><span class="keyword"> as</span> <span class="item-name object">${re.namespace}</span></>:""} <span class="keyword">from</span> {gen.generateRef({kind: TypeKinds.REFERENCE, type: re.module})}</div>;
    else return <div>
        <span class="keyword">exports</span> <Collapsible text={<><span class="keyword">{re.references.length} things</span> {re.namespace ? <><span class="keyword"> as</span> <span class="item-name object">${re.namespace}</span></>:""} <span class="keyword">from</span> {gen.generateRef({kind: TypeKinds.REFERENCE, type: re.module})}</>}>
            {...re.references.map(ref => ExportedReference(gen, ref))}
        </Collapsible>
    </div>;
}

export function render(gen: Generator, {module, readme, exports}: {
    module: Module,
    readme?: string,
    exports: FileExports | Record<string, FileExports> | undefined
}) {
    let exportEl = "";
    if (exports) {
        if (gen.settings.exportMode === "simple") {
            exports = exports as FileExports;
            exportEl = <div class="row">
                {exports.exports.length ? <div class="col">
                    <h2>Exports</h2>
                    {...exports.exports.map(e => ExportedReference(gen, e))}
                </div> : ""}

                {exports.reExports.length ? <div class="col"> 
                    <h2>Re-Exports</h2>
                    {...exports.reExports.map(re => ReExportedReference(gen, re))}
                </div> : ""}
            </div>
        }
    }
    return <div>
        <h1>{module.isNamespace ? "Namespace" : "Module"} <span class="referenceLink module">{module.name}</span>{module.repository ? <SourceCodeIcon {...module.repository} /> : ""}</h1>

        {readme || ""}

        {exportEl}
    </div>
}