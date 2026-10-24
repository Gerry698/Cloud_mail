import {nextTick, onBeforeUnmount, watch} from 'vue'

// Keep keyboard navigation inside a mobile drawer without stealing nested dialogs.
export function useDrawerFocus(open, panelId, triggerSelector, close) {
  const focusable = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  const visible = element => element.getClientRects().length && !element.closest('[inert]')
  let previouslyFocused = null

  watch(open, async shown => {
    if (shown) previouslyFocused = document.activeElement
    await nextTick()
    if (shown && open.value) {
      const panel = document.getElementById(panelId)
      const first = [...(panel?.querySelectorAll(focusable) || [])].find(visible)
      ;(first || panel)?.focus()
    } else if (!shown && previouslyFocused) {
      const panel = document.getElementById(panelId)
      const active = document.activeElement
      if (panel?.inert && (panel.contains(active) || active === document.body)) {
        const trigger = document.querySelector(triggerSelector)
        ;(trigger || previouslyFocused)?.focus?.()
      }
      previouslyFocused = null
    }
  })

  function keydown(event) {
    if (!open.value || event.defaultPrevented) return
    if ([...document.querySelectorAll('[role="dialog"], .el-popper, .tox-dialog, .write-box')].some(visible)) return
    const panel = document.getElementById(panelId)
    if (!panel) return
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      const items = [...panel.querySelectorAll(focusable)].filter(visible)
      const first = items[0]
      const last = items.at(-1)
      if (!first) { event.preventDefault(); panel.focus(); return }
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault(); first.focus()
      }
    }
  }

  document.addEventListener('keydown', keydown)
  onBeforeUnmount(() => document.removeEventListener('keydown', keydown))
}
