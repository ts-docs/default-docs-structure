
import { go, highlight } from "fuzzysort";

interface SearchOptions {
    classes: HTMLInputElement,
    interfaces: HTMLInputElement,
    enums: HTMLInputElement,
    functions: HTMLInputElement,
    constants: HTMLInputElement,
    types: HTMLInputElement,
    properties: HTMLInputElement,
    methods: HTMLInputElement,
    enumMembers: HTMLInputElement,
    thisModuleOnly: HTMLInputElement
}

const enum SearchResultType {
    Class,
    Interface,
    Enum,
    Function,
    Constant,
    Type,
    Property,
    InterfaceProperty,
    Method,
    EnumMember
}

interface SearchResult {
    name: string,
    highlighted?: string|null,
    path: Array<string>,
    obj?: string,
    type: SearchResultType
};

let searchData: Array<SearchResult> = [];
let searchResults: Array<SearchResult>|undefined;


export async function initSearch(search: URLSearchParams, contentMain: HTMLElement, searchMenu: HTMLElement) {
    const searchBar = document.getElementById("search");
    if (searchBar) {
        const options = getSearchOptions();
        window.onpopstate = (event: PopStateEvent) => {
            if (event.state && event.state.search) {
                contentMain.classList.add("d-none");
                searchMenu.classList.remove("d-none");
                evaluateSearch(event.state.search, options);
            } else {
                contentMain.classList.add("d-none");
                searchMenu.classList.remove("d-none");
            }
        }
        if (search.has("search")) {
            await loadSearchData();
            evaluateSearch(search.get("search")!, options);
        } else await loadSearchData();

        let timeout: any;
        searchBar.oninput = async (ev) => {
            const target = ev.target as HTMLInputElement;
            const searchTerm = target.value.trim();
            if (!searchTerm.length) {
                clearTimeout(timeout);
                searchMenu.classList.add("d-none");
                contentMain.classList.remove("d-none");
                return;
            }
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(async () => {
                history.pushState({search: searchTerm}, "", `?search=${searchTerm}`);
                await evaluateSearch(searchTerm, options);
                contentMain.classList.add("d-none");
                searchMenu.classList.remove("d-none");
            }, 500);
        }
    }
}

function search(term: string, filteredResults: Array<SearchResult>): Array<SearchResult> {
    if (!searchData) return [];
    const res = go(term, filteredResults, { key: "name", allowTypo: true, limit: 150, threshold: -5000 });
    return res.map(r => {
        r.obj.highlighted = highlight(r, '<span style="text-decoration:underline">', "</span>");
        return r.obj;
    });
}

async function evaluateSearch(term: string, options: SearchOptions): Promise<void> {
    if (!searchData) return;
    searchResults = search(term, filterResults(options, searchData));
    displayResults(searchResults);
}

function filterResults(options: SearchOptions, data: Array<SearchResult>) : Array<SearchResult> {
    const newRes = [];
    for (const res of data) {
        if (options.thisModuleOnly.checked && window.lm && res.path[0] !== window.lm) continue;
        if (!options.classes.checked && res.type === SearchResultType.Class) continue;
        if (!options.interfaces.checked && res.type === SearchResultType.Interface) continue;
        if (!options.enums.checked && res.type === SearchResultType.Enum) continue;
        if (!options.functions.checked && res.type === SearchResultType.Function) continue;
        if (!options.types.checked && res.type === SearchResultType.Type) continue;
        if (!options.constants.checked && res.type === SearchResultType.Constant) continue;
        if (!options.properties.checked && (res.type === SearchResultType.Property || res.type === SearchResultType.InterfaceProperty)) continue;
        if (!options.methods.checked && res.type === SearchResultType.Method) continue;
        if (!options.enumMembers.checked && res.type === SearchResultType.EnumMember) continue;
        newRes.push(res);
    }
    return newRes;
}

function getSearchOptions(): SearchOptions {
    const options = {
        classes: document.getElementById("search-option-classes")! as HTMLInputElement,
        interfaces: document.getElementById("search-option-interfaces")! as HTMLInputElement,
        enums: document.getElementById("search-option-enums")! as HTMLInputElement,
        functions: document.getElementById("search-option-functions")! as HTMLInputElement,
        constants: document.getElementById("search-option-constants")! as HTMLInputElement,
        types: document.getElementById("search-option-types")! as HTMLInputElement,
        properties: document.getElementById("search-option-properties")! as HTMLInputElement,
        methods: document.getElementById("search-option-methods")! as HTMLInputElement,
        enumMembers: document.getElementById("search-option-enum-members")! as HTMLInputElement,
        thisModuleOnly: document.getElementById("search-option-this-module-only")! as HTMLInputElement
    }
    options.classes.onchange =
        options.interfaces.onchange =
        options.enums.onchange =
        options.functions.onchange =
        options.constants.onchange =
        options.types.onchange =
        options.properties.onchange =
        options.methods.onchange =
        options.enumMembers.onchange =
        options.thisModuleOnly.onchange = () => searchResults && displayResults(filterResults(options, searchResults))
    return options;
}

function formatResult(res: SearchResult) : HTMLDivElement {
    const path = res.path.slice();
    let content = "";
    switch (res.type) {
        case SearchResultType.Class: {
            content = `<div>
            <span class="keyword">class</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/class/${res.name}.html" class="item-name object">${res.highlighted}<a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
        case SearchResultType.Interface: {
            content = `<div>
            <span class="keyword">interface</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/interface/${res.name}.html" class="item-name object">${res.highlighted}<a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
        case SearchResultType.Enum: {
            content = `<div>
            <span class="keyword">enum</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/enum/${res.name}.html" class="item-name object">${res.highlighted}<a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
        case SearchResultType.Function: {
            content = `<div>
            <span class="keyword">function</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/function/${res.name}.html" class="item-name method-name">${res.highlighted}<a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
        case SearchResultType.Type: {
            content = `<div>
            <span class="keyword">type</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/type/${res.name}.html" class="item-name object">${res.highlighted}<a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
        case SearchResultType.Constant: {
            content = `<div>
            <span class="keyword">const</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/constant/${res.name}.html" class="item-name object">${res.highlighted}<a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
        case SearchResultType.Property: {
            content = `<div>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/class/${res.obj}.html#${res.name}"><span class="item-name object">${res.obj}</span><span class="symbol">.</span><span class="item-name property-name">${res.highlighted}</span></a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
        case SearchResultType.Method: {
            content = `<div>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/class/${res.obj}.html#${res.name}"><span class="item-name object">${res.obj}</span><span class="symbol">.</span><span class="item-name method-name">${res.highlighted}</span></a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
        case SearchResultType.InterfaceProperty: {
            content = `<div>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/interface/${res.obj}.html#${res.name}" class="item-name property-name"><span class="item-name object">${res.obj}</span><span class="symbol">.</span><span class="item-name property-name">${res.highlighted}</span></a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
        case SearchResultType.EnumMember: {
            content = `<div>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/enum/${res.obj}.html#${res.name}"><span class="item-name object">${res.obj}</span><span class="symbol">.</span><span class="item-name item-name">${res.highlighted}</span></a>
            <p class="docblock secondary">In ${path.join("/")}</p>
            </div>`;
            break;
        }
    }
    const div = document.createElement("div");
    div.className = "search-result";
    div.innerHTML = content;
    return div;
}

function displayResults(results: Array<SearchResult>) {
    const searchResults = document.getElementById("search-result-list")!;
    searchResults.innerHTML = "";
    for (const result of results) {
        searchResults.appendChild(formatResult(result))
    }
}

async function loadSearchData() {
    const req = await fetch(`${window.depth}assets/search.json`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await req.json() as [Array<[number, Array<[string, Array<string>, Array<string>, Array<number>]>, Array<[string, Array<string>, Array<number>]>, Array<[string, Array<string>, Array<number>]>, Array<[string, Array<number>]>, Array<[string, Array<number>]>, Array<[string, Array<number>]>]>, Array<string>];
    const moduleNames = data[1];
    for (const module of data[0]) {
        searchData.push(...module[1].map(cl => {
            const path = cl[3].map(p => moduleNames[p]);
            searchData.push(...cl[1].map(p => ({ name: p, path, obj: cl[0], type: SearchResultType.Property })));
            searchData.push(...cl[2].map(p => ({ name: p, path, obj: cl[0], type: SearchResultType.Method })));
            return {
                name: cl[0],
                path,
                type: SearchResultType.Class
            }
        }));
        searchData.push(...module[2].map(inter => {
            const path = inter[2].map(p => moduleNames[p]);
            searchData.push(...inter[1].map(p => ({name: p, path, obj: inter[0], type: SearchResultType.InterfaceProperty })));
            return {
                name: inter[0],
                path,
                type: SearchResultType.Interface
            }
        }));
        searchData.push(...module[3].map(en => {
            const path = en[2].map(p => moduleNames[p]);
            searchData.push(...en[1].map(p => ({name: p, path, obj: en[0], type:  SearchResultType.EnumMember})));
            return {
                name: en[0],
                path, 
                type: SearchResultType.Enum
            }
        }));
        searchData.push(...module[4].map(t => ({name: t[0], path: t[1].map(p => moduleNames[p]), type: SearchResultType.Type})));
        searchData.push(...module[5].map(t => ({name: t[0], path: t[1].map(p => moduleNames[p]), type: SearchResultType.Function})));
        searchData.push(...module[6].map(t => ({name: t[0], path: t[1].map(p => moduleNames[p]), type: SearchResultType.Constant})))
    }
}
