import { FileExports } from "@ts-docs/extractor/dist/extractor/ExportHandler";
import { Heading, IndexData, PageTypes, Generator } from "@ts-docs/ts-docs";
import { ExportsSidebar } from "../components/module";
import { Collapsible } from "./Collapsible";

function generateHeadings(heading: Heading) {
    return heading.subHeadings.length ? <div>
        <a class="fw-bold" href={`#${heading.id}`}>{heading.name}</a>
        <div style="padding-left:15px">
            {...heading.subHeadings.map(s => generateHeadings(s))}
        </div>
    </div>
        : <a href={`#${heading.id}`} class="sidebar-category-member">{heading.name}</a>;
}

export function Sidebar(gen: Generator, index: IndexData) {
    const sidebarCategories: Array<{
        name: string,
        values: Array<string>
    }> = [];

    let currentThing = "";

    switch (index.type) {
        case PageTypes.CLASS: {
            const filteredProps = index.class!.properties.filter(prop => prop.prop);
            if (filteredProps.length) sidebarCategories.push({
                name: "Properties",
                values: filteredProps.map(({ prop, isStatic, isPrivate }) => <a href={`#.${prop!.rawName}`}>{prop!.rawName}{isStatic ? <span class="badge badge-on-prop" title="static property">S</span> : ""}{isPrivate ? <span class="badge badge-on-prop" title="private property">P</span> : ""}</a>)
            });
            if (index.class!.methods.length) sidebarCategories.push({
                name: "Methods",
                values: index.class!.methods.map(method => <a href={`#.${method.rawName}`}>{method.rawName}{method.isStatic ? <span class="badge badge-on-prop" title="static method">S</span> : ""}{method.isPrivate ? <span class="badge badge-on-prop" title="private method">P</span> : ""}</a>)
            });
            currentThing = <>class <span class="object">{index.class!.name}</span></>
            break;
        }
        case PageTypes.INTERFACE: {
            const filteredProps = index.interface!.properties.filter(prop => prop.prop);
            if (filteredProps.length) sidebarCategories.push({
                name: "Properties",
                values: filteredProps.map(({ prop }) => <a href={`#.${prop!.rawName}`}>{prop!.rawName}</a>)
            });
            currentThing = <>interface <span class="object">{index.interface!.name}</span></>;
            break;
        }
        case PageTypes.ENUM: {
            if (index.enum!.members.length) sidebarCategories.push({
                name: "Members",
                values: index.enum!.members.map(m => <a href={`#.${m.name}`}>{m.name}</a>)
            });
            currentThing = <>enum <span class="object">{index.enum!.name}</span></>;
            break;
        }
        case PageTypes.PAGE: {
            for (const heading of index.headings) sidebarCategories.push({
                name: <a id={`#${heading.id}`}>{heading.name}</a>,
                values: heading.subHeadings.map(sub => generateHeadings(sub))
            });
            for (const category of index.pages) sidebarCategories.push({
                name: category.name,
                values: category.pages.map(p => <a href={`../${category.name}/${p.name}.html`}>{p.name}</a>)
            })
            break;
        }
        default: {
            if (gen.depth === 0) {
                if (gen.settings.branches) sidebarCategories.push({
                    name: "Branches",
                    values: [
                        <select id="branch-select" class="form-select">
                            {`<option ${gen.activeBranch === "main" ? "selected" : ""}>main</option>`}
                            {...gen.settings.branches.map(br => `<option ${gen.activeBranch === br.displayName ? "selected" : ""}>${br.displayName}</option>`)}
                        </select>
                    ]
                });
                if (gen.settings.customPages) {
                    for (const category of gen.settings.customPages) {
                        sidebarCategories.push({
                            name: category.name,
                            values: category.pages.map(p => {
                                if (p.attributes.redirect) return <a href={p.attributes.redirect} target="_blank">
                                    <span style="position: relative; top: -2.25px; right: 3px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-box-arrow-up-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M7.364 3.5a.5.5 0 0 1 .5-.5H14.5A1.5 1.5 0 0 1 16 4.5v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 14.5V7.864a.5.5 0 1 1 1 0V14.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5H7.864a.5.5 0 0 1-.5-.5z"/>
                                        <path fill-rule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h5a.5.5 0 0 1 0 1H1.707l8.147 8.146a.5.5 0 0 1-.708.708L1 1.707V5.5a.5.5 0 0 1-1 0v-5z"/>
                                    </svg>
                                    </span>
                                    {p.name}
                                </a>
                                return <a href={`./pages/${category.name}/${p.name}.html`}>{p.name}</a>;
                            })
                        });
                    }
                }
            }
            if (index.type === PageTypes.INDEX) {
                sidebarCategories.push({
                    name: "Modules",
                    values: index.projects.map(p => <a href={`./m.${p.module.name}/index.html`}>{p.module.name}</a>)
                });
            }
            else {
                const goBack = index.type === PageTypes.MODULE ? "" : "../";
                const module = index.module!;
                currentThing = <>module <span class="module">{module.name}</span></>
                if (gen.settings.exportMode === "detailed" && index.exports) sidebarCategories.push(ExportsSidebar(gen, index.exports as Record<string, FileExports>));
                if (module.modules.size) sidebarCategories.push({
                    name: "Modules",
                    values: [...module.modules.values()].map(c => <a href={`${goBack}m.${c.name}/index.html`}>{c.name}</a>)
                });
                if (module.classes.length) sidebarCategories.push({
                    name: "Classes",
                    values: module.classes.map(c => <a href={`${goBack}class/${c.name}${c.id ? `_${c.id}` : ""}.html`}>{c.name}</a>)
                });
                if (module.interfaces.length) sidebarCategories.push({
                    name: "Interfaces",
                    values: module.interfaces.map(c => <a href={`${goBack}interface/${c.name}${c.id ? `_${c.id}` : ""}.html`}>{c.name}</a>)
                });
                if (module.enums.length) sidebarCategories.push({
                    name: "Enums",
                    values: module.enums.map(c => <a href={`${goBack}enum/${c.name}${c.id ? `_${c.id}` : ""}.html`}>{c.name}</a>)
                });
                if (module.functions.length) sidebarCategories.push({
                    name: "Functions",
                    values: module.functions.map(c => <a href={`${goBack}function/${c.name}${c.id ? `_${c.id}` : ""}.html`}>{c.name}</a>)
                });
                if (module.types.length) sidebarCategories.push({
                    name: "Types",
                    values: module.types.map(c => <a href={`${goBack}type/${c.name}${c.id ? `_${c.id}` : ""}.html`}>{c.name}</a>)
                });
                if (module.constants.length) sidebarCategories.push({
                    name: "Constants",
                    values: module.constants.map(c => <a href={`${goBack}constant/${c.name}${c.id ? `_${c.id}` : ""}.html`}>{c.name}</a>)
                });

            }
        }
            break;
    }
    const depth = "../".repeat(gen.depth);
    return <>
        <h1 class="lib-name text-center"><a href={`${depth}index.html`}>{gen.settings.name}</a></h1>
        {gen.settings.logo ? <img src={`${depth}${gen.settings.logo}`} alt="Logo" class="img-fluid mx-auto d-block"></img> : ""}
        <p class="current-thing text-center">{currentThing}</p>
        <div class="sidebar-members">
            {sidebarCategories.map(thing => <div class="sidebar-member">
                <Collapsible text={<span class="sidebar-category">{thing.name}</span>} open={true}>
                    {thing.values.map(val => <span class="sidebar-category-member">{val}</span>).join("")}
                </Collapsible>
            </div>).join("")}
        </div>
    </>
}