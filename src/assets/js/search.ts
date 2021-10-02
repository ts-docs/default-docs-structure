
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
    thisModuleOnly: HTMLInputElement,
    setters: HTMLInputElement,
    getters: HTMLInputElement,
    privates: HTMLInputElement
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
    type: SearchResultType,
    isGetter?: boolean,
    isSetter?: boolean,
    isPrivate?: boolean,
    oldName?: string,
    comment?: string
}

const enum ClassMemberFlags {
    IS_GETTER = 1 << 0,
    IS_SETTER = 1 << 1,
    IS_PRIVATE = 1 << 2
}

export type SearchDataComment = string|undefined;

export type PackedSearchData = [
    Array<[
        number, // Module ID,
        Array<[string, Array<[string, number, SearchDataComment]>, Array<[string, number, SearchDataComment]>, Array<number>, SearchDataComment]>, // Classes
        Array<[string, Array<string>, Array<number>, SearchDataComment]>, // Interfaces,
        Array<[string, Array<string>, Array<number>, SearchDataComment]>, // Enums,
        Array<[string, Array<number>]>, // Types
        Array<[string, Array<number>]>, // Functions
        Array<[string, Array<number>]> // Constants
    ]>,
    Array<string> // Module names
];


function hasBit(bits: number, bit: number) {
    return (bits & bit) === bit;
}

let searchTerm = "";
let searchData: Array<SearchResult> = [];
let searchResults: Array<SearchResult>|undefined;


export async function initSearch(search: URLSearchParams, contentMain: HTMLElement, searchMenu: HTMLElement) {
    const searchBar = document.getElementById("search") as HTMLInputElement;
    if (searchBar) {
        window.onkeypress = () => {
                searchBar.focus();
        }
        const options = getSearchOptions();
        window.onpopstate = (event: PopStateEvent) => {
           if (event.state && event.state.search) {
                contentMain.classList.add("d-none");
                searchMenu.classList.remove("d-none");
                evaluateSearch(event.state.search, options);
            } else {
                contentMain.classList.remove("d-none");
                searchMenu.classList.add("d-none");
            }
        }
        if (search.has("search")) {
            const val = search.get("search")!;
            searchBar.value = val;
            await loadSearchData();
            evaluateSearch(val, options);
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
            }, 400);
        }
    }
}

function search(term: string, filteredResults: Array<SearchResult>): Array<SearchResult> {
    if (!searchData) return [];
    if (term.includes(".")) {
        return go(term, filteredResults.map(r => ({...r, oldName: r.name, name: `${r.obj || ""}.${r.name}`})), { key: "name", allowTypo: true, limit: 150, threshold: -5000 }).map(item => {
          item.obj.highlighted = item.obj.oldName;
          item.obj.name = item.obj.oldName;
          return item.obj;   
        });
    } else {
        return go(term, filteredResults, { key: "name", allowTypo: true, limit: 150, threshold: -5000 }).map(item => {
            item.obj.highlighted = highlight(item, '<span style="border-bottom: dotted 2px var(--primaryLight)">', "</span>");
            return item.obj;
        });
    }
}

async function evaluateSearch(term: string, options: SearchOptions): Promise<void> {
    if (!searchData) return;
    searchTerm = term;
    searchResults = search(term, filterResults(options, searchData));
    displayResults(searchResults);
}

function filterResults(options: SearchOptions, data: Array<SearchResult>) : Array<SearchResult> {
    const newRes = [];
    for (const res of data) {
        if (options.thisModuleOnly.checked && window.lm && res.path[0] !== window.lm) continue;
        if (!options.privates.checked && res.isPrivate) continue;
        if (!options.classes.checked && res.type === SearchResultType.Class) continue;
        if (!options.interfaces.checked && res.type === SearchResultType.Interface) continue;
        if (!options.enums.checked && res.type === SearchResultType.Enum) continue;
        if (!options.functions.checked && res.type === SearchResultType.Function) continue;
        if (!options.types.checked && res.type === SearchResultType.Type) continue;
        if (!options.constants.checked && res.type === SearchResultType.Constant) continue;
        if (!options.properties.checked && (res.type === SearchResultType.Property || res.type === SearchResultType.InterfaceProperty)) continue;
        if (res.type === SearchResultType.Method) {
            if (!options.methods.checked) continue;
            if (!options.setters.checked && res.isSetter) continue;
            if (!options.getters.checked && res.isGetter) continue;
        }
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
        thisModuleOnly: document.getElementById("search-option-this-module-only")! as HTMLInputElement,
        setters: document.getElementById("search-option-setters")! as HTMLInputElement,
        getters: document.getElementById("search-option-getters")! as HTMLInputElement,
        privates: document.getElementById("search-option-privates")! as HTMLInputElement
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
        options.setters.onchange = 
        options.getters.onchange =
        options.privates.onchange =
        options.thisModuleOnly.onchange = () => evaluateSearch(searchTerm, options);
    return options;
}

function formatResult(res: SearchResult) : string {
    const path = res.path.slice();
    let content = "";
    switch (res.type) {
        case SearchResultType.Class: {
            content = `<div>
            <span class="keyword">class</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/class/${res.name}.html" class="item-name object">${res.highlighted}<a>
            ${res.comment ? `<p class="docblock">${res.comment}</p>`:""}
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
        case SearchResultType.Interface: {
            content = `<div>
            <span class="keyword">interface</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/interface/${res.name}.html" class="item-name object">${res.highlighted}<a>
            ${res.comment ? `<p class="docblock">${res.comment}</p>`:""}
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
        case SearchResultType.Enum: {
            content = `<div>
            <span class="keyword">enum</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/enum/${res.name}.html" class="item-name object">${res.highlighted}<a>
            ${res.comment ? `<p class="docblock">${res.comment}</p>`:""}
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
        case SearchResultType.Function: {
            content = `<div>
            <span class="keyword">function</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/function/${res.name}.html" class="item-name method-name">${res.highlighted}<a>
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
        case SearchResultType.Type: {
            content = `<div>
            <span class="keyword">type</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/type/${res.name}.html" class="item-name object">${res.highlighted}<a>
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
        case SearchResultType.Constant: {
            content = `<div>
            <span class="keyword">const</span>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/constant/${res.name}.html" class="item-name object">${res.highlighted}<a>
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
        case SearchResultType.Property: {
            content = `<div>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/class/${res.obj}.html#.${res.name}"><span class="item-name object">${res.obj}</span><span class="symbol">.</span><span class="item-name property-name">${res.highlighted}</span></a>
            ${res.comment ? `<p class="docblock">${res.comment}</p>`:""}
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
        case SearchResultType.Method: {
            content = `<div>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/class/${res.obj}.html#.${res.name}">${res.isGetter ? '<span class="keyword">getter</span> ':""}${res.isSetter ? '<span class="keyword">setter</span> ':""}<span class="item-name object">${res.obj}</span><span class="symbol">.</span><span class="item-name method-name">${res.highlighted}</span></a>
            ${res.comment ? `<p class="docblock">${res.comment}</p>`:""}
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
        case SearchResultType.InterfaceProperty: {
            content = `<div>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/interface/${res.obj}.html#.${res.name}" class="item-name property-name"><span class="item-name object">${res.obj}</span><span class="symbol">.</span><span class="item-name property-name">${res.highlighted}</span></a>
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
        case SearchResultType.EnumMember: {
            content = `<div>
            <a href="${window.depth}${path.map(m => `m.${m}`).join("/")}/enum/${res.obj}.html#.${res.name}"><span class="item-name object">${res.obj}</span><span class="symbol">.</span><span class="item-name item-name">${res.highlighted}</span></a>
            ${path.length ? `<p class="docblock secondary">In ${path.join("/")}</p>`:""}
            </div>`;
            break;
        }
    }
    return `<div class="search-result">${content}</div>`;
}

function displayResults(results: Array<SearchResult>) {
    const searchResults = document.getElementById("search-result-list")!;
    if (!results.length) {
       searchResults.innerHTML = `<h1 class="text-center">No results!</h1>`;
       return;
    }
    if (results.length === 1) {
        searchResults.innerHTML = `
         <div>
         ${results.map(h => formatResult(h)).join("")}
         </div>
        `
    } else {
    const mid = Math.ceil(results.length / 2);
    searchResults.innerHTML = `
    <div class="row">
    <div class="col-lg-6">
    ${results.slice(0, mid).map(h => formatResult(h)).join("")}
    </div>
    <div class="col-lg-6">
    ${results.slice(-mid).map(h => formatResult(h)).join("")}
    </div>
    </div>
    `;
    }
}

async function loadSearchData() {
    const req = await fetch(`${window.depth}assets/search.json`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await req.json() as PackedSearchData;
    const moduleNames = data[1];
    for (const module of data[0]) {
        searchData.push(...module[1].map(cl => {
            const path = cl[3].map(p => moduleNames[p]);
            searchData.push(...cl[1].map(([name, bits, comment]) => ({ name, path, obj: cl[0], type: SearchResultType.Property, isPrivate: hasBit(bits, ClassMemberFlags.IS_PRIVATE), comment })));
            searchData.push(...cl[2].map(([name, bits, comment]) => ({ name, path, obj: cl[0], type: SearchResultType.Method, isGetter: hasBit(bits, ClassMemberFlags.IS_GETTER), isSetter: hasBit(bits, ClassMemberFlags.IS_SETTER), isPrivate: hasBit(bits, ClassMemberFlags.IS_PRIVATE), comment })));
            return {
                name: cl[0],
                path,
                type: SearchResultType.Class,
                comment: cl[4]
            }
        }));
        searchData.push(...module[2].map(inter => {
            const path = inter[2].map(p => moduleNames[p]);
            searchData.push(...inter[1].map(p => ({name: p, path, obj: inter[0], type: SearchResultType.InterfaceProperty })));
            return {
                name: inter[0],
                path,
                type: SearchResultType.Interface,
                comment: inter[3]
            }
        }));
        searchData.push(...module[3].map(en => {
            const path = en[2].map(p => moduleNames[p]);
            searchData.push(...en[1].map(p => ({name: p, path, obj: en[0], type:  SearchResultType.EnumMember})));
            return {
                name: en[0],
                path, 
                type: SearchResultType.Enum,
                comment: en[3]
            }
        }));
        searchData.push(...module[4].map(t => ({name: t[0], path: t[1].map(p => moduleNames[p]), type: SearchResultType.Type})));
        searchData.push(...module[5].map(t => ({name: t[0], path: t[1].map(p => moduleNames[p]), type: SearchResultType.Function})));
        searchData.push(...module[6].map(t => ({name: t[0], path: t[1].map(p => moduleNames[p]), type: SearchResultType.Constant})))
    }
}
