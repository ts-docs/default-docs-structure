
import { Generator, Utils } from "@ts-docs/ts-docs";

export function render(gen: Generator, type: Utils.ChangelogData) {
    return <div>
        <h1>Changelog</h1>
        <p class="monospace">Tag {type.tagName}, by <a href={type.authorUrl}>{type.authorName}</a>, released on <span>{type.publishedAt}</span></p>
        <div>
        <div class="monospace">
            <p><a href={type.downloadZip}>Download .zip</a></p>
            <p><a href={type.downloadTar}>Download .tar</a></p>
        </div>
        {gen.generateMarkdownWithHeaders(type.content)[0]}
    </div>
    </div>
}