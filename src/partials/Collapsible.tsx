

export function Collapsible(props: { text: string, open?: boolean }, child: string) {
    return <>
        <div class="collapsible-trigger">
            <span class={`collapsible-arrow${props.open ? " open" : ""}`} />
            {props.text}
        </div>
        <div class={`collapsible-body${props.open ? " open" : ""}`}>
            {child}
        </div>
    </>
}