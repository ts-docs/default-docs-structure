/// <reference path="../node_modules/@ts-docs/jsx-to-str/jsx.d.ts" />

import type {Generator} from "@ts-docs/ts-docs";
import path from "path";
import fs from "fs";

export function init(gen: Generator) {
    const res: Record<string, unknown> = {};
    for (const filename of fs.readdirSync(path.join(__dirname, "./components"))) {
        res[filename.slice(0, -3)] = require(`./components/${filename}`).render.bind(undefined, gen);
    }
    return res;
}