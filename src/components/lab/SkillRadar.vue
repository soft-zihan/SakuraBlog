<script setup lang="ts">
import { computed } from 'vue'

type SkillItem = {
  name: string
  value: number
}

const props = withDefaults(defineProps<{
  skills: SkillItem[]
  size?: number
  max?: number
}>(), {
  size: 240,
  max: 100
})

const normalizedSkills = computed(() => {
  return props.skills
    .filter(s => s && typeof s.name === 'string')
    .map(s => ({
      name: s.name,
      value: Math.max(0, Math.min(props.max, Number.isFinite(s.value) ? s.value : 0))
    }))
})

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size / 2) * 0.72)

function pointAt(index: number, value: number, count: number) {
  const angle = (-Math.PI / 2) + (index * 2 * Math.PI) / count
  const r = (value / props.max) * radius.value
  const x = center.value + r * Math.cos(angle)
  const y = center.value + r * Math.sin(angle)
  return { x, y }
}

const gridLevels = computed(() => [0.25, 0.5, 0.75, 1])

const gridPolygons = computed(() => {
  const skills = normalizedSkills.value
  const n = skills.length || 1
  return gridLevels.value.map(level => {
    const points = skills.map((_, i) => {
      const p = pointAt(i, props.max * level, n)
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
    })
    return points.join(' ')
  })
})

const axisLines = computed(() => {
  const skills = normalizedSkills.value
  const n = skills.length || 1
  return skills.map((_, i) => {
    const p = pointAt(i, props.max, n)
    return { x1: center.value, y1: center.value, x2: p.x, y2: p.y }
  })
})

const dataPolygon = computed(() => {
  const skills = normalizedSkills.value
  const n = skills.length || 1
  const points = skills.map((s, i) => {
    const p = pointAt(i, s.value, n)
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
  })
  return points.join(' ')
})

const labelPoints = computed(() => {
  const skills = normalizedSkills.value
  const n = skills.length || 1
  return skills.map((s, i) => {
    const p = pointAt(i, props.max, n)
    const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / n
    const labelRadius = radius.value + 18
    const x = center.value + labelRadius * Math.cos(angle)
    const y = center.value + labelRadius * Math.sin(angle)
    return { name: s.name, value: s.value, x, y, angle }
  })
})

function textAnchorFor(angle: number) {
  const cos = Math.cos(angle)
  if (cos > 0.35) return 'start'
  if (cos < -0.35) return 'end'
  return 'middle'
}

function dominantBaselineFor(angle: number) {
  const sin = Math.sin(angle)
  if (sin > 0.35) return 'hanging'
  if (sin < -0.35) return 'baseline'
  return 'middle'
}
</script>

<template>
  <div class="w-full">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="mx-auto block">
      <g>
        <polygon
          v-for="(points, idx) in gridPolygons"
          :key="idx"
          :points="points"
          fill="none"
          stroke="currentColor"
          class="text-gray-200 dark:text-gray-700"
          stroke-width="1"
          opacity="0.7"
        />
        <line
          v-for="(line, idx) in axisLines"
          :key="idx"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="currentColor"
          class="text-gray-200 dark:text-gray-700"
          stroke-width="1"
          opacity="0.7"
        />
      </g>

      <polygon
        :points="dataPolygon"
        fill="currentColor"
        class="text-[var(--primary-500)]"
        opacity="0.18"
        stroke="currentColor"
        stroke-width="2"
      />

      <g>
        <circle
          v-for="(p, idx) in normalizedSkills"
          :key="idx"
          :cx="pointAt(idx, p.value, normalizedSkills.length || 1).x"
          :cy="pointAt(idx, p.value, normalizedSkills.length || 1).y"
          r="3"
          fill="currentColor"
          class="text-[var(--primary-500)]"
        />
      </g>

      <g>
        <g v-for="(p, idx) in labelPoints" :key="idx">
          <text
            :x="p.x"
            :y="p.y"
            :text-anchor="textAnchorFor(p.angle)"
            :dominant-baseline="dominantBaselineFor(p.angle)"
            class="fill-gray-600 dark:fill-gray-300"
            font-size="10"
            font-weight="600"
          >
            {{ p.name }}
          </text>
          <text
            :x="p.x"
            :y="p.y + 12"
            :text-anchor="textAnchorFor(p.angle)"
            class="fill-gray-400 dark:fill-gray-500"
            font-size="9"
          >
            {{ Math.round(p.value) }}%
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>
