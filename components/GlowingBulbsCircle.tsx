import React, { useState, useEffect } from 'react'

interface Props {
	children: React.ReactNode
}

class Bulb {
	id: number
	color: string
	glowing: boolean

	public constructor(id: number, color: string, glowing: boolean) {
		this.id = id
		this.color = color
		this.glowing = glowing
	}
}

const GlowingBulbsCircle = ({
	numBulbs = 12,
	glowDuration = 200,
	pauseDuration = 20,
}) => {
	const [activeBulb, setActiveBulb] = useState(0)

	const colors = [
		'red',
		'blue',
		'green',
		'yellow',
		'purple',
		'orange',
		'pink',
		'teal',
		'indigo',
		'cyan',
		'lime',
		'amber',
	]

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveBulb((prev) => (prev + 1) % numBulbs)
		}, glowDuration + pauseDuration)

		return () => clearInterval(interval)
	}, [numBulbs, glowDuration, pauseDuration])

	const getBulbStyle = (index: number) => {
		const angle = (index / numBulbs) * 2 * Math.PI
		const x = Math.cos(angle)
		const y = Math.sin(angle)
		return {
			left: `${50 + 40 * x}%`,
			top: `${50 + 40 * y}%`,
			transform: 'translate(-50%, -50%)',
		}
	}

	const getBulbColor = (index: number, isActive: boolean) => {
		const baseColor = colors[index % colors.length]
		return isActive ? `bg-${baseColor}-400` : `bg-${baseColor}-200`
	}

	const getGlowColor = (index: number) => {
		const baseColor = colors[index % colors.length]
		return `shadow-${baseColor}-300`
	}

	return (
		<div className='relative w-64 h-64'>
			{[...Array(numBulbs)].map((_, index) => (
				<div
					key={index}
					className={`absolute w-4 h-4 rounded-full transition-all duration-300 ${getBulbColor(
						index,
						index === activeBulb,
					)} ${index === activeBulb ? `scale-125 shadow-lg ${getGlowColor(index)}` : ''}`}
					style={{
						...getBulbStyle(index),
						transition: `all ${glowDuration}ms ease-in-out`,
					}}
				/>
			))}
		</div>
	)
}

export default GlowingBulbsCircle
