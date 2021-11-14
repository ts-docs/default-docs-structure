import type {Tuple} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, types: Tuple) {
    return <span>
        [{types.types.map(t => gen.generateType(t)).join(", ")}]
    </span>
}