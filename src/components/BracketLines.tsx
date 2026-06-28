import React, { useState, useEffect } from 'react'

interface BracketLinesProps {
  winners: { [k: string]: number | null }
}

export const BracketLines: React.FC<BracketLinesProps> = ({ winners }) => {
  const [paths, setPaths] = useState<{ d: string; isActive: boolean }[]>([])

  useEffect(() => {
    const container = document.getElementById('bracket-container')
    if (!container) return

    const updateLines = () => {
      const rect = container.getBoundingClientRect()
      const getBoxEdge = (matchId: string, edge: 'left' | 'right') => {
        const el = container.querySelector(`[data-match-id="${matchId}"]`)
        if (!el) return null
        const elRect = el.getBoundingClientRect()
        const x = edge === 'left' ? elRect.left - rect.left : elRect.right - rect.left
        const y = elRect.top - rect.top + elRect.height / 2
        return { x, y }
      }

      const flowConnections: { target: string; source: string; side: 'left' | 'right' }[] = [
        // Col 2 targets (Left side)
        { target: 'm17', source: 'm2', side: 'right' },
        { target: 'm17', source: 'm5', side: 'right' },
        { target: 'm18', source: 'm1', side: 'right' },
        { target: 'm18', source: 'm3', side: 'right' },
        { target: 'm19', source: 'm4', side: 'right' },
        { target: 'm19', source: 'm6', side: 'right' },
        { target: 'm20', source: 'm7', side: 'right' },
        { target: 'm20', source: 'm8', side: 'right' },

        // Col 3 targets (Left side)
        { target: 'm25', source: 'm17', side: 'right' },
        { target: 'm25', source: 'm18', side: 'right' },
        { target: 'm26', source: 'm19', side: 'right' },
        { target: 'm26', source: 'm20', side: 'right' },

        // Col 4 targets (Left side)
        { target: 'm29', source: 'm25', side: 'right' },
        { target: 'm29', source: 'm26', side: 'right' },

        // Col 8 targets (Right side)
        { target: 'm21', source: 'm11', side: 'left' },
        { target: 'm21', source: 'm12', side: 'left' },
        { target: 'm22', source: 'm9', side: 'left' },
        { target: 'm22', source: 'm10', side: 'left' },
        { target: 'm23', source: 'm14', side: 'left' },
        { target: 'm23', source: 'm16', side: 'left' },
        { target: 'm24', source: 'm13', side: 'left' },
        { target: 'm24', source: 'm15', side: 'left' },

        // Col 7 targets (Right side)
        { target: 'm27', source: 'm21', side: 'left' },
        { target: 'm27', source: 'm22', side: 'left' },
        { target: 'm28', source: 'm23', side: 'left' },
        { target: 'm28', source: 'm24', side: 'left' },

        // Col 6 targets (Right side)
        { target: 'm30', source: 'm27', side: 'left' },
        { target: 'm30', source: 'm28', side: 'left' },

        // Finals target from Col 4 and Col 6 (m32 is center)
        { target: 'm32', source: 'm29', side: 'right' },
        { target: 'm32', source: 'm30', side: 'left' },
        
        // Third place target
        { target: 'm31', source: 'm29', side: 'right' },
        { target: 'm31', source: 'm30', side: 'left' }
      ]

      const newPaths: { d: string; isActive: boolean }[] = []
      flowConnections.forEach(({ target, source, side }) => {
        const start = getBoxEdge(source, side === 'right' ? 'right' : 'left')
        const end = getBoxEdge(target, side === 'right' ? 'left' : 'right')

        if (start && end) {
          const isActive = winners[source] !== null && winners[source] !== undefined
          const xMid = (start.x + end.x) / 2
          const d = `M ${start.x} ${start.y} L ${xMid} ${start.y} L ${xMid} ${end.y} L ${end.x} ${end.y}`
          newPaths.push({ d, isActive })
        }
      })

      setPaths(newPaths)
    }

    const timer = setTimeout(updateLines, 150)
    window.addEventListener('resize', updateLines)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateLines)
    }
  }, [winners])

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {paths.map((p, idx) => (
        <path
          key={idx}
          d={p.d}
          fill="none"
          stroke={p.isActive ? '#0f766e' : '#cbd5e1'} /* Darker Teal for active, Slate 300 for inactive */
          strokeWidth={p.isActive ? 3.5 : 2.0} /* Thicker lines */
          className="transition-all duration-300"
        />
      ))}
    </svg>
  )
}
