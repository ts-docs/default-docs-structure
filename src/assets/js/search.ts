
interface SearchOptions {
    modules: HTMLInputElement,
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

let searchData: [Array<[number, Array<[string, Array<string>, Array<string>, Array<number>]>, Array<[string, Array<string>, Array<number>]>, Array<[string, Array<string>, Array<number>]>, Array<[string, Array<number>]>, Array<[string, Array<number>]>, Array<[string, Array<number>]>]>, Array<string>]|undefined;

export function initSearch() {
    const searchBar = document.getElementById("search");
    if (searchBar) {
        const options = getSearchOptions();
        let timeout: any;
        const contentMain = document.getElementById("content-main")!;
        const searchMenu = document.getElementById("search-menu")!;
        //const searchResults = document.getElementById("search-result-list")!;
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
            const res = await search(searchTerm, options);
            console.log(res);
            timeout = setTimeout(async () => {
                await loadSearchData();
                contentMain.classList.add("d-none");
                searchMenu.classList.remove("d-none"); 
            }, 300);
        }
    }
}

async function search(term: string, options: SearchOptions) : Promise<Array<string>> {
    await loadSearchData();
    if (!searchData) return [];
    return [];
}

function getSearchOptions() : SearchOptions {
    return {
        modules: document.getElementById("search-option-modules")! as HTMLInputElement,
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
}
 

async function loadSearchData() {
    if (searchData) return searchData;
    const req = await fetch(`${window.depth}assets/search.json`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await req.json();
    return searchData = data;
}
