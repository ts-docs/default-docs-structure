const Types = {
    REFERENCE: 0,
    ARROW_FUNCTION: 1,
    OBJECT_LITERAL: 2,
    TUPLE: 3,
    UNION: 4,
    UNIQUE_OPERATOR: 5,
    READONLY_OPERATOR: 6,
    KEYOF_OPERATOR: 7,
    UNKNOWN: 8,
    STRINGIFIED_UNKNOWN: 9,
    ARRAY_TYPE: 10,
    INTERSECTION: 11,
    NUMBER: 12,
    STRING: 13,
    BOOLEAN: 14,
    VOID: 15,
    TRUE: 16,
    FALSE: 17,
    UNDEFINED: 18,
    NULL: 19,
    ANY: 20,
    NUMBER_LITERAL: 21,
    STRING_LITERAL: 22,
    MAPPED_TYPE: 23,
    CONDITIONAL_TYPE: 24,
    TEMPLATE_LITERAL: 25,
    INDEX_ACCESS: 26,
    TYPEOF_OPERATOR: 27,
    SYMBOL: 28,
    BIGINT: 29,
    TYPE_PREDICATE: 30,
    THIS: 31,
    NEVER: 32,
    OBJECT: 33
};

const ReferenceTypes = {
    CLASS: 0,
    INTERFACE: 1,
    ENUM: 2,
    FUNCTION: 3,
    CONSTANT: 4,
    TYPE_ALIAS: 5,
    TYPE_PARAMETER: 6,
    UNKNOWN: 7,
    STRINGIFIED_UNKNOWN: 8,
    ENUM_MEMBER: 9,
    DEFAULT_API: 10,
    NAMESPACE_OR_MODULE: 11
}

Handlebars.registerHelper("join", (args, delimiter) => {
    if (!args) return "";
    return args.map(item => item.trim()).join(delimiter);
});

Handlebars.registerHelper("handlePaths", (paths) => {
    return paths.map((p, i) => {
        if (i === 1 && p.name === "pages") return `<span class="path-member">${p.name}</span>`;
        return `<a class="path-member" href="${p.path || ""}">${p.name}</a>`;
    }).join(" / ");
});

Handlebars.registerHelper("formatFunctionParameterComments", (func) => {
     if (!func.paramComments) return "";
     return `<ul>${func.paramComments.map(p => `<li class="item-name"><span class="param-name">${p.name}</span> - <span>${p.comment}</span></li>`).join("")}</ul>`
});

Handlebars.registerHelper("handleAssets", (mod) => {
    const dpth = "../".repeat(mod.depth);
    return `
    <link href="${dpth}assets/css/index.css" type="text/css" rel="stylesheet">
    <script src="${dpth}assets/js/index.js"></script>
    <script>window.depth="${dpth}";${mod.currentGlobalModuleName ? `window.lm="${mod.currentGlobalModuleName}"`:""}</script>
    `
});

Handlebars.registerHelper("resolveOverloads", (overloads, options) => {
    const other = overloads.length - 3;
    if (overloads.length > 3) {
        return `
        <div>
        ${overloads.slice(0, 3).map(overload => options.fn({...overload, renderSourceFile: true})).join("")}
        <div style="margin-bottom: 15px">
        <div class="collapsible-trigger">
        <span class="collapsible-arrow"></span>
        <span class="secondary-text">${other} more overload${other === 1 ? "":"s"}</span>
        </div>
        <div class="collapsible-body">
        ${overloads.slice(3).map(overload => options.fn(overload)).join("")}
        </div>
        </div>
        </div>
        `
    } else return overloads.map(overload => options.fn({...overload, renderSourceFile: true})).join("");
});

Handlebars.registerHelper("handleReferenceKind", (ref) => {
    let type = "";
    const name = ref.displayName || ref.type.name;
    let typeClass = "object";
    switch (ref.type.kind) {
        case ReferenceTypes.CLASS: type = "class"; break;
        case ReferenceTypes.INTERFACE: type = "interface"; break;
        case ReferenceTypes.ENUM_MEMBER:
        case ReferenceTypes.ENUM: type = "enum"; break;
        case ReferenceTypes.TYPE_ALIAS: type = "type"; break;
        case ReferenceTypes.FUNCTION: type = "function"; typeClass = "method-name"; break;
        case ReferenceTypes.CONSTANT: type = "const"; typeClass = "constant"; break;
        case ReferenceTypes.NAMESPACE_OR_MODULE: return `<span class="c-tooltip"><a class="reference-link module" href="${ref.link}">${name}</a><span class="c-tooltip-content"><span class="keyword">namespace</span> <span class="item-name module">${ref.type.name}</span><span style="display:block" class="monospace fw-bold">${ref.type.external ? `${ref.type.external}/`:""}${ref.type.path.join("/")}</span></span></span>`
        case ReferenceTypes.TYPE_PARAMETER: return `<span class="c-tooltip"><a class="reference-link object">${name}</a><span class="c-tooltip-content"><span class="keyword">type parameter</span> <span class="item-name object">${ref.type.name}</span></span></span>`;
        default: return `<span class="reference-link item-name">${name}</span>`
    }
    if (ref.hash) {
        const isMethod = ref.hash.endsWith("()");
        if (isMethod) ref.hash = ref.hash.slice(0, -2);
        return `<a class="reference-link" href="${ref.link}#.${ref.hash}"><span class="object">${name}</span><span class="symbol">.</span><span class="${isMethod ? "method-name":"property-name"}">${ref.hash}</span></a>`;
    }
    let path = "";
    if (ref.type.external) path += `${ref.type.external}/`;
    if (ref.type.path) path += ref.type.path.join("/");
    if (ref.type.displayName) return `<span class="c-tooltip"><a class="reference-link ${typeClass}" href="${ref.link}">${name}<span class="symbol">.</span>${ref.type.displayName}</a><span class="c-tooltip-content"><span class="keyword">${type}</span> <span class="item-name ${typeClass}">${ref.type.name}</span><span style="display:block" class="monospace fw-bold">${path}${ref.type.path && ref.type.path.length ? "/":""}<span class="item-name ${typeClass}">${ref.type.name}</span><span class="symbol">.</span>${ref.type.displayName}</span></span></span>`
    return `<span class="c-tooltip"><a class="reference-link ${typeClass}" href="${ref.link}">${name}</a><span class="c-tooltip-content"><span class="keyword">${type}</span> <span class="item-name ${typeClass}">${ref.type.name}</span><span style="display:block" class="monospace fw-bold">${path}${ref.type.path && ref.type.path.length ? "/":""}<span class="item-name ${typeClass}">${ref.type.name}</span></span></span></span>`
});

Handlebars.registerHelper("linkPrimitive", (ref) => {
    switch (ref.kind) {
        case Types.STRING: return "<a class='primitive' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String\">string</a>"
        case Types.NUMBER: return "<a class='primitive' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number\">number</a>"
        case Types.TRUE:
        case Types.FALSE:
        case Types.BOOLEAN: return `<a class='primitive' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean\">${ref.name}</a>`
        case Types.UNDEFINED: return "<a class='primitive' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined\">undefined</a>"
        case Types.NULL: return "<a class='primitive' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null\">null</a>"
        case Types.STRING_LITERAL: return `<a class="primitive string-literal" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">${ref.name}</a>`
        case Types.NUMBER_LITERAL: return `<a class="primitive number-literal" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">${ref.name}</a>`;
        case Types.VOID: return "<a class='primitive' href=\"https://www.typescriptlang.org/docs/handbook/2/functions.html#void\">void</a>"
        case Types.SYMBOL: return "<a class='primitive' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol\">symbol</a>";
        case Types.THIS: return "<span class='keyword'>this</a>";
        case Types.BIGINT: return "<a class='primitive' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt\">bigint</a>";
        case Types.OBJECT: return "<a class='primitive' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object\">object</a>";
        case Types.NEVER: return "<a class='primitive'>never</a>"
        default: return `<span class='primitive'>${ref.name}</span>`;
    }
});

Handlebars.registerHelper("linkDefault", (ref) => {
    switch (ref.type.name) {
        case "Date": "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date\">Date</a>"
        case "Bigint": return "<a class='object' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt\">Bigint</a>"
        case "Promise": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise\">Promise</a>"
        case "Set": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set\">Set</a>"
        case "Map": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map\">Map</a>"
        case "URL": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/API/URL/URL\">URL</a>"
        case "Buffer": return "<a class='external' href=\"https://nodejs.org/api/buffer.html\">Buffer</a>"
        case "RegExp": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp\">RegExp</a>"
        case "Array": return "<a class='object' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array\">Array</a>"
        case "Function": return "<a class='object' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function\">Function</a>"
        case "Record": return "<a class='external' href=\"https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype\">Record</a>"
        case "Omit": return "<a class='external' href=\"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys\">Omit</a>"
        case "Symbol": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol\">Symbol</a>"
        case "Error": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error\">Error</a>"
        case "URLSearchParams": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams\">URLSearchParams</a>";
        case "ReadonlyArray": return "<a class='external' href=\"https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type\">ReadonlyArray</a>";
        case "Pick": return "<a class='external' href=\"https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys\">Pick</a>";
        case "Iterable": return "<a class='external' href=\"https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#iterable-interface\">Iterable</a>";
        default: return `<span class='primitive'>${ref.type.name}</span>`
    }
});

Handlebars.registerHelper("handleModuleIndex", (mod) => {
    return `
    ${mod.modules.size ? `
    <h3>Modules</h3>
    ${[...mod.modules.values()].map(m => `<div><a class="module-item module" href="m.${m.name}/index.html">${m.name}</a></div>`).join("")}
    `:""}
    ${mod.classes.size ? `
    <h3>Classes</h3>
    <table>
    <tbody>
    ${[...mod.classes.values()].map(c => `<tr><td><a class="module-item object" href="class/${c.name}.html">${c.name}</a></td><td>${c.jsDoc ? c.jsDoc.map(c => c.comment || "").join("").slice(0, 256):""}</td></tr>`).join("")}
    </tbody>
    </table>
    `:""}
    ${mod.interfaces.size ? `
    <h3>Interfaces</h3>
    <table>
    <tbody>
    ${[...mod.interfaces.values()].map(c => `<tr><td><a class="module-item object" href="interface/${c.name}.html">${c.name}</a></td><td>${c.jsDoc ? c.jsDoc.map(c => c.comment || "").join("").slice(0, 256):""}</td></tr>`).join("")}
    </tbody>
    </table>
    `:""}
    ${mod.enums.size ? `
    <h3>Enums</h3>
    <table>
    <tbody>
    ${[...mod.enums.values()].map(c => `<tr><td><a class="module-item object" href="enum/${c.name}.html">${c.name}</a></td><td>${c.jsDoc ? c.jsDoc.map(c => c.comment || "").join("").slice(0, 256):""}</td></tr>`).join("")}
    </tbody>
    </table>
    `:""}
    ${mod.functions.size ? `
    <h3>Functions</h3>
    <table>
    <tbody>
    ${[...mod.functions.values()].map(c => `<tr><td><a class="module-item method-name" href="function/${c.name}.html">${c.name}</a></td><td>${c.jsDoc ? c.jsDoc.map(c => c.comment || "").join("").slice(0, 256):""}</td></tr>`).join("")}
    </tbody>
    </table>
    `:""}
    ${mod.types.size ? `
    <h3>Types</h3>
    <table>
    <tbody>
    ${[...mod.types.values()].map(c => `<tr><td><a class="module-item object" href="type/${c.name}.html">${c.name}</a></td><td>${c.jsDoc ? c.jsDoc.map(c => c.comment || "").join("").slice(0, 256):""}</td></tr>`).join("")}
    </tbody>
    </table>
    `:""}
    ${mod.constants.size ? `
    <h3>Constants</h3>
    <table>
    <tbody>
    ${[...mod.constants.values()].map(c => `<tr><td><a class="module-item constant" href="constant/${c.name}.html">${c.name}</a></td><td>${c.jsDoc ? c.jsDoc.map(c => c.comment || "").join("").slice(0, 256):""}</td></tr>`).join("")}
    </tbody>
    </table>
    `:""}
    `;
});

function generateHeadings(heading) {
    return heading.subHeadings.length ? `
    <div>
    <a class="fw-bold" href="#${heading.id}">${heading.name}</a>
    <div style="padding-left:15px"> 
    ${heading.subHeadings.map(s => generateHeadings(s)).join("")}
    </div>
    </div>
    `: `<a href="#${heading.id}" class="sidebar-category-member">${heading.name}</a>`;
}

Handlebars.registerHelper("resolveSidebar", (ctx) => {
    const data = ctx.data.root;
    const res = [];
    let currentThing;
    if (data.type === "class") {
        if (data.properties.length) res.push({
            name: "Properties",
            values: data.properties.map(m => `<a href="#.${m.name}">${m.name}</a>`)
        });
        if (data.methods.length) res.push({
            name: "Methods",
            values: data.methods.map(m => `<a href="#.${m.name}">${m.name}</a>`)
        }); 
        currentThing = `<p class="current-thing text-center">class <span class="object">${data.name}</span></p>`;
    } else if (data.type === "module") {
        const depth = "../".repeat(data.depth);
        if (data.pages) {
            for (const category of data.pages) {
                res.push({
                    name: category.name,
                    values: category.pages.map(p => `<a href="${depth}pages/${category.name}/${p.name}.html">${p.name}</a>`)
                })
            }
        }
        currentThing = `<p class="current-thing text-center">module <span class="module">${data.module.name}</span></p>`;
        const goBack = data.realType ? "../":"";
        if (data.module.modules.size) res.push({
            name: "Modules",
            values: [...data.module.modules.values()].map(c => `<a href="${goBack}m.${c.name}/index.html">${c.name}</a>`)
        });
        if (data.module.classes.size) res.push({
            name: "Classes",
            values: [...data.module.classes.values()].map(c => `<a href="${goBack}class/${c.name}.html">${c.name}</a>`)
        });
        if (data.module.interfaces.size) res.push({
            name: "Interfaces",
            values: [...data.module.interfaces.values()].map(c => `<a href="${goBack}interface/${c.name}.html">${c.name}</a>`)
        });
        if (data.module.enums.size) res.push({
            name: "Enums",
            values: [...data.module.enums.values()].map(c => `<a href="${goBack}enum/${c.name}.html">${c.name}</a>`)
        }); 
        if (data.module.functions.size) res.push({
            name: "Functions",
            values: [...data.module.functions.values()].map(c => `<a href="${goBack}function/${c.name}.html">${c.name}</a>`)
        });
        if (data.module.types.size) res.push({
            name: "Types",
            values: [...data.module.types.values()].map(c => `<a href="${goBack}type/${c.name}.html">${c.name}</a>`)
        });
        if (data.module.constants.size) res.push({
            name: "Constants",
            values: [...data.module.constants.values()].map(c => `<a href="${goBack}constant/${c.name}.html">${c.name}</a>`)
        });
    } else if (data.type === "interface") {
        if (data.properties.length) res.push({
            name: "Properties",
            values: data.properties.map(m => `<a href="#.${m.name || "[key]"}">${m.name || "[key]"}</a>`)
        });
        currentThing = `<p class="current-thing">interface <span class="object">${data.name}</span></p>`;
    } else if (data.type === "enum") {
        if (data.members.length) res.push({
            name: "Members",
            values: data.members.map(m => `<a href="#.${m.name}">${m.name}</a>`)
        });
        currentThing = `<p class="current-thing text-center">enum <span class="object">${data.name}</span></p>`;
    } else if (data.type === "index") {
        if (data.pages) {
            for (const category of data.pages) {
                res.push({
                    name: category.name,
                    values: category.pages.map(p => `<a href="./pages/${category.name}/${p.name}.html">${p.name}</a>`)
                })
            }
        }
        res.push({
            name: "Modules",
            values: data.packages.map(c => `<a href="./m.${c.module.name}/index.html">${c.module.name}</a>`)
        });
    } else if (data.type === "page") {
        for (const heading of data.headings) {
            res.push({
                name: `<a id="#${heading.id}">${heading.name}</a>`,
                values: heading.subHeadings.map(sub => generateHeadings(sub))
            });
        }
        for (const category of data.pages) {
            res.push({
                name: category.name,
                values: category.pages.map(p => `<a href="../${category.name}/${p.name}.html">${p.name}</a>`)
            })
        }
    }
    return `
    <h1 class="lib-name text-center"><a href="${"../".repeat(data.depth)}index.html">${data.headerName}</a></h1>
    ${data.logo ? `<img src="${"../".repeat(data.depth)}${data.logo}" alt="Logo" class="img-fluid mx-auto d-block">`:""}
    ${currentThing ? currentThing:""}
    <div class="sidebar-members">
    ${res.map(thing => `
        <div class="sidebar-member">
        <div class="collapsible-trigger">
        <span class="collapsible-arrow open"></span>
        <span class="sidebar-category">${thing.name}</span>
        </div>
        <div class="collapsible-body open"> 
        ${thing.values.map(v => `<span class="sidebar-category-member">${v}</span>`).join("")}
        </div>
        </div>
    `).join("")}
    </div>
    `
});