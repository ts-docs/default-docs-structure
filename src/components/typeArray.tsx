

import { ArrayType, TypeKinds } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, {type}: ArrayType) {
    switch (type.kind) {
        case TypeKinds.INTERSECTION:
        case TypeKinds.UNION:
        case TypeKinds.CONDITIONAL_TYPE:
            return <span>({gen.generateType(type)})[]</span>
        default:
            return <span>{gen.generateType(type)}[]</span>
    }
}