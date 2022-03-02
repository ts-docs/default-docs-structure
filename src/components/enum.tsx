
import type { EnumDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: EnumDecl) {
    const [blockComment, inlineComment] = gen.generateComment(type.jsDoc, true) || ["", ""];
    return <div>
        <h1>Enum <span class="referenceLink object">{type.name}</span>{inlineComment}</h1>

        {...type.loc.map(l => l.sourceFile ? <p><a class="secondary-text" href={l.sourceFile}>Defined in {l.filename}</a></p> : "")}

        {blockComment}

        {type.members.length ? <div>
            <h2 id="members"><a href="#members">Members</a></h2>

            <div style="margin-left: 10px">
            {...type.members.map(member => {
                const [blockComment, inlineComment] = gen.generateComment(member.jsDoc, true) || [undefined, ""];
                return <div id={`.${member.name}`} class="item">
                <a class="item-name" href={`#.${member.name}`}>{member.name}</a> {inlineComment}

                {member.initializer ? <span class="item-name"> = {gen.generateType(member.initializer)}</span> : ""}

                {blockComment ? <div class="docblock">
                    {blockComment}
                </div> : ""}
            </div>})
            }
            </div>
        </div> : ""}

    </div>
}