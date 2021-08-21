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
    STRING_LITERAL: 22
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
}

Handlebars.registerHelper("join", (args, delimiter) => {
    if (!args) return "";
    return args.map(item => item.trim()).join(delimiter);
});

Handlebars.registerHelper("handlePaths", (paths) => {
    return paths.map(p => {
        return `<a class="path-member" href="${p.path || ""}">${p.name}</a>`
    }).join(" / ");
});

Handlebars.registerHelper("formatFunctionParameterComments", (func) => {
     if (!func.paramComments) return "";
     return `<ul>${func.paramComments.map(p => `<li class="item-name"><span class="param-name">${p.name}</span> - ${p.comment}</li>`).join("")}</ul>`
});

Handlebars.registerHelper("handleAssets", (mod) => {
    let depth = mod.depth;
    if (mod.type === "module") depth++;
    const dpth = "../".repeat(depth);
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
        ${overloads.slice(0, 3).map(overload => options.fn(overload)).join("")}
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
    } else return overloads.map(overload => options.fn(overload)).join("");
});

Handlebars.registerHelper("handleReferenceKind", (ref) => {
    let type = "";
    const name = ref.displayName || ref.type.displayName || ref.type.name;
    const realName = ref.type.name;
    switch (ref.type.kind) {
        case ReferenceTypes.CLASS: type = "class"; break;
        case ReferenceTypes.INTERFACE: type = "interface"; break;
        case ReferenceTypes.ENUM_MEMBER: type = "enum member"; break;
        case ReferenceTypes.ENUM: type = "enum"; break;
        case ReferenceTypes.TYPE_ALIAS: type = "type alias"; break;
        case ReferenceTypes.FUNCTION: type = "function"; break;
        case ReferenceTypes.TYPE_PARAMETER: type = "type parameter"; break;
        default: return `<span class="reference-link item-name">${name}</span>`
    }
    if (ref.hash) {
        const isMethod = ref.hash.endsWith("()");
        if (isMethod) ref.hash = ref.hash.slice(0, -2);
        return `<a class="reference-link" href="${ref.link}#.${ref.hash}"><span class="object">${name}</span><span class="symbol">.</span><span class="${isMethod ? "method-name":"property-name"}">${ref.hash}</span></a>`;
    }
    const path = ref.type.external ? `${ref.type.external}/${ref.type.path.join("/")}${ref.type.displayName ? `<span class="item-name object">${ref.type.name}</span>.`:""}${realName}`:`${ref.type.path.join("/")}/${ref.type.displayName ? `<span class="item-name object">${ref.type.name}</span>.`:""}${realName}`;
    return `<span class="c-tooltip"><a class="reference-link object" href="${ref.link}">${name}</a><span class="c-tooltip-content"><span class="keyword">${type}</span> <span class="item-name object">${realName}</span><span style="display:block">${path}</span></span></span>`
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
        default: return `<span class='primitive'>${ref.name}</span>`;
    }
});

Handlebars.registerHelper("linkDefault", (ref) => {
    switch (ref.type.name) {
        case "Date": "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date\">Date</a>"
        case "Bigint": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt\">Bigint</a>"
        case "Promise": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise\">Promise</a>"
        case "Set": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set\">Set</a>"
        case "Map": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map\">Map</a>"
        case "Array": {
            const val = `${ref.typeParameters[0]}[]`;
            ref.typeParameters.length = 0;
            return val;
        }
        case "Function": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function\">Function</a>"
        case "Record": return "<a class='external' href=\"https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype\">Record</a>"
        case "Omit": return "<a class='external' href=\"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys\">Omit</a>"
        case "Symbol": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol\">Symbol</a>"
        case "Error": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error\">Error</a>"
        case "URLSearchParams": return "<a class='external' href=\"https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams\">URLSearchParams</a>"
        default: return ref.type.name
    }
});

function generateHeadings(heading) {
    return heading.subHeadings.length ? `
    <div>
    <div class="collapsible-trigger">
    <span class="collapsible-arrow" style="margin-left:0px"></span>
    <a class="fw-bold" href="#${heading.id}">${heading.name}</a>
    </div>
    <div class="collapsible-body" style="padding-left:15px"> 
    ${heading.subHeadings.map(s => generateHeadings(s)).join("")}
    </div>
    </div>
    `: `<a href="#${heading.id}">${heading.name}</a>`;
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
        currentThing = `<p class="current-thing">class <span class="object">${data.name}</span></p>`;
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
        currentThing = `<p class="current-thing">module <span class="module">${data.module.name}</span></p>`;
        if (data.module.modules.size) res.push({
            name: "Modules",
            values: [...data.module.modules.values()].map(c => `<a href="${depth}m.${c.name}/index.html">${c.name}</a>`)
        });
        if (data.module.classes.size) res.push({
            name: "Classes",
            values: [...data.module.classes.values()].map(c => `<a href="${depth}class/${c.name}.html">${c.name}</a>`)
        });
        if (data.module.interfaces.size) res.push({
            name: "Interfaces",
            values: [...data.module.interfaces.values()].map(c => `<a href="${depth}interface/${c.name}.html">${c.name}</a>`)
        });
        if (data.module.functions.size) res.push({
            name: "Functions",
            values: [...data.module.functions.values()].map(c => `<a href="${depth}function/${c.name}.html">${c.name}</a>`)
        });
        if (data.module.enums.size) res.push({
            name: "Enums",
            values: [...data.module.enums.values()].map(c => `<a href="${depth}enum/${c.name}.html">${c.name}</a>`)
        }); 
        if (data.module.types.size) res.push({
            name: "Types",
            values: [...data.module.types.values()].map(c => `<a href="${depth}type/${c.name}.html">${c.name}</a>`)
        });
        if (data.module.constants.length) res.push({
            name: "Constants",
            values: data.module.constants.map(c => `<a href="${depth}constant/${c.name}.html">${c.name}</a>`)
        });
    } else if (data.type === "interface") {
        if (data.properties.length) res.push({
            name: "Properties",
            values: data.properties.map(m => `<a href="#.${m.name}">${m.name}</a>`)
        });
        currentThing = `<p class="current-thing">interface <span class="object">${data.name}</span></p>`;
    } else if (data.type === "enum") {
        if (data.members.length) res.push({
            name: "Members",
            values: data.members.map(m => `<a href="#.${m.name}">${m.name}</a>`)
        });
        currentThing = `<p class="current-thing">enum <span class="object">${data.name}</span></p>`;
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
    ${currentThing ? currentThing:""}
    <div class="sidebar-members">
    ${res.map(thing => `
        <div class="sidebar-member">
        <div class="collapsible-trigger">
        <span class="collapsible-arrow open"></span>
        <span class="sidebar-category">${thing.name}</span>
        </div>
        <div class="collapsible-body open"> 
        ${thing.values.map(v => `<span class="sidebar-category-member">${v}</span><br>`).join("")}
        </div>
        </div>
    `).join("")}
    </div>
    `
});