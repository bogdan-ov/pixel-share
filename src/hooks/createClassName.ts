export default function createClassName(classList: (string | undefined | null | false)[]): string {
    return classList.filter(Boolean).join(" ");
}