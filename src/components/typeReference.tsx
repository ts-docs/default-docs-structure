
import { Reference, TypeReferenceKinds } from "@ts-docs/extractor";
import type { Generator, OtherRefData } from "@ts-docs/ts-docs";
import { Tooltip } from "../partials/Tooltip";

export function render(gen: Generator, { other, ref, link }: {
    ref: Reference,
    other: OtherRefData,
    link: string
}) {
    const typeArgs = ref.typeArguments && ref.typeArguments.length ? <>&lt;{ref.typeArguments.map(arg => gen.generateType(arg)).join(", ")}&gt;</> : "";
    const name = other.displayName ? other.displayName : ref.type.name;
    const extension = (!other.displayName) && ref.type.displayName ? <><span class="symbol">.</span><span>{ref.type.displayName}</span></> : "";
    if (ref.type.kind === TypeReferenceKinds.INTERNAL) return <><Tooltip {...<><span class="keyword">internal </span><span class="item-name object">{name}{extension}</span></>}>
        <span class="reference-link object">{name}{extension}</span>
    </Tooltip>{typeArgs}</>
    if (ref.type.link) return <><Tooltip {...<><span class="keyword">external </span> <span class="item-name object">{name}{extension}</span></>}>
        <a class="reference-link object" href={ref.type.link}>{name}{extension}</a>
    </Tooltip>{typeArgs}</>
    let type = "object ";
    let typeClass = "object";
    const path = ref.type.path ? ref.type.path.join("/") : "";
    switch (ref.type.kind) {
        case TypeReferenceKinds.CLASS: type = "class "; break;
        case TypeReferenceKinds.INTERFACE: type = "interface "; break;
        case TypeReferenceKinds.ENUM:
        case TypeReferenceKinds.ENUM_MEMBER: type = "enum "; break;
        case TypeReferenceKinds.TYPE_ALIAS: type = "type "; break;
        case TypeReferenceKinds.FUNCTION: type = "function "; typeClass = "method-name"; break;
        case TypeReferenceKinds.CONSTANT: type = "const "; typeClass = "constant"; break;
        case TypeReferenceKinds.NAMESPACE_OR_MODULE: return <Tooltip {...<><span class="keyword">module </span> <span class="item-name module">{ref.type.name}</span><span style="display:block" class="monospace fw-bold">{path}</span></>}>
            <a class="reference-link module" href={link}>{name}{gen.settings.exportMode === "detailed" && other.filename ? `/${other.filename}` : ""}</a>
        </Tooltip>
        case TypeReferenceKinds.TYPE_PARAMETER: return <Tooltip {...<><span class="keyword">type parameter </span> <span class="item-name object">{name}</span></>}>
            <a class="reference-link object">{name}</a>
        </Tooltip>
        default: return <span class="reference-link item-name">{name}</span>
    }
    let hash = "";
    let realName;
    if (other.hash) {
        const isMethod = other.hash.endsWith("()");
        if (isMethod) other.hash = other.hash.slice(0, -2);
        link += `#.${other.hash}`;
        if (!other.displayName) hash = <><span class="symbol">.</span><span class={isMethod ? "method-name" : "property-name"}>{other.hash}</span></>
        else realName = ref.type.name + <><span class="symbol">.</span><span class={isMethod ? "method-name" : "property-name"}>{other.hash}</span></>;
    }
    return <span>
        <Tooltip {...<>
            <span class="keyword">{type}</span> <span class={"item-name " + typeClass}>{realName || name}</span><span style="display:block" class="monospace fw-bold">{path}{path.length ? "/" : ""}<span class={"item-name " + typeClass}>{ref.type.name}</span></span>
        </>}>
            <a class={"reference-link " + typeClass} href={link}>{name}{extension}{hash}</a>
        </Tooltip>
        {typeArgs}
    </span>
}