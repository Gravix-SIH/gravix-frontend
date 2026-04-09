"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	LayoutDashboard,
	Users,
	Calendar,
	BookOpen,
	Bot,
	ClipboardCheck,
	FileText,
	Settings,
	LogOut,
	Library,
} from "lucide-react";
import { stopLenis, startLenis } from "@/hooks/useLenis";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

// Import all role-based tab components
import StudentOverview from "./student/Overview";
import StudentChat from "./student/Chat";
import StudentAssessment from "./student/Assessment";
import StudentBooking from "./student/Booking";
import StudentResources from "./student/Resources";

import AdminOverview from "./admin/Overview";
import AdminUsers from "./admin/Users";
import AdminAssessments from "./admin/Assessments";
import AdminBookings from "./admin/Bookings";
import AdminResources from "./admin/Resources";
import AdminLogs from "./admin/Logs";
import AdminSettings from "./admin/Settings";

import CounsellorOverview from "./counsellor/Overview";
import CounsellorAssessments from "./counsellor/Assessments";
import CounsellorBookings from "./counsellor/Bookings";
import CounsellorResources from "./counsellor/Resources";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/models/User";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const navConfig: Record<UserRole, { label: string; key: string; icon: LucideIcon }[]> = {
	student: [
		{ label: "Overview", key: "overview", icon: LayoutDashboard },
		{ label: "Chat", key: "chat", icon: Bot },
		{ label: "Assessment", key: "assessment", icon: ClipboardCheck },
		{ label: "Book Session", key: "booking", icon: Calendar },
		{ label: "Resources", key: "resources", icon: BookOpen },
	],
	admin: [
		{ label: "Overview", key: "overview", icon: LayoutDashboard },
		{ label: "User Management", key: "users", icon: Users },
		{ label: "Assessments", key: "assessments", icon: ClipboardCheck },
		{ label: "Bookings", key: "bookings", icon: Calendar },
		{ label: "Resources", key: "resources", icon: BookOpen },
		{ label: "Audit Logs", key: "logs", icon: FileText },
		{ label: "Settings", key: "settings", icon: Settings },
	],
	counsellor: [
		{ label: "Overview", key: "overview", icon: LayoutDashboard },
		{ label: "Assessments", key: "assessments", icon: ClipboardCheck },
		{ label: "My Bookings", key: "bookings", icon: Calendar },
		{ label: "Resources", key: "resources", icon: Library },
	],
};

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const role = (user?.role || "student") as UserRole;
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [active, setActive] = useState("overview");
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
		checkDesktop();
		window.addEventListener('resize', checkDesktop);

		// Stop Lenis smooth scroll on dashboard for native scroll
		console.log('stopLenis called');
		stopLenis();

		return () => {
			window.removeEventListener('resize', checkDesktop);
			// Restart Lenis when leaving dashboard
			startLenis();
		};
	}, []);

	const navItems = navConfig[role];

	const handleLogout = async () => {
		try {
			console.log("Logging out...");
			await logout();
		} catch (err) {
			console.log(err);
		}
	}

	// Content Renderer
	const renderContent = () => {
		if (role === "student") {
			switch (active) {
				case "overview": return <StudentOverview setShowSection={setActive} />;
				case "chat": return <StudentChat setShowSection={setActive} />;
				case "assessment": return <StudentAssessment />;
				case "booking": return <StudentBooking />;
				case "resources": return <StudentResources />;
			}
		}
		if (role === "admin") {
			switch (active) {
				case "overview": return <AdminOverview />;
				case "users": return <AdminUsers />;
				case "assessments": return <AdminAssessments />;
				case "bookings": return <AdminBookings />;
				case "resources": return <AdminResources />;
				case "logs": return <AdminLogs />;
				case "settings": return <AdminSettings />;
			}
		}
		if (role === "counsellor") {
			switch (active) {
				case "overview": return <CounsellorOverview />;
				case "assessments": return <CounsellorAssessments />;
				case "bookings": return <CounsellorBookings />;
				case "resources": return <CounsellorResources />;
			}
		}
		return <Card><CardContent>Invalid tab</CardContent></Card>;
	};

	return (
		<ProtectedRoute>
			<div className="flex h-screen w-full relative" style={{ background: 'linear-gradient(135deg, #F5E6D8 0%, #FFF8F0 50%, #F5E6D8 100%)' }}>
				{/* Mobile Overlay */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-black/50 z-10 lg:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Sidebar */}
				<motion.aside
					initial={false}
					animate={{ x: isDesktop ? 0 : (sidebarOpen ? 0 : -256) }}
					transition={isDesktop ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 35, mass: 0.8 }}
					style={{ willChange: isDesktop ? 'auto' : 'transform' }}
					className="absolute lg:relative inset-y-0 left-0 z-30 bg-background-light/95 backdrop-blur-md border-r shadow-lg flex flex-col w-64 shrink-0 lg:translate-x-0"
				>
					<div className="p-4 sm:p-6">
						<h2 className="text-xl sm:text-2xl font-bold text-text-primary">Dashboard</h2>
						<p className="text-xs sm:text-sm text-text-secondary capitalize">{role}</p>
					</div>
					<nav className="flex-1 overflow-y-auto px-2 sm:px-4 py-2">
						{navItems.map(({ label, key, icon: Icon }) => (
							<Button
								key={key}
								variant={active === key ? "secondary" : "ghost"}
								className="w-full justify-start mb-1"
								onClick={() => {
									setActive(key);
									if (window.innerWidth < 1024) {
										setSidebarOpen(false);
									}
								}}
							>
								<Icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
								<span className="text-sm sm:text-base">{label}</span>
							</Button>
						))}
					</nav>
					<div className="p-3 sm:p-4 border-t">
						<Button variant="ghost" className="w-full justify-start text-rose-500 text-sm" onClick={handleLogout}>
							<LogOut className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Logout
						</Button>
					</div>
				</motion.aside>

				{/* Main */}
				<div className="flex flex-col flex-1 min-w-0 relative z-0">
					<header className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4 shadow-sm bg-background-light/50 backdrop-blur-sm shrink-0">
						<h1 className="text-lg sm:text-xl font-semibold capitalize flex items-center gap-2 text-text-primary">
							<Button
								variant="outline"
								size="sm"
								className="p-0 w-8 h-8"
								onClick={() => setSidebarOpen(!sidebarOpen)}
							>
								<LayoutDashboard className="w-4 h-4" />
							</Button>
							{active}
						</h1>
						<div className="flex items-center space-x-2 sm:space-x-4">
							<Button size="sm" variant="default" className="hidden sm:flex">
								{user?.name || "User"}
							</Button>
							{user?.is_anonymous ? (
								<div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm sm:text-base">
									?
								</div>
							) : (
								<img
									src={`https://i.pravatar.cc/40?u=${user?.id}`}
									alt="User Avatar"
									className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border"
								/>
							)}
						</div>
					</header>
					<main data-lenis-scroll="false" className="flex-1" style={{ overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
						<div className="h-full">
							{renderContent()}
						</div>
					</main>
				</div>
			</div>
		</ProtectedRoute >
	);
}
