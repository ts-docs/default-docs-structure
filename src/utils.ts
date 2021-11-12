
import path from "path";

export function getPathFileName(p?: string) : string|undefined {
    if (!p) return;
    return path.parse(p).name;
}