import type {TemplateLiteralType} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: TemplateLiteralType) {
    return <span>
        <span class="primitive string-literal">`{type.head}</span>
        {...type.spans.map(span => <>{gen.generateType(span.type)}<span class="primitive string-literal">{span.text}</span></>)}
        <span class="primitive string-literal">`</span>
    </span>
}