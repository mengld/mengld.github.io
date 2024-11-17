import type { StreamItem } from '../types'
import { computed } from 'vue'

const streamModules = import.meta.glob('../../pages/streams/*.md', { eager: true })
export function useStreamData() {
  const streams = computed<StreamItem[]>(() => {
    return Object.values(streamModules)
      .map((mod: any) => {
        const { frontmatter, default: component } = mod
        return {
          ...(frontmatter as StreamItem),
          content: component.render().children,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  return streams.value
}
