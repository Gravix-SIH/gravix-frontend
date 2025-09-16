import { Link } from 'lucide-react'
import React from 'react'

const Footer = () => {
	return (
		<footer className="border-t bg-white py-6 mt-auto">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-gray-600">
				<p>© {new Date().getFullYear()} MindCare. All rights reserved.</p>
				<div className="flex gap-4 mt-3 md:mt-0">
					<Link href="/privacy" className="hover:text-indigo-600">
						Privacy
					</Link>
					<Link href="/terms" className="hover:text-indigo-600">
						Terms
					</Link>
					<Link href="/contact" className="hover:text-indigo-600">
						Contact
					</Link>
				</div>
			</div>
		</footer>

	)
}

export default Footer