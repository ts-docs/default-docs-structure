import { CodeTab, Generator } from "@ts-docs/ts-docs";


export function render(generator: Generator, tabs: Array<CodeTab>) {
    return <div class="tab-code">
        {...tabs.map(tab => <span class="tab-code-tab hljs">
                {tab.tabName}
            </span>
        )}
        {...tabs.map(tab => <div class="tab-code-code" style="display: none">
                {tab.content}
            </div>
        )}
    </div>
}