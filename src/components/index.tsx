import { Generator, PageTypes, StaticDocumentationData } from "@ts-docs/ts-docs";

export interface IndexData {
    name?: string,
    type: PageTypes
}

export function render(gen: Generator, staticData: StaticDocumentationData, data: IndexData) {
    const template = 
    <html>
        <head>
            <meta charSet="utf-8"> </meta>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> </meta>
            <title>{data.name ? `${data.name} |` : ""} {staticData.headerName}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous"></link>
            <link id="highlightTheme" rel="stylesheet" crossOrigin="anonymous"></link>
        </head>
    </html>;
    return "<!DOCTYPE html>" + template;
}

//@ts-expect-error
window.render = render;