
import {Literal, Type, TypeKinds as Types} from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: Type) {
    switch (type.kind) {
        case Types.STRING: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a>
        case Types.NUMBER: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a>
        case Types.TRUE: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">true</a>
        case Types.FALSE: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">false</a>
        case Types.BOOLEAN: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a>
        case Types.UNDEFINED: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined">undefined</a>
        case Types.NULL: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null">null</a>
        case Types.STRING_LITERAL: return <a class="primitive string-literal" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">"{(type as Literal).name}"</a>
        case Types.NUMBER_LITERAL: return <a class="primitive number-literal" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">{(type as Literal).name}</a>
        case Types.VOID: return <a class='primitive' href="https://www.typescriptlang.org/docs/handbook/2/functions.html#void">void</a>
        case Types.SYMBOL: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol">symbol</a>
        case Types.THIS: return <span class='keyword'>this</span>
        case Types.BIGINT: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt">bigint</a>
        case Types.OBJECT: return <a class='primitive' href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">object</a>
        case Types.NEVER: return <span class='primitive'>never</span>
        case Types.REGEX_LITERAL: return <a class="primitive regex-literal" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions">{(type as Literal).name}</a>
        case Types.ANY: return <span class='primitive'>any</span>
        default: return <span class='primitive'>unknown</span>
    }
}