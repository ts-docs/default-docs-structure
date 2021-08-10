
window.onload = () => {
    const els = document.getElementsByClassName("collapsible-arrow") as HTMLCollectionOf<HTMLSpanElement>;
    console.log(els.length);
    for (let i=0; i < els.length; i++) {
        els[i].onclick = function(ev: MouseEvent) {
            const el = ev.target as HTMLSpanElement;
            const body = el.parentElement?.getElementsByClassName("collapsible-body")[0];
            if (!body) return;
            body.classList.toggle("open");
            el.classList.toggle("open");
        }
    }
}