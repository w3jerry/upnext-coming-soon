'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

export default function Home() {
  const initiated = useRef(false)

  useEffect(() => {
    if (initiated.current) return
    initiated.current = true

    // All interactive JS runs after GSAP loads (see Script onLoad below)
  }, [])

  function initPage() {
    const gsap = (window as any).gsap
    if (!gsap) return

    /* ── Custom cursor ── */
    const dot  = document.getElementById('cur-dot')!
    const ring = document.getElementById('cur-ring')!
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let rx = mx, ry = my

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })
    document.addEventListener('mousedown', () => document.body.classList.add('cur-click'))
    document.addEventListener('mouseup',   () => document.body.classList.remove('cur-click'))

    ;(function cursorLoop() {
      dot.style.left = mx + 'px'; dot.style.top = my + 'px'
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px'
      requestAnimationFrame(cursorLoop)
    })()

    document.querySelectorAll('a, button, .char').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'))
      el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'))
    })

    /* ── Particles ── */
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', resize); resize()

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.3, a: Math.random() * 0.25 + 0.05,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    }))

    ;(function drawParticles() {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        const dx = p.x - mx, dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) { const f = (120 - dist) / 120 * 0.6; p.vx += dx / dist * f; p.vy += dy / dist * f }
        p.vx *= 0.97; p.vy *= 0.97; p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(124,77,170,${p.a})`; ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(124,77,170,${0.07 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
      requestAnimationFrame(drawParticles)
    })()

    /* ── Click ripples ── */
    document.addEventListener('click', e => {
      const r = document.createElement('div')
      r.className = 'ripple'
      r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:200px;height:200px;`
      document.body.appendChild(r)
      r.addEventListener('animationend', () => r.remove())
    })

    /* ── Letter-by-letter headline ── */
    const h1 = document.getElementById('headline')!
    const lines = h1.innerHTML.split(/<br\s*\/?>/i)
    let html = ''
    lines.forEach((line, li) => {
      ;[...line].forEach(ch => {
        const cls = li === 1 ? 'char accent' : 'char'
        html += ch === ' ' ? `<span class="${cls}" style="width:.3em"> </span>` : `<span class="${cls}">${ch}</span>`
      })
      if (li < lines.length - 1) html += '<br/>'
    })
    h1.innerHTML = html

    document.querySelectorAll('.char').forEach(ch => {
      ch.addEventListener('mouseenter', () => {
        gsap.to(ch, { y: -6, duration: 0.18, ease: 'power2.out',
          onComplete: () => gsap.to(ch, { y: 0, duration: 0.4, ease: 'elastic.out(1,0.4)' }) })
      })
    })

    /* ── GSAP entrance ── */
    gsap.set(['#logo','#tagline','#badges','#cta','#rebrand','#bottom'], { opacity: 0, y: 20 })
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl
      .to('#logo',    { opacity: 1, y: 0, duration: 0.9 }, 0.1)
      .to('#divider', { width: Math.min(520, window.innerWidth - 32), duration: 1.0, ease: 'power2.inOut' }, 0.55)
      .to('#tagline', { opacity: 1, y: 0, duration: 0.8 }, 0.85)
      .to('#badges',  { opacity: 1, y: 0, duration: 0.7 }, 1.15)
      .to('#cta',     { opacity: 1, y: 0, duration: 0.7 }, 1.38)
      .to('#rebrand', { opacity: 1, y: 0, duration: 0.6 }, 1.58)
      .to('#bottom',  { opacity: 1, y: 0, duration: 0.6 }, 1.75)

    gsap.to('#arrow1', { y: -6, duration: 1.9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.3 })
    gsap.to('#arrow2', { y: -6, duration: 1.9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.7 })
    gsap.to('#logo',   { y: '+=4', duration: 4.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.4 })
    gsap.to('#badge-dot', {
      opacity: 0.2, scale: 0.55, duration: 1.1,
      ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.0, transformOrigin: 'center center'
    })

    const btn = document.getElementById('cta-btn')!
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect()
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.2, y: (e.clientY - r.top - r.height / 2) * 0.2, duration: 0.3, ease: 'power2.out' })
    })
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' }))
  }

  return (
    <>
      <div id="cur-dot" />
      <div id="cur-ring" />
      <canvas id="canvas" />

      <div className="container">
        <div className="logo-wrap" id="logo">
          <svg viewBox="0 0 1763 413" xmlns="http://www.w3.org/2000/svg" style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <g>
              <path id="arrow1" d="M15.625,208.333l81.25,-83.333l81.25,83.333" style={{ fill: 'none', stroke: '#7c4daa', strokeWidth: '31.25px' }} />
              <path id="arrow2" d="M15.625,291.667l81.25,-83.333l81.25,83.333" style={{ fill: 'none', stroke: '#7c4daa', strokeWidth: '31.25px', opacity: 0.4 }} />
              <g fill="#0f0c14" style={{ fillRule: 'nonzero' }}>
                <path d="M392.904,322.112c-21.9,0 -41.367,-4.258 -58.4,-12.775c-16.729,-8.517 -29.963,-20.379 -39.696,-35.587c-9.733,-15.208 -14.6,-32.546 -14.6,-52.013l0,-129.575l89.425,0l0,130.487c0,4.563 0.913,8.671 2.738,12.321c2.129,3.65 4.867,6.538 8.213,8.667c3.65,1.825 7.758,2.737 12.321,2.737c6.388,0 11.708,-2.129 15.967,-6.388c4.562,-4.562 6.846,-10.342 6.846,-17.338l0,-130.487l89.425,0l0,129.575c0,19.771 -4.867,37.263 -14.6,52.471c-9.429,14.904 -22.663,26.612 -39.696,35.129c-16.729,8.517 -36.042,12.775 -57.942,12.775Z"/>
                <path d="M680.133,321.2c-13.383,0 -26.008,-2.129 -37.871,-6.388c-11.863,-4.563 -21.9,-10.796 -30.112,-18.704c-8.213,-7.908 -13.533,-17.033 -15.967,-27.375l0,-124.1c2.433,-10.342 7.754,-19.771 15.967,-28.287c8.212,-8.821 18.25,-15.817 30.112,-20.987c11.862,-5.171 24.487,-7.758 37.871,-7.758c22.204,0 41.517,5.021 57.942,15.058c16.729,9.733 29.658,23.421 38.783,41.063c9.429,17.642 14.142,37.867 14.142,60.679c0,22.813 -4.713,43.042 -14.142,60.683c-9.125,17.338 -22.054,31.025 -38.783,41.063c-16.425,10.037 -35.737,15.054 -57.942,15.054Zm-138.246,91.25l0,-320.287l89.425,0l0,55.208l-14.6,54.292l12.321,54.75l0,156.038l-87.146,0Zm121.362,-169.725c7.3,0 13.842,-1.671 19.621,-5.017c5.779,-3.346 10.188,-7.908 13.229,-13.688c3.346,-5.779 5.021,-12.321 5.021,-19.621c0,-7.604 -1.675,-14.142 -5.021,-19.617c-3.042,-5.779 -7.45,-10.342 -13.229,-13.688c-5.475,-3.346 -11.862,-5.021 -19.163,-5.021c-7.3,0 -13.842,1.675 -19.621,5.021c-5.475,3.042 -9.883,7.45 -13.229,13.229c-3.042,5.779 -4.562,12.471 -4.562,20.075c0,7.3 1.521,13.842 4.562,19.621c3.042,5.779 7.3,10.342 12.775,13.688c5.779,3.346 12.317,5.017 19.617,5.017Z"/>
                <path d="M963.167,316.638l0,-125.925c0,-8.821 -2.583,-15.513 -7.754,-20.075c-4.867,-4.867 -11.104,-7.3 -18.708,-7.3c-5.171,0 -9.883,1.062 -14.142,3.192c-3.954,2.129 -7.15,5.325 -9.583,9.583c-2.129,3.954 -3.192,8.821 -3.192,14.6l-34.675,-15.513c0,-18.25 3.954,-33.917 11.863,-46.996c8.213,-13.079 19.312,-23.117 33.304,-30.113c14.296,-6.996 30.417,-10.492 48.362,-10.492c16.121,0 30.417,3.65 42.888,10.95c12.775,6.996 22.812,16.729 30.113,29.2c7.3,12.167 10.95,26.308 10.95,42.433l0,146.454l-89.425,0Zm-142.804,0l0,-224.475l89.425,0l0,224.475l-89.425,0Z"/>
                <path d="M1207.617,322.112c-26.158,0 -49.125,-4.867 -68.896,-14.6c-19.771,-10.038 -35.283,-23.875 -46.537,-41.517c-10.95,-17.946 -16.425,-38.479 -16.425,-61.596c0,-22.812 5.325,-43.037 15.971,-60.679c10.95,-17.642 25.854,-31.483 44.712,-41.521c18.858,-10.342 40.15,-15.513 63.875,-15.513c23.421,0 44.104,4.867 62.05,14.6c17.946,9.429 31.937,22.662 41.975,39.696c10.342,17.033 15.513,36.5 15.513,58.4c0,4.562 -0.304,9.429 -0.913,14.6c-0.304,4.867 -1.217,10.646 -2.737,17.337l-202.575,1.367l0,-54.75l169.267,-1.367l-41.517,24.179c0,-12.167 -1.521,-22.05 -4.562,-29.654c-2.738,-7.908 -6.996,-13.842 -12.775,-17.796c-5.779,-3.954 -13.079,-5.929 -21.9,-5.929c-9.125,0 -17.033,2.279 -23.725,6.842c-6.692,4.562 -11.862,11.104 -15.513,19.621c-3.346,8.517 -5.021,18.858 -5.021,31.025c0,12.471 1.825,22.963 5.475,31.479c3.954,8.213 9.583,14.45 16.883,18.708c7.3,4.258 16.425,6.388 27.375,6.388c10.646,0 19.921,-1.675 27.829,-5.021c8.212,-3.65 15.667,-9.275 22.358,-16.879l44.713,44.254c-11.254,12.775 -24.792,22.358 -40.608,28.746c-15.817,6.388 -33.912,9.579 -54.292,9.579Z"/>
                <path d="M1476.725,316.638l-43.346,-79.388l-20.988,-11.404l-89.425,-133.683l102.2,0l43.8,80.3l20.533,10.496l88.512,133.679l-101.288,0Zm-158.321,0l93.075,-135.05l50.188,53.383l-49.275,81.667l-93.987,0Zm165.621,-90.792l-50.188,-53.383l45.625,-80.3l93.987,0l-89.425,133.683Z"/>
                <path d="M1624.842,316.638l0,-316.638l89.425,0l0,316.638l-89.425,0Zm-47.904,-151.475l0,-73l185.238,0l0,73l-185.238,0Z"/>
              </g>
            </g>
          </svg>
        </div>

        <div className="divider" id="divider" />

        <div className="tagline" id="tagline">
          <span className="label">Coming soon</span>
          <h1 id="headline">We build<br/>digital business.</h1>
        </div>

        <div className="badge-row" id="badges">
          <div className="badge">
            <span className="badge-dot" id="badge-dot" />
            Website in progress
          </div>
          <span className="sub">Something great is on its way.</span>
        </div>

        <div className="cta-row" id="cta">
          <a className="cta-btn" id="cta-btn" href="https://cal.com/splxagency/free-ux-ui" target="_blank" rel="noopener">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Book a free consultation
          </a>
        </div>

        <div className="rebrand-note" id="rebrand">
          Previously known as <strong>SPLX</strong>
        </div>
      </div>

      <div className="bottom" id="bottom">
        <a href="mailto:hello@upnext.cz">hello@upnext.cz</a>
        <div className="bottom-dot" />
        <a href="#">LinkedIn</a>
        <div className="bottom-dot" />
        <span className="bottom-copy">© 2025 Upnext</span>
      </div>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
        onLoad={() => initPage()}
      />
    </>
  )
}
