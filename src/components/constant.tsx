
import type { ConstantDecl } from "@ts-docs/extractor";
import type { Generator, StaticDocumentationData } from "@ts-docs/ts-docs";
import { getPathFileName } from "../utils";

export function render(gen: Generator, staticData: StaticDocumentationData, { constant, content }: {
    constant: ConstantDecl,
    content?: string
}) {
    const definedIn = getPathFileName(constant.loc.sourceFile);
    return <div>
        <h1>Const <span class="referenceLink constant">{name}</span></h1>
        {definedIn ? <p><a class="secondary-text" href={constant.loc.sourceFile}>Defined in {{ definedIn }}</a></p> : ""}

        {constant.type ? gen.generateType(constant.type) : ""}

        {constant.jsDoc ? <div class="docblock">
            {gen.generateComment(constant.jsDoc)}
        </div> : ""}

        {content ? <div>
<pre>
<code class="hljs">
{content}
</code>
</pre>
        </div> : ""}
    </div>
}