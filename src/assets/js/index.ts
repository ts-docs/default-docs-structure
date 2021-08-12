
window.onload = () => {
    const els = document.getElementsByClassName("collapsible-trigger") as HTMLCollectionOf<HTMLSpanElement>;
    for (let i=0; i < els.length; i++) {
        const el = els[i];
        el.onclick = function(ev: MouseEvent) {
            const body = el.parentElement?.getElementsByClassName("collapsible-body")[0];
            if (!body) return;
            body.classList.toggle("open");
            const arrow = el.getElementsByClassName("collapsible-arrow")[0];
            if (arrow) arrow.classList.toggle("open");
        }
    }
}