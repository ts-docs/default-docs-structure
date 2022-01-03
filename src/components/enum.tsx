
import type { EnumDecl } from "@ts-docs/extractor";
import type { Generator } from "@ts-docs/ts-docs";
import { getPathFileName } from "../utils";

export function render(gen: Generator, type: EnumDecl) {
    const [blockComment, inlineComment] = gen.generateComment(type.jsDoc, true) || ["", ""];
    return <div>
        <h1>Enum <span class="referenceLink object">{type.name}</span>{inlineComment}</h1>

        {...type.loc.map(l => l.sourceFile ? <p><a class="secondary-text" href={l.sourceFile}>Defined in {getPathFileName(l.sourceFile)}</a></p> : "")}

        {blockComment}

        {type.members.length ? <>
            <h2 id="members"><a href="#members">Members</a></h2>

            {...type.members.map(member => <div id={`.${member.name}`} class="item">
                <a class="item-name" href={`#.${member.name}`}>{member.name}</a>

                {member.initializer ? <span class="item-name"> = {gen.generateType(member.initializer)}</span> : ""}

                {member.jsDoc ? <div class="docblock">
                    {gen.generateComment(member.jsDoc)}
                </div> : ""}
            </div>)}
        </> : ""}

    </div>
}