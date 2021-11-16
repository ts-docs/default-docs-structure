
import { ArrayType, ArrowFunction, FunctionParameter, Literal, ObjectLiteral, Reference, Tuple, TupleMember, Type, TypeKinds, TypeOperator, UnionOrIntersection } from "@ts-docs/extractor";
import path from "path";

export function getPathFileName(p?: string): string | undefined {
    if (!p) return;
    const name = path.parse(p).name;
    if (name.endsWith(".d")) return name.slice(0, -2);
    else return name;
}

export function getTypeLength(type?: Type): number {
    if (!type) return 0;
    switch (type.kind) {
        case TypeKinds.REFERENCE: return (type as Reference).type.name.length + ((type as Reference).typeArguments?.reduce((acc, t) => acc + getTypeLength(t), 0) || 0) + ((type as Reference).type.displayName?.length || 0);
        case TypeKinds.OBJECT_LITERAL: {
            const t = type as ObjectLiteral;
            return t.properties.reduce((prev, curr) => {
                if (curr.prop) return prev + (curr.prop.rawName.length + (curr.prop.type ? getTypeLength(curr.prop.type) : 0));
                else if (curr.index) return prev + 2 + (getTypeLength(curr.index.type) + (curr.index.key ? getTypeLength(curr.index.key) : 0));
                else return 100;
            }, 0);
        }
        case TypeKinds.ARROW_FUNCTION: {
            const fn = type as ArrowFunction;
            let total = getTypeLength(fn.returnType);
            if (fn.parameters) {
                for (const param of fn.parameters) {
                    total += param.name.length;
                    if (param.defaultValue) total += getTypeLength(param.defaultValue);
                    if (param.type) total += getTypeLength(param.type);
                    if (param.rest) total += 3;
                }
            }
            return total;
        }
        case TypeKinds.INTERSECTION:
        case TypeKinds.UNION:
            return (type as UnionOrIntersection).types.reduce((acc, t) => acc + getTypeLength(t), 0);
        case TypeKinds.STRING_LITERAL:
        case TypeKinds.NUMBER_LITERAL:
        case TypeKinds.STRINGIFIED_UNKNOWN: return (type as Literal).name.length;
        case TypeKinds.ARRAY_TYPE: return getTypeLength((type as ArrayType).type);
        case TypeKinds.TRUE: return 4;
        case TypeKinds.FALSE: return 5;
        case TypeKinds.STRING:
        case TypeKinds.NUMBER: return 6;
        case TypeKinds.BOOLEAN:
        case TypeKinds.UNKNOWN: return 7;
        case TypeKinds.BIGINT: return 6;
        case TypeKinds.TUPLE: return (type as Tuple).types.reduce((acc, t) => acc + getTypeLength(t.type) + (t.name ? t.name.length : 0), 0);
        case TypeKinds.TYPEOF_OPERATOR:
        case TypeKinds.KEYOF_OPERATOR:
        case TypeKinds.UNIQUE_OPERATOR:
        case TypeKinds.READONLY_OPERATOR:
            return getTypeLength((type as TypeOperator).type);
        default: return 0;
    }
}

/**
 * Gets how long a type signature is. Used for deciding if a fucntion should be on multiple lines.
 */
export function isLargeSignature(sig: { parameters?: Array<FunctionParameter>, returnType?: Type }): boolean {
    if (sig.parameters) {
        if (sig.parameters.length > 3) return true;
        const total = sig.parameters.reduce((acc, param) => acc + param.name.length + getTypeLength(param.type) + getTypeLength(param.defaultValue), getTypeLength(sig.returnType));
        if (total > 32) return true;
    }
    return false;
}

export function isLargeObject(obj: ObjectLiteral): boolean {
    if (obj.properties.length > 3 || obj.properties.some(prop => prop.call || prop.construct)) return true;
    return getTypeLength(obj) > 42;
}

export function isLargeTuple(arr: Array<TupleMember>): boolean {
    if (arr.length > 4) return true;
    return arr.reduce((acc, t) => acc + getTypeLength(t.type) + (t.name ? t.name.length : 0), 0) > 42;
}