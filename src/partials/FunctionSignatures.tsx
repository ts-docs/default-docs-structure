

import type { FunctionSignature } from "@ts-docs/extractor";
import { Collapsible } from "./Collapsible";


export function FunctionSignatures(sigs: Array<FunctionSignature>, fn: (sig: FunctionSignature) => any) {
    if (sigs.length === 1) return fn(sigs[0]);
    const first = sigs.shift()!;
    return <div>
        {fn(first)}
        <div style="margin-bottom: 15px">
            <Collapsible text={<span class="secondary-text">{sigs.length} more overload{sigs.length === 1 ? "":"s"}</span>}>
                {...sigs.map(fn)}
            </Collapsible>
        </div>
    </div>
}