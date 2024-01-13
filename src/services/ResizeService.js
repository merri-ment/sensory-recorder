import env from '@/config/env'
import SassVars from '@/styles/config/variables.module.sass'

// ----------------------------------
// ADJUST ACTUAL BREAKPOINTS IN:
// src/styles/config/variables.sass
// ----------------------------------

export const EVENTS = {
  RESIZE: 'resize',
  PRESIZE: 'presize', // called before resize
}

class ResizeService {
  get EVENTS() {
    return EVENTS
  }

  constructor(config) {
    Object.assign(this, EventEmitter)
    Object.assign(this, EventObserver)

    const breakpoints = {}
    const deviceTypes = {}
    // Get breakpoints and device types from Sass
    SassVars.breakpoints.split(',').forEach((b) => {
      const point = b.trim()

      breakpoints[point] = {
        name: point,
        width: parseInt(SassVars[`breakpoint_${point}_width`]),
        height: parseInt(SassVars[`breakpoint_${point}_height`]),
      }

      deviceTypes[point] = {
        designSize: {
          width: parseInt(SassVars[`breakpoint_${point}_design_width`]),
          height: parseInt(SassVars[`breakpoint_${point}_design_height`]),
        },
        remScale: {
          min: parseFloat(SassVars[`breakpoint_${point}_scale_min`]),
          max: parseFloat(SassVars[`breakpoint_${point}_scale_max`]),
        },
        mode: SassVars[`breakpoint_${point}_mode`],
      }
    })

    this.html = document.querySelector('html')
    this.config = Object.assign(
      {},
      {
        alwaysEmitResize: !!env.facebook_video_ad, // always trigger resize event even if dimensions haven't changed
        scaleMode: SassVars.scale_mode,
        scale: 1,
        baseFontSize: 10,
        breakpoints,
        deviceTypes,
      },
      config
    )

    const { designSize } = deviceTypes.mobile
    this._viewportHeight = 0
    this._viewportWidth = 0
    this._viewportAr = designSize.width / designSize.height
    this._viewportMaxHeight = designSize.height

    this._minVHSides = {
      portrait: 5000,
      landscape: 5000,
    }
    this._vh = 0
    this._minVH = window.innerHeight
    this._scale = 1
    this._disabled = false
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.ready = false
    this.timer = {
      last: Date.now(),
      wait: 150,
    }
    // smoothing of computed (real) VH value for iOS only
    this._vhSmooth = {
      enabled: false,
      current: -1,
      lerp: new LogEase({ current: window.innerHeight, to: window.innerHeight, ease: 0.35 }),
    }

    this._makeRulers()
    this.env = env
    // this._disableForceTouch()
    Raf.add(this._onResize)
    this.remLock = env.queryString.includes('remlock')

    setTimeout(() => {
      this._resize(true)
    }, 100)
    setTimeout(() => {
      this._resize(true)
    }, 500)
  }

  set remLock(islocked) {
    this._remlock = islocked
    this.html.classList.toggle('remlock', islocked)
  }

  get remlock() {
    return this._remlock
  }

  destroy() {
    this.unlisten()
    Raf.remove(this._onResize)
  }

  get disabled() {
    return this._disabled
  }

  set disabled(val) {
    this._disabled = val
    if (val) {
      // stay at this one font size
      this._updateFontSize(true)
    } else {
      // reset font size to CSS responsibility
      this._removeFontSize()
    }
  }

  get wh() {
    return window.innerHeight
  }

  get ww() {
    return window.innerWidth
  }

  get vh() {
    // use stored variable to avoid continuous dom reading
    return this._vh // this.el_vh.clientHeight /*css 100vh*/
  }

  get vw() {
    return window.innerWidth /* css 100vw */
  }

  get perc_h() {
    return this.el_perc.clientHeight /* css 100% */
  }

  get perc_w() {
    return window.innerWidth /* css 100% */
  }

  get isMobile() {
    return env.mobile
  }

  get isTablet() {
    return env.tablet
  }

  get isDesktop() {
    return !env.mobile && !env.tablet
  }

  get landscape() {
    return this.wh < this.ww
  }

  get scale() {
    return this._scale
  }

  set scale(val) {
    this._scale = val
  }

  _updateMinVH() {
    const h = this.wh
    if (env.mobile) {
      if (this.landscape) {
        this._minVHSides.landscape = Math.min(this._minVHSides.landscape, h)
        this.minVH = this._minVHSides.landscape
      } else {
        this._minVHSides.portrait = Math.min(this._minVHSides.portrait, h)
        this.minVH = this._minVHSides.portrait
      }
    } else {
      this.minVH = h
    }
  }

  get minVH() {
    return this._minVH
  }

  set minVH(val) {
    this._minVH = val
    if (window) {
      document.documentElement.style.setProperty('--jsvh100min', `${val}px`)
    }
  }

  get viewportHeight() {
    return this._viewportHeight
  }

  get viewportWidth() {
    return this._viewportWidth
  }

  _updateViewport() {
    // break based on screen width

    const mobileBp = this.config.breakpoints.mobile
    if (this.ww <= mobileBp.width) {
      this._viewportHeight = this.wh
      this._viewportWidth = this.ww
      this._breakpoint = 'mobile'
    } else {
      const height = clamp(this.wh, 0, this._viewportMaxHeight)
      this._viewportHeight = height
      this._viewportWidth = this._viewportHeight * this._viewportAr
      this._breakpoint = 'desktop'
    }

    // console.log(this._viewportHeight, ' ', this._viewportWidth, ' ',this._breakpoint)
  }

  get breakpoint() {
    return this._breakpoint || 'desktop'
  }

  get breakpointMobile() {
    return this.breakpoint === 'mobile'
  }

  get breakpointTablet() {
    return this.breakpoint === 'tablet'
  }

  get breakpointDesktop() {
    return this.breakpoint === 'desktop'
  }

  get orientation() {
    return this.ww < this.wh ? 'portrait' : 'landscape'
  }

  get deviceType() {
    if (this.isMobile) {
      return 'mobile'
    }
    if (this.isTablet) {
      return 'tablet'
    }
    return 'desktop'
  }

  get current() {
    return {
      width: this.width,
      height: this.height,
      breakpoint: this.breakpoint,
      deviceType: this.deviceType,
      orientation: this.orientation,
    }
  }

  // force a resize event (eg scroll content change)
  triggerResize = () => {
    this._resize(true)
  }

  // Subscribe a handler to internal resize events
  add = (handler, invoke = true, order = -1) => {
    this.on(this.EVENTS.RESIZE, handler, order)
    // Immediately invoke the handler upon subscription
    if (invoke) {
      handler(this.current)
    }
  }

  // Unsubscribe a handler from internal resize events
  remove = (handler) => {
    this.off(this.EVENTS.RESIZE, handler)
  }

  // Subscribe a handler to internal resize events, returning an unsubscribe method
  subscribeResize = (handler, invoke = true, order = -1) => {
    // invoke = Immediately invoke the handler upon subscribe
    return this.subscribe(this.EVENTS.RESIZE, handler, order, invoke ? this.current : null)
  }

  // ----------------------------------
  // INTERNAL UTILS
  // ----------------------------------

  _disableForceTouch = () => {
    window.addEventListener('touchforcechange', (event) => {
      const force = event.changedTouches[0].force
      if (force > 0.1) {
        event.preventDefault()
      }
    })
  }

  _zoomDetection = () => {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // EXPERIMENTAL PAGE ZOOM DETECTION !!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (this.width !== window.innerWidth) {
      if (this.breakpoint !== 'mobile') {
        // measure the change
        const jumpW = Math.abs(window.innerWidth - this.width)
        const jumpH = Math.abs(window.innerHeight - this.height)
        const percW = (jumpW / window.innerWidth).toFixed(3)
        const percH = (jumpH / window.innerHeight).toFixed(3)

        // console.log('W', jumpW, percW, window.innerWidth, 'H', jumpH, percH, window.innerHeight)

        if (percW === percH) {
          // if the percent jump of width and height are equal, we've zoomed
          this.disabled = true
          this.width = window.innerWidth
          this.height = window.innerHeight
          // console.log('PAGE ZOOM DETECTED')
        } else {
          this.disabled = false
          // console.log('PAGE ZOOM RESET: BACK TO NORMAL')
        }
      } else {
        this.disabled = false
      }
    }
  }

  _smoothVh = () => {
    this._vhSmooth.lerp.to = this.height > 0 ? this.height : window.innerHeight
    this._vhSmooth.lerp.process()
    if (
      Math.abs(this._vhSmooth.lerp.to - this._vhSmooth.lerp.current) > this.height * 0.25 ||
      !this._vhSmooth.enabled
    ) {
      this._vhSmooth.lerp.set()
    }
    const current = Math.round(this._vhSmooth.lerp.current)
    if (this._vhSmooth.current !== current) {
      this._vhSmooth.current = current
      document.documentElement.style.setProperty('--vh100', `${current}px`)
    }
  }

  _onResize = () => {
    this._resize()
  }

  // _onResize = () => {
  //   let now = Date.now()
  //   if (now - this.timer.last > this.timer.wait) {
  //     this._zoomDetection()

  //     if (!this.disabled) {
  //       this._resize()
  //     }

  //     if (env.ios) this._smoothVh()

  //     this.timer.last = now
  //   }
  // }

  _resize = (forceEmit = false) => {
    const w = this.ww
    const h = this.wh

    const changed = w !== this.width || h !== this.height || forceEmit
    const trigger = changed || this.config.alwaysEmitResize || forceEmit

    this.width = w
    this.height = h

    this._vh = this.el_vh.clientHeight

    if (changed) {
      this._updateMinVH()
      this._updateViewport()
      this._updateFontSize()
      this._updateScale()
      this._updateBreakpointClass()
      this._updateOrientationClass()
    }

    if (trigger) {
      this.emit(EVENTS.PRESIZE, this.current)
      this.emit(EVENTS.RESIZE, this.current)

      if (!this.ready) {
        this.ready = true
      }
    }
  }

  _updateScale = () => {
    this._scale = this.fontSize / this.config.baseFontSize

    // console.log('scale - ', this._scale  )
    // console.log('fontSize - ', this.fontSize)
    // console.log('baseFontSize - ', this.config.baseFontSize)

    if (this.remlock) {
      this.scale = 1
    }

    // NOTE ACTUAL REMSCALE IS CALCULATED IN CSS
    // src/styles/config/variables.sass
    // src/styles/helpers/breakpoints.sass // =remscale()
  }

  _updateFontSize = (force) => {
    const style = getComputedStyle(document.documentElement, null).getPropertyValue('font-size')
    this.fontSize = parseFloat(style)

    // ! Don't set here, let the CSS take care of it
    // (unless forced)
    if (force) {
      this.html.style.fontSize = `${this.fontSize}px`
    }
  }

  _removeFontSize = () => {
    this.html.style.fontSize = null
  }

  _updateBreakpointClass = () => {
    const breakpoint = this.breakpoint
    const bps = this.config.breakpoints
    for (const b in bps) {
      this.html.classList[b === breakpoint ? 'add' : 'remove'](b)
    }
  }

  _updateOrientationClass = () => {
    const orientations = ['portrait', 'landscape']
    orientations.forEach((o) => {
      this.html.classList[o === this.orientation ? 'add' : 'remove'](o)
    })
  }

  _makeRulers() {
    this.el_vh = document.createElement('div')
    this.el_vh.style.cssText = `position: absolute;
                              pointer-events:none;
                              top:0px;
                              width:1px;
                              height:100vh;
                              `
    this.el_perc = document.createElement('div')
    this.el_perc.style.cssText = `position: absolute;
                                pointer-events:none;
                                top:0px;
                                width:1px;
                                height:100%;
                                `

    document.body.appendChild(this.el_vh)
    document.body.appendChild(this.el_perc)
  }
}

let service = {}
if (process.client) {
  service = new ResizeService()
}
export default service
