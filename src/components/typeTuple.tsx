import type {Tuple} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { isLargeTuple } from "../utils";

export function render(gen: Generator, {types}: Tuple) {
    const isLarge = isLargeTuple(types);
    const mapped = types.map(t => <span class="item-name">
        {t.jsDoc ? <><span style="color: gray">/** {gen.generateInlineComment(t.jsDoc)} */</span><br /></> : ""}
        {t.spread ? <span class="symbol">...</span> : ""}
        {t.name ? <><span class="property-name">{t.name}</span>{t.optional ? <span class="symbol">?</span> : ""}: </> : ""}
        {gen.generateType(t.type)}
    </span>);
    return <span>[{isLarge ? <div class="left-item">{mapped.join(",<br>")}</div> : mapped.join(", ")}]</span>
}