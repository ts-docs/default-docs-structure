import { initSearch } from "./search";
import { initSidebar } from "./sidebar";
import { initTheme } from "./theme";

declare global {

    interface Window {
        depth: string,
        lm?: string, // Latest Module
        ab?: boolean, // Alternate Branch
        t?: string // Locked theme
    }
}

initTheme(); 

window.addEventListener("load", () => {

    // Handles All the custom dropdowns
    const dropdownStates: Record<string, boolean> = localStorage.getItem("dropdowns") ? JSON.parse(localStorage.getItem("dropdowns") || "{}") : {};
    for (const el of (document.getElementsByClassName("collapsible-trigger") as unknown as Array<HTMLSpanElement>)) {
        const body = el.parentElement?.getElementsByClassName("collapsible-body")[0];
        if (!body) return;
        const arrow = el.getElementsByClassName("collapsible-arrow")[0];
        const state = dropdownStates[el.textContent || ""];
        if (state === false) {
            body.classList.remove("open");
            arrow.classList.remove("open");
        } else if (state === true) {
            body.classList.add("open");
            if (arrow) arrow.classList.toggle("open");
        }
        el.onclick = () => {
            dropdownStates[el.textContent || ""] = body.classList.toggle("open");
            localStorage.setItem("dropdowns", JSON.stringify(dropdownStates));
            if (arrow) arrow.classList.toggle("open");
        }
    }

    // Handles all the tooltips
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

    for (const codeTab of (document.getElementsByClassName("tab-code") as unknown as Array<HTMLSpanElement>)) {
        const tabs = codeTab.getElementsByClassName("tab-code-tab") as unknown as Array<HTMLSpanElement>;
        const codes = codeTab.getElementsByClassName("tab-code-code") as unknown as Array<HTMLSpanElement>;
        const tabLen = tabs.length;
        for (let i=0; i < tabLen; i++) {
            const tab = tabs[i];
            tab.onclick = () => {
                if (tab.classList.contains("selected")) return;
                tab.classList.add("selected");
                codes[i].style.display = "block";
                for (let j=0; j < tabLen; j++) {
                    if (j === i) continue;
                    tabs[j].classList.remove("selected");
                    codes[j].style.display = "none";
                }
            }
        }
        tabs[0].classList.add("selected");
        codes[0].style.display = "block";
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