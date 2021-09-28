import { initSearch } from "./search";
import { initSidebar } from "./sidebar";
import { initTheme } from "./theme";

declare global {

    interface Window {
        depth: string,
        lm?: string, // Latest Module
        ab?: boolean // Alternate Branch
    }
}

initTheme(); 

window.addEventListener("load", () => {

    for (const el of (document.getElementsByClassName("collapsible-trigger") as unknown as Array<HTMLSpanElement>)) {
        el.onclick = () => {
            const body = el.parentElement?.getElementsByClassName("collapsible-body")[0];
            if (!body) return;
            body.classList.toggle("open");
            const arrow = el.getElementsByClassName("collapsible-arrow")[0];
            if (arrow) arrow.classList.toggle("open");
        }
    }

    for (const tooltip of (document.getElementsByClassName("c-tooltip") as unknown as Array<HTMLSpanElement>)) {
        let timeout: any;
        const tooltipContent = tooltip.getElementsByClassName("c-tooltip-content")[0];
        if (!tooltipContent) continue;
        tooltip.onmouseover = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                tooltipContent.classList.add("open");
            }, 600);
        }
        tooltip.onmouseleave = () => {
            clearTimeout(timeout);
            tooltipContent.classList.remove("open");
        }
    }

    const branchSelect = document.getElementById("branch-select");
    if (branchSelect) {
        branchSelect.onchange = (ev) => {
            const target = ev.target as HTMLSelectElement;
            if (window.ab) window.depth += "../";
            if (target.value === "main") location.href = `${window.depth}index.html`;
            else location.href = `${window.depth}b.${target.value}/index.html`
        }
    }

    const contentMain = document.getElementById("content-main")!;
    const searchMenu = document.getElementById("search-menu")!;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("search")) searchMenu.classList.remove("d-none");
    else contentMain.classList.remove("d-none");
    initSearch(searchParams, contentMain, searchMenu);

    const scrollToTopBtn = document.getElementById("to-top")!;
    const content = document.getElementById("content")!;

    content.addEventListener("scroll", () => {
        if (content.scrollTop > 600 || content.scrollTop > 600) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });

    scrollToTopBtn.onclick = () => content.scroll({top: 0, behavior: "smooth" });

    initSidebar(contentMain);
}); 