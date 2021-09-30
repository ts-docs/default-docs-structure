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
    NAMESPACE_OR_MODULE: 10,
    EXTERNAL: 11
}

Handlebars.registerHelper("join", (args, delimiter) => {
    if (!args) return "";
    return args.map(item => item.trim()).join(delimiter);
});

Handlebars.registerHelper("handlePaths", ([path, final]) => {
    // Special cases
    if (path === "" && final === "changelog") return `<a href="./index.html" class="path-member">index</a> / <a href="" class="path-member">changelog</a>`;
    if (path === "pages") return `<a href="../../index.html" class="path-member">index</a> / <span class="path-member">pages</span> / <a href="" class="path-member">${final}</a>`;
    path = path.split("/").slice(1);
    const len = path.length;
    let res = `<a href="${"../".repeat(len + 1)}index.html" class="path-member">index</a> / `;
    for (let i=0; i < len; i++) {
        const part = path[i];
        res += `<a href="${"../".repeat(len - i)}index.html" class="path-member">${part.slice(2)}</a> / `
    } 
    res += `<a class="path-member" href="">${final.startsWith("m.") ? final.slice(2) : final}</a>`;
    return res;
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
    <script>window.depth="${dpth}";window.ab=${mod.activeBranch !== "main"};${mod.currentGlobalModuleName ? `window.lm="${mod.currentGlobalModuleName}";`:""}</script>
    `
});

Handlebars.registerHelper("resolveDepth", (mod) => {
    return "../".repeat(mod.depth);
})

Handlebars.registerHelper("resolveOverloads", (overloads, options) => {
    if (overloads.length === 1) return options.fn({...overloads[0], renderSourceFile: true});
    const first = overloads.shift();
    return `
        <div>
        ${options.fn({...first, renderSourceFile: true})}
        <div style="margin-bottom: 15px">
        <div class="collapsible-trigger">
        <span class="collapsible-arrow"></span>
        <span class="secondary-text">${overloads.length} more overload${overloads.length === 1 ? "":"s"}</span>
        </div>
        <div class="collapsible-body">
        ${overloads.map(overload => options.fn(overload)).join("")}
        </div>
        </div>
        </div>
    `
});

Handlebars.registerHelper("handleReferenceKind", (ref) => {
    let type = "";
    const name = ref.displayName || ref.type.name;
    if (ref.type.link) {
        const display = ref.type.displayName ? `<span class="symbol">.</span><span>${ref.type.displayName}</span>` : "";
        return `<span class="c-tooltip"><a class="reference-link object" href="${ref.type.link}">${name}${display}</a><span class="c-tooltip-content"><span class="keyword">external item</span> <span class="item-name object">${ref.type.name}${display}</span></span></span>`
    }
    let typeClass = "object";
    switch (ref.type.kind) {
        case ReferenceTypes.CLASS: type = "class"; break;
        case ReferenceTypes.INTERFACE: type = "interface"; break;
        case ReferenceTypes.ENUM_MEMBER:
        case ReferenceTypes.ENUM: type = "enum"; break;
        case ReferenceTypes.TYPE_ALIAS: type = "type"; break;
        case ReferenceTypes.FUNCTION: type = "function"; typeClass = "method-name"; break;
        case ReferenceTypes.CONSTANT: type = "const"; typeClass = "constant"; break;
        case ReferenceTypes.NAMESPACE_OR_MODULE: return `<span class="c-tooltip"><a class="reference-link module" href="${ref.link}">${name}</a><span class="c-tooltip-content"><span class="keyword">module</span> <span class="item-name module">${ref.type.name}</span><span style="display:block" class="monospace fw-bold">${ref.type.path.join("/")}</span></span></span>`
        case ReferenceTypes.TYPE_PARAMETER: return `<span class="c-tooltip"><a class="reference-link object">${name}</a><span class="c-tooltip-content"><span class="keyword">type parameter</span> <span class="item-name object">${ref.type.name}</span></span></span>`;
        case ReferenceTypes.EXTERNAL: type = "item";
        default: return `<span class="reference-link item-name">${name}</span>`
    }
    if (ref.hash) {
        const isMethod = ref.hash.endsWith("()");
        if (isMethod) ref.hash = ref.hash.slice(0, -2);
        return `<a class="reference-link" href="${ref.link}#.${ref.hash}"><span class="object">${name}</span><span class="symbol">.</span><span class="${isMethod ? "method-name":"property-name"}">${ref.hash}</span></a>`;
    }
    let path = ref.type.path.join("/");
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

Handlebars.registerHelper("handleModuleIndex", (mod) => {
    return `
    ${mod.exports.length ? `
    <h2>Exports</h2>
    ${mod.exports.map(ex => `<div>${ex.ref}${ex.alias ? `<span class="keyword">as</span> <span class="item-name object">${ex.alias}</span></div>`:""}`).join("")}
    `:""}
    ${mod.reExports.length ? `
    <h2>Re-Exports</h2>
    ${mod.reExports.map(ex => {
        if (ex.references.length > 3) return `
        <div>
        <span class="keyword">exports</span>
        <span class="collapsible-trigger">
        <span class="collapsible-arrow"></span>
        <span class="keyword">${ex.references.length} things</span> ${ex.alias ? ` <span class="keyword">as</span> <span class="item-name object">${ex.alias}</span>`:""} <span class="keyword">from</span> ${ex.module}</span>
        <div class="collapsible-body"> 
        ${ex.references.map(ex => `<div>${ex.ref}${ex.alias ? `<span class="keyword">as</span> <span class="item-name object">${ex.alias}</span>`:""}</div>`).join("")}
        </div>
        </div>
        `
        else if (ex.references.length === 0) {
            if (ex.reExportsReExport) return `<div><span class="keyword">exports</span> <span class="item-name object">${ex.reExportsReExport}</span> ${ex.alias ? ` <span class="keyword">as</span> <span class="item-name object">${ex.alias}</span>`:""} <span class="keyword">from</span> ${ex.module}</div>`;
            return `<div><span class="keyword">exports</span> <span class="symbol">*</span> ${ex.alias ? ` <span class="keyword">as</span> <span class="item-name object">${ex.alias}</span>`:""} <span class="keyword">from</span> ${ex.module}</div>`;
        }
        else return `<div><span class="keyword">exports</span> ${ex.references.map(ex => `${ex.ref}${ex.alias ? `<span class="keyword">as</span> <span class="item-name object">${ex.alias}</span>`:""}`).join(", ")}${ex.alias ? ` <span class="keyword">as</span> <span class="item-name object">${ex.alias}</span>`:""} <span class="keyword">from</span> ${ex.module}</div>`;
    }).join("")}
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
            values: data.methods.map(m => `<a href="#.${m.realName || m.name}">${m.realName || m.name}</a>`)
        }); 
        currentThing = `<p class="current-thing text-center">class <span class="object">${data.name}</span></p>`;
    } else if (data.type === "module") {
        const depth = "../".repeat(data.depth);
        if (data.branches) {
            res.push({
                name: "Branches",
                values: [`<select id="branch-select" class="form-select"><option ${data.activeBranch === "main" ? "selected":""}>main</option>${data.branches.map(br => `<option ${data.activeBranch === br.displayName ? "selected":""}>${br.displayName}</option>`)}</select>`]
            })
        }
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
            values: [...data.module.modules.values()].map(c => `<a href="${goBack}m.${c.name}${c.id ? `_${c.id}`:""}/index.html">${c.name}</a>`)
        });
        if (data.module.classes.length) res.push({
            name: "Classes",
            values: data.module.classes.map(c => `<a href="${goBack}class/${c.name}${c.id ? `_${c.id}`:""}.html">${c.name}</a>`)
        });
        if (data.module.interfaces.length) res.push({
            name: "Interfaces",
            values: data.module.interfaces.map(c => `<a href="${goBack}interface/${c.name}${c.id ? `_${c.id}`:""}.html">${c.name}</a>`)
        });
        if (data.module.enums.length) res.push({
            name: "Enums",
            values: data.module.enums.map(c => `<a href="${goBack}enum/${c.name}${c.id ? `_${c.id}`:""}.html">${c.name}</a>`)
        }); 
        if (data.module.functions.length) res.push({
            name: "Functions",
            values: data.module.functions.map(c => `<a href="${goBack}function/${c.name}${c.id ? `_${c.id}`:""}.html">${c.name}</a>`)
        });
        if (data.module.types.length) res.push({
            name: "Types",
            values: data.module.types.map(c => `<a href="${goBack}type/${c.name}${c.id ? `_${c.id}`:""}.html">${c.name}</a>`)
        });
        if (data.module.constants.length) res.push({
            name: "Constants",
            values: data.module.constants.map(c => `<a href="${goBack}constant/${c.name}${c.id ? `_${c.id}`:""}.html">${c.name}</a>`)
        });
    } else if (data.type === "interface") {
        if (data.properties.length) res.push({
            name: "Properties",
            values: data.properties.map(m => `<a href="#.${m.value.name || "[key]"}">${m.value.name || "[key]"}</a>`)
        });
        currentThing = `<p class="current-thing">interface <span class="object">${data.name}</span></p>`;
    } else if (data.type === "enum") {
        if (data.members.length) res.push({
            name: "Members",
            values: data.members.map(m => `<a href="#.${m.name}">${m.name}</a>`)
        });
        currentThing = `<p class="current-thing text-center">enum <span class="object">${data.name}</span></p>`;
    } else if (data.type === "index") {
        if (data.branches) {
            res.push({
                name: "Branches",
                values: [`<select id="branch-select" class="form-select"><option ${data.activeBranch === "main" ? "selected":""}>main</option>${data.branches.map(br => `<option ${data.activeBranch === br.displayName ? "selected":""}>${br.displayName}</option>`)}</select>`]
            })
        }
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
            values: data.projects.map(c => `<a href="./m.${c.module.name}/index.html">${c.module.name}</a>`)
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