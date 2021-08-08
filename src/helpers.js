
Handlebars.registerHelper("join", (args, delimiter) => {
    return args.join(delimiter);
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