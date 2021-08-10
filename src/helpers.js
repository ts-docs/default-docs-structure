
Handlebars.registerHelper("join", (args, delimiter) => {
    if (!args) return "";
    return args.join(delimiter);
});

Handlebars.registerHelper("handleAssets", (mod) => {
    let depth = mod.moduleDepth || 0;
    if (mod.type === "class" || mod.type === "interface" || mod.type === "enum") depth++;
    if (mod.isPage) depth += 2;
    const dpth = "../".repeat(depth || 0);
    return `
    <link href="${dpth}assets/css/index.css" type="text/css" rel="stylesheet">
    <script src="${dpth}assets/js/index.js"></script>
    `
});

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
};

function resolvePrimitive(ref) {
    switch (ref.kind) {
        case Types.STRING: return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String\">string</a>"
        case Types.NUMBER: return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number\">number</a>"
        case Types.TRUE:
        case Types.FALSE:
        case Types.BOOLEAN: return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean\">boolean</a>"
        case Types.UNDEFINED: return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined\">undefined</a>"
        case Types.NULL: return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null\">null</a>"
        case Types.UNIQUE_OPERATOR: return `unique ${resolvePrimitive(ref)}`
        case Types.KEYOF_OPERATOR: return `keyof ${resolvePrimitive(ref)}`
        case Types.READONLY_OPERATOR: return `readonly ${resolvePrimitive(ref)}`
        default: return ref.name;
    }
}

Handlebars.registerHelper("linkPrimitive", resolvePrimitive);

Handlebars.registerHelper("linkDefault", (ref) => {
    switch (ref.type.name) {
        case "Date": "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date\">Date</a>"
        case "Bigint": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt\">Bigint</a>"
        case "Promise": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise\">Promise</a>"
        case "Set": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set\">Set</a>"
        case "Map": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map\">Map</a>"
        case "Array": {
            const val = `${ref.typeParameters[0]}[]`;
            ref.typeParameters.length = 0;
            return val;
        }
        case "Function": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function\">Function</a>"
        case "Record": return "<a href=\"https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype\">Record</a>"
        case "Omit": return "<a href=\"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys\">Omit</a>"
        case "Symbol": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol\">Symbol</a>"
        case "Error": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error\">Error</a>"
        case "URLSearchParams": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams\">URLSearchParams</a>"
        default: return ref.type.name
    }
});

Handlebars.registerHelper("resolveSidebar", (ctx) => {
    const data = ctx.data.root;
    const res = [];
    if (data.type === "class") {
        if (data.methods.length) res.push({
            name: "Methods",
            values: data.methods.map(m => `<a href="#${m.name}">${m.name}</a>`)
        }); 
        if (data.properties.length) res.push({
            name: "Properties",
            values: data.properties.filter(p => !p.isPrivate).map(m => `<a href="#${m.name}">${m.name}</a>`)
        });
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
            values: data.properties.map(m => `<a href="#${m.name}">${m.name}</a>`)
        });
    } else if (data.type === "enum") {
        if (data.members.length) res.push({
            name: "Members",
            values: data.members.map(m => `<a href="#${m.name}">${m.name}</a>`)
        });
    } else if (data.type === "index") {
        const depth = "../".repeat(data.depth);
        if (data.pages) {
            for (const category of data.pages) {
                res.push({
                    name: category.name,
                    values: category.pages.map(p => `<a href="${depth}pages/${category.name}/${p.name}.html">${p.name}</a>`)
                })
            }
        }
        res.push({
            name: "Modules",
            values: data.packages.map(c => `<a href="${depth}m.${c.module.name}/index.html">${c.module.name}</a>`)
        });
    }
    return `
    <div class="sidebar-members">
    ${res.map(thing => `
        <div class="sidebar-member">
        <span class="collapsible-arrow open"></span>
        <span class="sidebar-category">${thing.name}</span>
        <ul class="collapsible-body open"> 
        ${thing.values.map(v => `<p class="sidebar-category-member">${v}</p>`).join("")}
        </ul>
        </div>
    `).join("")}
    </div>
    `
});