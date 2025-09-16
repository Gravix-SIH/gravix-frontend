import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

const Navbar = () => {
	return (
		<header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
			<div className="container mx-auto flex items-center justify-between py-4 px-6">
				<Link href="/" className="text-xl font-bold text-indigo-600">
					MindCare
				</Link>
				<nav className="hidden md:flex gap-6">
					<Link href="/about" className="text-gray-600 hover:text-indigo-600">
						About
					</Link>
					<Link href="/resources" className="text-gray-600 hover:text-indigo-600">
						Resources
					</Link>
					<Link href="/dashboard/forum" className="text-gray-600 hover:text-indigo-600">
						Forum
					</Link>
				</nav>
				<div className="flex gap-3">
					<Link href="/login">
						<Button variant="outline">Login</Button>
					</Link>
					<Link href="/signup">
						<Button>Sign Up</Button>
					</Link>
				</div>
			</div>
		</header>

	)
}

export default Navbar