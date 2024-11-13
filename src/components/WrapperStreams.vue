<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatDate } from '../logics'

const props = defineProps<{
  perPage?: number
}>()

// 动态导入 streams 目录下的所有 Markdown 文件
const streamModules = import.meta.glob('../../pages/streams/*.md', { eager: true })

// 提取并排序所有流的数据
const allStreams = Object.values(streamModules).map((module: any): Stream => {
  const frontmatter = module.frontmatter || {}
  return {
    date: frontmatter.date,
    location: frontmatter.location,
    weather: frontmatter.weather,
    content: typeof module.default === 'string'
      ? module.default
      : module.default?.html || module.default?.content || '',
  }
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// 分页逻辑
const perPage = computed(() => props.perPage || 10)
const currentPage = ref(1)
const total = computed(() => allStreams.length)
const totalPages = computed(() => Math.ceil(total.value / perPage.value))

// 计算当前页显示的内容
const paginatedStreams = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return allStreams.slice(start, end)
})

function nextPage() {
  if (currentPage.value < totalPages.value)
    currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1)
    currentPage.value--
}
</script>

<template>
  <div class="stream-container">
    <div
      v-for="stream in paginatedStreams"
      :key="stream.date"
      class="stream-item mb-8 p-4 rounded-lg bg-gray:5"
    >
      <!-- 头部信息 -->
      <div class="stream-header" flex="~ gap-2 items-center" text-sm op50>
        <div i-ri-time-line />
        {{ formatDate(stream.date) }}

        <template v-if="stream.location">
          <div i-ri-map-pin-line />
          {{ stream.location }}
        </template>

        <template v-if="stream.weather">
          <div :class="stream.weather.icon" />
          {{ stream.weather.temperature }}°C {{ stream.weather.condition }}
        </template>
      </div>

      <!-- 内容 -->
      <div class="stream-content" my-4 text-lg>
        <div v-html="stream.content" />
      </div>

      <!-- 分页控件 -->
      <div class="pagination" flex="~ gap-4 justify-center" my-8>
        <button
          class="btn"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          上一页
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="btn"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
