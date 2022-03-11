
import { ConstantDecl, TypeKinds } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, { constant, content }: {
    constant: ConstantDecl,
    content?: string
}) {
    const [blockComment, inlineComment] = gen.generateComment(constant.jsDoc, true) || ["", ""];
    const type = constant.type && constant.type.kind !== TypeKinds.STRINGIFIED_UNKNOWN && gen.generateType(constant.type);
    return <div>
        <h1>Const <span class="referenceLink constant">{constant.name}</span>{inlineComment}</h1>
        {constant.loc.sourceFile ? <p><a class="secondary-text" href={constant.loc.sourceFile}>Defined in {constant.loc.filename}</a></p> : ""}

        {type ? <div>
            <h2>Type</h2>
            {type}    
        </div> : ""}

        {blockComment}

        {content ? <div>
            <h2>Content</h2>
<pre>
<code class="hljs">
{content}
</code>
</pre>
        </div> : ""}
    </div>
}