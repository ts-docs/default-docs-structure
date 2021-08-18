import { initSearch } from "./search";
import { initTheme } from "./theme";

declare global {

    interface Window {
        depth: string,
        lm?: string
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
        if (!tooltipContent || tooltipContent.classList.contains("open")) return;
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

    const contentMain = document.getElementById("content-main")!;
    const searchMenu = document.getElementById("search-menu")!;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("search")) searchMenu.classList.remove("d-none");
    else contentMain.classList.remove("d-none");
    initSearch(searchParams, contentMain, searchMenu);

    const scrollToTopBtn = document.getElementById("to-top")!;
    const contentCol = document.getElementById("content")!;

    contentCol.addEventListener("scroll", () => {
        if (contentCol.scrollTop > 600 || contentCol.scrollTop > 600) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });

    scrollToTopBtn.onclick = () => contentCol.scroll({top: 0, behavior: "smooth" });
}); 