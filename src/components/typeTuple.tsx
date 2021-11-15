import type {Tuple} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { isLargeArr } from "../utils";

export function render(gen: Generator, {types}: Tuple) {
    return <span>[{isLargeArr(types) ? <div class="left-item">{types.map(t => gen.generateType(t)).join(",<br>")}</div> : types.map(t => gen.generateType(t)).join(", ")}]</span>
}