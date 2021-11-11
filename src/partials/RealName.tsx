import type { Type } from "@ts-docs/extractor";
import { Generator } from "@ts-docs/ts-docs";


export function RealName(gen: Generator, thing: {name: string|Type}) {
    if (typeof thing.name === "string") return thing.name;
    return <span>[{gen.generateType(thing.name)}]</span>
}