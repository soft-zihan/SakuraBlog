import { ref } from 'vue'

/**
 * 图片灯箱 composable
 */
export function useLightbox() {
  const lightboxImage = ref<string | null>(null)

  /**
   * 打开灯箱
   */
  const openLightbox = (src: string) => {
    lightboxImage.value = src
  }

  /**
   * 关闭灯箱
   */
  const closeLightbox = () => {
    lightboxImage.value = null
  }

  /**
   * 处理图片点击
   */
  const handleImageClick = (target: HTMLElement) => {
    if (target.tagName === 'IMG') {
      openLightbox((target as HTMLImageElement).src)
      return true
    }
    return false
  }

  return {
    lightboxImage,
    openLightbox,
    closeLightbox,
    handleImageClick
  }
}
