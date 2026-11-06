"use client"

import React, { useRef, useState } from "react"
import { soundManager } from "@/lib/sound"

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function TiltCard({
  children,
  className = "",
  glowColor = "rgba(22, 163, 74, 0.15)",
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Rotação suave em torno dos eixos
    const rX = ((y - centerY) / centerY) * -7
    const rY = ((x - centerX) / centerX) * 7

    setRotateX(rX)
    setRotateY(rY)
    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    soundManager.playHover()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
    setMousePos({ x: 50, y: 50 })
  }

  return (
    <div
      style={{ perspective: 1000 }}
      className="transition-transform duration-200"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px)",
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.5s ease-out, box-shadow 0.5s ease-out",
        }}
        className={`relative overflow-hidden transition-all duration-300 ${className}`}
        {...props}
      >
        {/* Dynamic Mouse Spotlight Reflection */}
        {isHovered && (
          <div
            style={{
              background: `radial-gradient(circle 350px at ${mousePos.x}% ${mousePos.y}%, ${glowColor}, transparent 80%)`,
            }}
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          />
        )}
        {children}
      </div>
    </div>
  )
}
