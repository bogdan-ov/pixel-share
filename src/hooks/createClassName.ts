export default function createClassName(classList: (string | undefined | null | false)[]): string {
    return classList.filter(a=> !!a).join(" ");
}