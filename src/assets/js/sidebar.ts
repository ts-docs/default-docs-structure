

export function initSidebar(contentMain: HTMLElement) {
    const sidebarBtn = document.getElementById("sidebar-arrow");
    if (!sidebarBtn) return;
    const sidebar = document.getElementById("sidebar")!;

    
    sidebarBtn.onclick = () => { 
        sidebar.classList.add("d-block");
        sidebarBtn.classList.add("d-none");
    }

    contentMain.addEventListener("click", () => {
        if (window.innerWidth > 680) return;
        sidebar.classList.remove("d-block");
        sidebarBtn.classList.remove("d-none");
    });
    
}