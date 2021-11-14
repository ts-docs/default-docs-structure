import { Heading, IndexData, PageTypes, Generator } from "@ts-docs/ts-docs";
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
                values: filteredProps.map(({ prop }) => <a href={`#.${prop!.rawName}`}>{prop!.rawName}</a>)
            });
            if (index.class!.methods.length) sidebarCategories.push({
                name: "Methods",
                values: index.class!.methods.map(method => <a href={`#.${method.rawName}`}>{method.rawName}</a>)
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
                values: index.enum!.members.map(m => <a href={`#.${m.name}`}>${m.name}</a>)
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
                            <option selected={gen.activeBranch === "main" ? true : false}>main</option>
                            {...gen.settings.branches.map(br => <option>{br.displayName}</option>)}
                        </select>
                    ]
                });
                if (gen.settings.customPages) {
                    for (const category of gen.settings.customPages) {
                        sidebarCategories.push({
                            name: "Pages",
                            values: gen.settings.customPages.map(p => <a href={`./pages/${category.name}/${p.name}.html`}>{p.name}</a>)
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