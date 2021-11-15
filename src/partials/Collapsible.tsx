

export function Collapsible(props: { text: string, open?: boolean, asSpan?: boolean }, child: string) {
    return props.asSpan ? <>
        <span class="collapsible-trigger">
            <span class={`collapsible-arrow${props.open ? " open" : ""}`} />
            {props.text}
        </span>
        <div class={`collapsible-body${props.open ? " open" : ""}`}>
            {child}
        </div>
    </> : <>
        <div class="collapsible-trigger">
            <span class={`collapsible-arrow${props.open ? " open" : ""}`} />
            {props.text}
        </div>
        <div class={`collapsible-body${props.open ? " open" : ""}`}>
            {child}
        </div>
    </>
}

