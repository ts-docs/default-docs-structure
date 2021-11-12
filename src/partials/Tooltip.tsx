

export function Tooltip(inside: string, children: string) {
    return <span class="c-tooltip">
        {children}
        <span class="c-tooltip-content">{inside}</span>
    </span>
}