import type { Directive, DirectiveBinding } from 'vue'

interface TooltipInstance {
  tooltipEl: HTMLElement
  hideTimer: ReturnType<typeof setTimeout> | null
  hideInnerTimer: ReturnType<typeof setTimeout> | null
  showTimer: ReturnType<typeof setTimeout> | null
  rafId: number | null
  mouseenterHandler: () => void
  mouseleaveHandler: () => void
}

interface TooltipEl extends HTMLElement {
  __tooltip_instance__?: TooltipInstance
}

const TOOLTIP_OFFSET = 12
const SHOW_DELAY = 200
const HIDE_DELAY = 300
const FADE_DURATION = 200
const MAX_WIDTH = 280

function createTooltipEl(content: string): HTMLElement {
  const el = document.createElement('div')
  el.className = 'v-tooltip'
  el.setAttribute('aria-hidden', 'true')
  el.style.cssText = `
    position: fixed;
    z-index: 9999;
    max-width: ${MAX_WIDTH}px;
    padding: 10px 14px;
    background: rgba(31, 60, 42, 0.96);
    color: #fff;
    font-size: 13px;
    line-height: 1.6;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    pointer-events: none;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease;
    backdrop-filter: blur(6px);
    word-break: break-word;
  `
  el.textContent = content
  return el
}

function calcPosition(targetEl: HTMLElement, tooltipEl: HTMLElement) {
  const targetRect = targetEl.getBoundingClientRect()
  const tooltipRect = tooltipEl.getBoundingClientRect()
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight

  let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
  let top = targetRect.bottom + TOOLTIP_OFFSET

  if (left + tooltipRect.width > viewportW - 8) {
    left = viewportW - tooltipRect.width - 8
  }
  if (left < 8) {
    left = 8
  }

  if (top + tooltipRect.height > viewportH - 8) {
    top = targetRect.top - TOOLTIP_OFFSET - tooltipRect.height
    if (top < 8) {
      top = targetRect.bottom + TOOLTIP_OFFSET
      if (top + tooltipRect.height > viewportH - 8) {
        top = viewportH - tooltipRect.height - 8
      }
    }
  }

  return { left, top }
}

function showTooltip(el: TooltipEl) {
  const inst = el.__tooltip_instance__
  if (!inst) return
  if (inst.showTimer) {
    clearTimeout(inst.showTimer)
    inst.showTimer = null
  }
  if (inst.hideTimer) {
    clearTimeout(inst.hideTimer)
    inst.hideTimer = null
  }
  if (inst.hideInnerTimer) {
    clearTimeout(inst.hideInnerTimer)
    inst.hideInnerTimer = null
  }
  if (inst.rafId !== null) {
    cancelAnimationFrame(inst.rafId)
    inst.rafId = null
  }

  inst.showTimer = setTimeout(() => {
    inst.showTimer = null
    const { tooltipEl } = inst
    if (!tooltipEl.isConnected) {
      document.body.appendChild(tooltipEl)
    }
    tooltipEl.style.visibility = 'hidden'
    tooltipEl.style.opacity = '0'
    inst.rafId = requestAnimationFrame(() => {
      inst.rafId = null
      const { left, top } = calcPosition(el, tooltipEl)
      tooltipEl.style.left = `${left}px`
      tooltipEl.style.top = `${top}px`
      tooltipEl.style.visibility = 'visible'
      tooltipEl.style.opacity = '1'
      tooltipEl.style.transform = 'translateY(0)'
    })
  }, SHOW_DELAY)
}

function hideTooltip(el: TooltipEl) {
  const inst = el.__tooltip_instance__
  if (!inst) return
  if (inst.showTimer) {
    clearTimeout(inst.showTimer)
    inst.showTimer = null
  }
  if (inst.rafId !== null) {
    cancelAnimationFrame(inst.rafId)
    inst.rafId = null
  }
  if (inst.hideTimer) {
    clearTimeout(inst.hideTimer)
  }
  inst.hideTimer = setTimeout(() => {
    inst.hideTimer = null
    const { tooltipEl } = inst
    tooltipEl.style.opacity = '0'
    tooltipEl.style.transform = 'translateY(4px)'
    inst.hideInnerTimer = setTimeout(() => {
      inst.hideInnerTimer = null
      if (tooltipEl.isConnected) {
        tooltipEl.remove()
      }
    }, FADE_DURATION)
  }, HIDE_DELAY)
}

function mountTooltip(el: TooltipEl, binding: DirectiveBinding<string>) {
  const content = binding.value
  if (!content) return

  const tooltipEl = createTooltipEl(content)
  const mouseenterHandler = () => showTooltip(el)
  const mouseleaveHandler = () => hideTooltip(el)

  el.__tooltip_instance__ = {
    tooltipEl,
    hideTimer: null,
    hideInnerTimer: null,
    showTimer: null,
    rafId: null,
    mouseenterHandler,
    mouseleaveHandler
  }

  el.addEventListener('mouseenter', mouseenterHandler)
  el.addEventListener('mouseleave', mouseleaveHandler)
  if (!el.style.cursor || el.style.cursor === 'auto') {
    el.style.cursor = 'pointer'
  }
}

function cleanupInstance(el: TooltipEl) {
  const inst = el.__tooltip_instance__
  if (!inst) return
  if (inst.showTimer) clearTimeout(inst.showTimer)
  if (inst.hideTimer) clearTimeout(inst.hideTimer)
  if (inst.hideInnerTimer) clearTimeout(inst.hideInnerTimer)
  if (inst.rafId !== null) cancelAnimationFrame(inst.rafId)
  if (inst.tooltipEl && inst.tooltipEl.isConnected) {
    inst.tooltipEl.remove()
  }
  el.removeEventListener('mouseenter', inst.mouseenterHandler)
  el.removeEventListener('mouseleave', inst.mouseleaveHandler)
  el.__tooltip_instance__ = undefined
}

export const vTooltip: Directive<TooltipEl, string> = {
  mounted(el, binding) {
    mountTooltip(el, binding)
  },

  updated(el, binding) {
    const inst = el.__tooltip_instance__
    if (!inst) {
      if (binding.value) {
        mountTooltip(el, binding)
      }
      return
    }
    if (binding.value !== binding.oldValue) {
      if (!binding.value) {
        cleanupInstance(el)
        return
      }
      inst.tooltipEl.textContent = binding.value
    }
  },

  unmounted(el) {
    cleanupInstance(el)
  }
}

export default vTooltip
