

import type { FunctionSignature } from "@ts-docs/extractor";
import { Collapsible } from "./Collapsible";


export function FunctionSignatures(sigs: Array<FunctionSignature>, fn: (sig: FunctionSignature, ind: number) => any) {
    if (sigs.length === 1) return fn(sigs[0], 0);
    const first = sigs.shift()!;
    return <div>
        {fn(first, 0)}
        <div style="margin-bottom: 15px">
            <Collapsible text={<span class="secondary-text">{sigs.length} more overload{sigs.length === 1 ? "":"s"}</span>}>
                {...sigs.map((val, ind) => fn(val, ind + 1))}
            </Collapsible>
        </div>
    </div>
}