/// <reference path="../node_modules/@ts-docs/jsx-to-str/jsx.d.ts" />

import type {Generator} from "@ts-docs/ts-docs";
import fs from "fs";

export function init(gen: Generator) {
    const res: Record<string, unknown> = {};
    for (const filename of fs.readdirSync("./src/components")) {
        res[filename.slice(0, -4)] = require(`./components/${filename}`).render.bind(gen);
    }
    return res;
}