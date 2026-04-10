/**
 * Fixes bidirectional text rendering for mixed Hebrew/code content.
 * Wraps code-like patterns (square brackets for Python lists/output) with
 * Unicode LTR Isolate characters so they render correctly in RTL context.
 *
 * Without this fix, "[5, 13]" in an RTL paragraph would display as "[13 ,5]"
 * due to the Unicode BiDi algorithm reordering neutral characters.
 */
export function fixCodeDirection(text: string): string {
    // U+2066 = Left-to-Right Isolate (LRI)
    // U+2069 = Pop Directional Isolate (PDI)
    return text.replace(/\[([^\]]*)\]/g, '\u2066[$1]\u2069');
}
