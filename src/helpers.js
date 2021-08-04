
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
        return `
            <p>Modules</p>
            <ul>${[...data.modules.values()].map(c => `<li><a href="./m.${c.name}/index.html">${c.name}</a></li>`).join("")}</ul>
            <p>Classes</p>
            <ul>${[...data.classes.values()].map(c => `<li><a href="./class/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
            <p>Interfaces</p>
            <ul>${[...data.interfaces.values()].map(c => `<li><a href="./interface/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
            <p>Enums</p>
            <ul>${[...data.enums.values()].map(c => `<li><a href="./enum/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
            <p>Types</p>
            <ul>${[...data.types.values()].map(c => `<li><a href="./type/${c.name}.html">${c.name}</a></li>`).join("")}</ul>
        `
    } else if (data.type === "index") {
        return `
            <p>Modules</p>
            <ul>${data.packages.map(c => `<li><a href="./m.${c.module.name}/index.html">${c.module.name}</a></li>`).join("")}</ul>
        `
    }
});