
Handlebars.registerHelper("join", (args, delimiter) => {
    return args.join(delimiter);
});

Handlebars.registerHelper("linkPrimitive", (ref) => {
    switch (ref.name) {
        case "string": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String\">string</a>"
        case "number": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number\">number</a>"
        case "true":
        case "false":
        case "boolean": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean\">boolean</a>"
        case "undefined": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined\">undefined</a>"
        case "null": return "<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null\">null</a>"
        default: return ref.name;
    }
});

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
    if (data.type === "class") {
        return `
        <p>Methods</p> 
        <ul>
            ${data.methods.map(m => `<li><a href="#${m.name}">${m.name}</a></li>`).join("")}
        </ul>
        <p>Properties</p>
        <ul>
            ${data.properties.map(m => `<li><a href="#${m.name}">${m.name}</a></li>`).join("")}
        </ul>
        `
    } else if (data.type === "module") {
        const depth = "../".repeat(data.depth);
        return `
            ${data.pages ? data.pages.map(cat => `<p>${cat.name}</p><ul>${cat.pages.map(p => `<li><a href="${depth}pages/${cat.name}/${p.name}.html">${p.name}</a></li>`)}</ul>`).join(""):""}
            <p>Modules</p>
            <ul>${[...data.module.modules.values()].map(c => `<li><a href="${depth}m.${c.name}/index.html">${c.name}</a></li>`).join("")}</ul>
            <p>Classes</p>
            <ul>${[...data.module.classes.values()].map(c => `<li><a href="${depth}class/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
            <p>Interfaces</p>
            <ul>${[...data.module.interfaces.values()].map(c => `<li><a href="${depth}interface/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
            <p>Functions</p>
            <ul>${[...data.module.functions.values()].map(c => `<li><a href="${depth}function/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
            <p>Enums</p>
            <ul>${[...data.module.enums.values()].map(c => `<li><a href="${depth}enum/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
            <p>Types</p>
            <ul>${[...data.module.types.values()].map(c => `<li><a href="${depth}type/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
            <p>Constants</p>
            <ul>${data.module.constants.map(c => `<li><a href="${depth}constant/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
        `
    } else if (data.type === "interface") {
        return `
            <p>Properties</p>
            <ul>${data.properties.map(m => `<li><a href="#${m.name}">${m.name}</a></li>`).join("")}</ul>
        `;
    } else if (data.type === "enum") {
        return `
            <p>Members</p>
            <ul>${data.members.map(m => `<li><a href="#${m.name}">${m.name}</a></li>`).join("")}</ul>
        `;
    } else if (data.type === "index") {
        const depth = "../".repeat(data.depth);
        return `
            ${data.pages ? data.pages.map(cat => `<p>${cat.name}</p><ul>${cat.pages.map(p => `<li><a href="${depth}pages/${cat.name}/${p.name}.html">${p.name}</a></li>`)}</ul>`).join(""):""}
            <p>Modules</p>
            <ul>${data.packages.map(c => `<li><a href="${depth}m.${c.module.name}/index.html">${c.module.name}</a></li>`).join("")}</ul>
        `
    }
});