export function uniqItems<T>(items: T[]): T[] {
  const added = []
  const out = []
  for (const item of items) {
    if(added.indexOf((item as any).id) === -1) {
      out.push(item)
      added.push((item as any).id)
    }
  }
  return out
}
