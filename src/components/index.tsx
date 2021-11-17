
import { Generator, IndexData, PageTypes } from "@ts-docs/ts-docs";
import { SearchMenu } from "../partials/searchMenu";
import { Sidebar } from "../partials/Sidebar";

function NavigationPath({ path: [path, dir, filename], type }: IndexData) {
    if (type === PageTypes.CHANGELOG) return <span><a href="./index.html" class="path-member">index</a> / <a href="" class="path-member">changelog</a></span>;
    if (type === PageTypes.PAGE) return <span><a href="../../index.html" class="path-member">index</a> / <span class="path-member">{dir}</span> / <a href="" class="path-member">{filename}</a></span>;
    const newPath = path.split("/").slice(1);
    const len = newPath.length;
    let res = `<a href="${"../".repeat(len + 1)}index.html" class="path-member">index</a> / `;
    for (let i = 0; i < len; i++) {
        const part = newPath[i];
        res += <><a href={`${"../".repeat(len - i)}index.html`} class="path-member">{part.startsWith("m.") ? part.slice(2) : part}</a> / </>
    }
    if (filename === "index") res += <a class="path-member" href="">{dir.startsWith("m.") ? dir.slice(2) : dir}</a>;
    else res += <a class="path-member" href="">{filename}</a>;
    return res;
}

export function render(gen: Generator, data: IndexData) {
    const depth = "../".repeat(gen.depth);
    return <>
        {"<!DOCTYPE html>"}
        <html lang="en-US">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>{data.name ? `${data.name} | ` : ""} {gen.settings.name}</title>
                <meta name="description" content={`Documentation for ${gen.settings.name} v${gen.landingPage.version || ""}, ${data.name ? data.name : ""}`} /> 
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous" />
                <link id="highlightTheme" rel="stylesheet" crossOrigin="anonymous" />
                {(() => {
                    return <>
                        <link href={`${depth}assets/css/index.css`} type="text/css" rel="stylesheet" />
                        <script src={`${depth}assets/js/index.js`}></script>
                        <script>window.depth="{depth}";window.ab={gen.activeBranch !== "main"};{gen.currentGlobalModuleName ? `window.lm="${gen.currentGlobalModuleName}";` : ""}</script>
                    </>
                })()}
            </head>
            <body>
                <nav class="container-fluid navi">
                    <div class="row">
                        <div class="col-4">
                            <input class="form-control search" id="search" type="search" placeholder="Search..." aria-label="Search" />
                        </div>
                        <div class="col-8">
                            <div class="row float-end row-cols-auto" style="margin-top:5px">
                                <div class="col clickable-icon" id="theme-icon" />
                                {gen.settings.changelog ? (
                                    <a href={`${depth}changelog.html`} class="clickable-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-newspaper" viewBox="0 0 16 16">
                                            <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5v-11zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5H12z" />
                                            <path d="M2 3h10v2H2V3zm0 3h4v3H2V6zm0 4h4v1H2v-1zm0 2h4v1H2v-1zm5-6h2v1H7V6zm3 0h2v1h-2V6zM7 8h2v1H7V8zm3 0h2v1h-2V8zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1z" />
                                        </svg>
                                    </a>
                                ) : ""}
                                {gen.landingPage.repository ? (
                                    <div class="col">
                                        <a href={gen.landingPage.repository} class="clickable-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-github"
                                                viewBox="0 0 16 16">
                                                <path
                                                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                            </svg>
                                        </a>
                                    </div>
                                ) : ""}
                                {gen.landingPage.version ? (
                                    <div class="col">
                                        <span style="font-size: 1.2em">v{gen.landingPage.version}</span>
                                    </div>
                                ) : ""}
                            </div>
                        </div>
                    </div>
                </nav>

                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-auto sidebar" id="sidebar">
                            {Sidebar(gen, data)}
                        </div>
                        <div id="content" class="col content">
                            <SearchMenu />
                            <div id="content-main" class="d-none">
                                {data.path ? <div class="path"><NavigationPath {...data} /></div> : ""}
                                {data.content}
                            </div>

                        </div>

                    </div>
                </div>

                <div id="to-top" class="btn-to-top">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                    </svg>
                </div>

                <div id="sidebar-arrow" class="sidebar-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                    </svg>
                </div>
            </body>
        </html>
    </>;
}