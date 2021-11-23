
import { Module, TypeKinds } from "@ts-docs/extractor";
import type { AliasedReference, ExportedElement, FileExports } from "@ts-docs/extractor/dist/extractor/ExportHandler";
import type { Generator, ModuleExports } from "@ts-docs/ts-docs";
import { Collapsible } from "../partials/Collapsible";
import { SourceCodeIcon } from "../partials/SourceCodeIcon";

export function ExportedReference(gen: Generator, ref: AliasedReference) {
    return <span>
        {gen.generateRef({ kind: TypeKinds.REFERENCE, type: ref })}
        {ref.alias ? <><span class="keyword"> as </span> <span class="item-name object">{ref.alias}</span></> : ""}
    </span>
}

export function ReExportedReference(gen: Generator, re: ExportedElement) {
    // Everything is exported
    if (re.references.length === 0) {
        if (re.reExportsOfReExport) return <div><span class="keyword">exports </span> <span class="item-name object">{re.reExportsOfReExport}</span> {re.namespace ? <><span class="keyword"> as</span> <span class="item-name object">{re.namespace}</span></> : ""} <span class="keyword"> from </span> {gen.generateRef({ kind: TypeKinds.REFERENCE, type: re.module }, { filename: re.filename, hash: gen.settings.exportMode === "detailed" ? re.filename : undefined })}</div>;
        return <div><span class="keyword">exports </span> <span class="symbol">*</span> {re.namespace ? <><span class="keyword"> as </span> <span class="item-name object">{re.namespace}</span></> : ""} <span class="keyword"> from </span> {gen.generateRef({ kind: TypeKinds.REFERENCE, type: re.module }, { filename: re.filename, hash: gen.settings.exportMode === "detailed" ? re.filename : undefined })}</div>;
    } else if (re.references.length === 1) return <div><span class="keyword">exports </span> {ExportedReference(gen, re.references[0])} {re.namespace ? <><span class="keyword"> as </span> <span class="item-name object">{re.namespace}</span></> : ""} <span class="keyword"> from </span> {gen.generateRef({ kind: TypeKinds.REFERENCE, type: re.module }, { filename: re.filename, hash: gen.settings.exportMode === "detailed" ? re.filename : undefined })}</div>;
    else return <div>
        <span class="keyword">exports </span> <Collapsible asSpan={true} text={<><span class="keyword">{re.references.length} things</span> {re.namespace ? <><span class="keyword"> as </span> <span class="item-name object">{re.namespace}</span></> : ""} <span class="keyword"> from </span> {gen.generateRef({ kind: TypeKinds.REFERENCE, type: re.module }, { filename: re.filename, hash: gen.settings.exportMode === "detailed" ? re.filename : undefined })}</>}>
            {...re.references.map(ref => <div>{ExportedReference(gen, ref)}</div>)}
        </Collapsible>
    </div>;
}

export function render(gen: Generator, { module, readme, exports }: {
    module: Module,
    readme?: string,
    exports: ModuleExports
}) {
    let exportEl = "";
    if (exports) {
        if (gen.settings.exportMode === "simple") {
            exports = exports as FileExports;
            exportEl = <div class="row">
                {exports.exports.length ? <div class="col">
                    <h2>Exports</h2>
                    {...exports.exports.map(e => <div>{ExportedReference(gen, e)}</div>)}
                </div> : ""}

                {exports.reExports.length ? <div class="col">
                    <h2>Re-Exports</h2>
                    {...exports.reExports.map(re => ReExportedReference(gen, re))}
                </div> : ""}
            </div>
        } else {
            exports = exports as Record<string, FileExports>;
            let exportsArr = Object.entries(exports);
            const indexInd = exportsArr.findIndex(([filename]) => filename === "index");
            if (indexInd !== -1) exportsArr = [exportsArr[indexInd], ...(exportsArr.splice(indexInd, 1), exportsArr)];
            exportEl = <div>
                <h2>Exports</h2>
                {...exportsArr.map(([filename, fileExports]) => <div style="margin-bottom: 15px">
                    <Collapsible text={<h4 id={filename} class="export-header">{filename}</h4>} open={false}>
                    <div class="row" style="margin-top: 15px">
                        {fileExports.exports.length ? <div class="col">
                            <h6>Exports</h6>
                            {...fileExports.exports.map(e => <div>{ExportedReference(gen, e)}</div>)}
                        </div> : ""}
                        {fileExports.reExports.length ? <div class="col">
                            <h6>Re-Exports</h6>
                            {...fileExports.reExports.map(re => ReExportedReference(gen, re))}
                        </div> : ""}
                    </div>
                    </Collapsible>
                </div>)}
            </div>
        }
    }
    return <div>
        <h1>{module.isNamespace ? "Namespace " : "Module "} <span class="referenceLink module">{module.name}</span>{module.repository ? <SourceCodeIcon {...module.repository} /> : ""}</h1>

        {readme || ""}

        {exportEl}
    </div>
}

export function ExportsSidebar(gen: Generator, exports: Record<string, FileExports>): { name: string, values: Array<string> } {
    let filenames = Object.keys(exports);
    if (gen.settings.sort === "alphabetical") filenames.sort((a, b) => a.localeCompare(b));
    const indexInd = filenames.findIndex(filename => filename === "index");
    if (indexInd !== -1) filenames = [filenames[indexInd], ...(filenames.splice(indexInd, 1), filenames)];
    return {
        name: "Exports",
        values: filenames.map(name => <a href={`#${name}`}>{name}</a>)
    }
}