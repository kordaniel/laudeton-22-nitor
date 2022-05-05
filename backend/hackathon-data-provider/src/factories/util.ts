const counters = new Map<string, number>()

export function id(prefix: string): string {
    let val = counters.get(prefix) || 0
    val++
    counters.set(prefix, val)
    return prefix + val
}