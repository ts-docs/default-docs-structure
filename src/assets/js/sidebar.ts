
const arrowLeft = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>';
let arrowRight: string = "";


export function initSidebar(contentMain: HTMLElement) {
    const sidebarBtn = document.getElementById("sidebar-arrow");
    if (!sidebarBtn) return;
    // sidebar button always starts off as ->
    arrowRight = sidebarBtn.innerHTML;
    const sidebar = document.getElementById("sidebar")!;
    
    sidebarBtn.onclick = () => { 
        if (sidebar.style.display === "block") {
            sidebar.style.display = "none";
            sidebarBtn.innerHTML = arrowRight;
        } else {
            sidebar.style.display = "block";
            sidebarBtn.innerHTML = arrowLeft;
        }
    }

    contentMain.addEventListener("click", (event) => {
        if (window.innerWidth > 680 || event.target === sidebarBtn) return;
        sidebar.style.display = "none";
        sidebarBtn.innerHTML = arrowRight;
    });
    
}