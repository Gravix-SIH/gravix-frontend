import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

const Navbar = () => {
	return (
		<header className="h-[7.5vh] border-b border-text-accent absolute bg-black/5 backdrop-blur-md shadow-xl w-full top-0 z-[1000]">
			<div className="container mx-auto flex items-center justify-between py-4 px-6">
				<Link href="/" className="text-2xl font-bold text-text-primary">
				<Image src="/logo.svg" alt="Logo" width={40} height={40} className="inline mr-2 mb-1"/>
					MindCare
				</Link>
				<nav className="hidden md:flex gap-6 text-base text-secondary">
					<Link href="/about" className="text-text-primary hover:text-background-dark/90">
						About
					</Link>
					<Link href="/resources" className="text-text-primary hover:text-background-dark/90">
						Resources
					</Link>
					<Link href="/dashboard/forum" className="text-text-primary hover:text-background-dark/90">
						Forum
					</Link>
				</nav>
				<div className="flex gap-3">
					<Link href="/login">
						<Button>Login</Button>
					</Link>
				</div>
			</div>
		</header>

	)
}

export default Navbar