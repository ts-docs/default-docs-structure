
import type { ConstantDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { getPathFileName } from "../utils";

export function render(gen: Generator, { constant, content }: {
    constant: ConstantDecl,
    content?: string
}) {
    const [blockComment, inlineComment] = gen.generateComment(constant.jsDoc, true) || ["", ""]
    return <div>
        <h1>Const <span class="referenceLink constant">{constant.name}</span>{inlineComment}</h1>
        {constant.loc.sourceFile ? <p><a class="secondary-text" href={constant.loc.sourceFile}>Defined in {getPathFileName(constant.loc.sourceFile)}</a></p> : ""}

        {constant.type ? gen.generateType(constant.type) : ""}

        {blockComment}

        {content ? <div>
<pre>
<code class="hljs">
{content}
</code>
</pre>
        </div> : ""}
    </div>
}