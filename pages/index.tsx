import React, { useState, useRef, useEffect, FormEvent } from 'react'
import Page from '@/components/page'

class PeopleData {
	name: string
	startAngle: number
	arc: number

	constructor(name: string, startAngle: number, arc: number) {
		this.name = name
		this.startAngle = startAngle
		this.arc = arc
	}
}

const WheelOfNames = () => {
	const [names, setNames] = useState<PeopleData[]>([])
	const [newName, setNewName] = useState('David, John')
	const [spinning, setSpinning] = useState(false)
	const [winner, setWinner] = useState<PeopleData | null>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const addName = (e: FormEvent) => {
		e.preventDefault()
		if (newName.trim() === '') {
			return
		}
		const peopleList = newName.trim().toUpperCase().split(',')
		const totalNames = peopleList.length
		const arc = (Math.PI * 2) / totalNames

		const names = peopleList.map((name, index) => {
			const angle = index * arc
			return new PeopleData(name, angle, arc)
		})
		console.log('names')
		console.log(names)
		setNames(names)
	}

	const drawWheel = (names: PeopleData[]) => {
		const canvas = canvasRef.current!!
		const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!!
		const centerX = canvas.width / 2
		const centerY = canvas.height / 2
		const radius = Math.min(centerX, centerY) - 10

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		const totalNames = names.length
		names.forEach(({ name, startAngle, arc }, index) => {
			ctx.beginPath()
			ctx.fillStyle = `hsl(${(index * 360) / totalNames}, 70%, 60%)`
			ctx.moveTo(centerX, centerY)
			ctx.arc(centerX, centerY, radius, startAngle, startAngle + arc)
			ctx.lineTo(centerX, centerY)
			ctx.fill()

			ctx.save()
			ctx.translate(centerX, centerY)
			ctx.rotate(startAngle + arc / 2)
			ctx.textAlign = 'right'
			ctx.fillStyle = 'white'
			ctx.font = 'bold 24px Playwrite FR Trad'
			ctx.fillText(name, radius - 10, 5)
			ctx.restore()
		})
	}

	const easeOut = (t: number) => {
		return 1 - Math.pow(1 - t, 5)
	}

	const spin = () => {
		if (spinning || names.length == 0) {
			return
		}

		setSpinning(true)
		setWinner(null)

		const totalAngle = Math.random() * 360 + 720 // At least 2 full rotations
		const duration = 5000 // 5 seconds
		const startTime = Date.now()

		const animate = () => {
			const now = Date.now()
			const timePassed = now - startTime
			const progress = Math.min(timePassed / duration, 1)
			const easedProgress = easeOut(progress)
			const currentAngle = easedProgress * totalAngle

			const extraAngle = totalAngle % 360

			const winningIndex = Math.floor((totalAngle % 360) / (360 / names.length))

			canvasRef.current!!.style.transform = `rotate(${currentAngle}deg)`

			if (progress < 1) {
				requestAnimationFrame(animate)
				setWinner(names[winningIndex])
			} else {
				setSpinning(false)
				setWinner(names[winningIndex])
				alert(names[winningIndex].name)
				alert(extraAngle)
				canvasRef.current!!.style.transform = `rotate(0deg)`
			}
		}

		requestAnimationFrame(animate)
	}

	useEffect(() => {
		drawWheel(names)
	}, [names])

	return (
		<Page>
			<div className='flex flex-col items-center justify-center'>
				<h1 className='text-5xl mb-12 font-playwrite'>Wheel of Names</h1>
				{/* <GlowingBulbsCircle /> */}
				<div className='relative mb-4' style={{ width: 480, height: 480 }}>
					<canvas
						ref={canvasRef}
						width={480}
						height={480}
						className='absolute inset-0 transition-transform duration-5000 ease-out'
					/>
				</div>
			</div>

			<form onSubmit={addName}>
				<div className='w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600'>
					<div className='px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800'>
						<textarea
							id='comment'
							rows={4}
							className='w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400'
							placeholder='Write comma (,) saperated names'
							required
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
						></textarea>
					</div>
					<div className='flex items-center justify-between px-3 py-2 border-t dark:border-gray-600'>
						<button
							type='submit'
							className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
						>
							Add People
						</button>{' '}
					</div>
				</div>
			</form>

			<button
				onClick={spin}
				className='w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800'
			>
				<span className='w-full font-grotesk relative px-6 py-3.5 text-2xl font-normal transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
					SPIN
				</span>
			</button>
		</Page>
	)
}

export default WheelOfNames
