"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	LayoutDashboard,
	Users,
	Calendar,
	BookOpen,
	MessageSquare,
	Bot,
	ClipboardCheck,
	FileText,
	Settings,
	LogOut,
	Shield,
	Library,
} from "lucide-react";

// Import all role-based tab components
import StudentOverview from "./student/Overview";
import StudentChat from "./student/Chat";
import StudentAssessment from "./student/Assessment";
import StudentBooking from "./student/Booking";
import StudentResources from "./student/Resources";
import StudentForum from "./student/Forum";

import AdminOverview from "./admin/Overview";
import AdminUsers from "./admin/Users";
import AdminAssessments from "./admin/Assessments";
import AdminBookings from "./admin/Bookings";
import AdminResources from "./admin/Resources";
import AdminForum from "./admin/Forum";
import AdminLogs from "./admin/Logs";
import AdminSettings from "./admin/Settings";

import CounsellorOverview from "./counsellor/Overview";
import CounsellorChat from "./counsellor/Chat";
import CounsellorAssessments from "./counsellor/Assessments";
import CounsellorBookings from "./counsellor/Bookings";
import CounsellorResources from "./counsellor/Resources";
import CounsellorForum from "./counsellor/Forum";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/models/User";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Image from "next/image";

const navConfig: Record<UserRole, { label: string; key: string; icon: any }[]> = {
	student: [
		{ label: "Overview", key: "overview", icon: LayoutDashboard },
		{ label: "Chat", key: "chat", icon: Bot },
		{ label: "Assessment", key: "assessment", icon: ClipboardCheck },
		{ label: "Book Session", key: "booking", icon: Calendar },
		{ label: "Resources", key: "resources", icon: BookOpen },
		{ label: "Forum", key: "forum", icon: MessageSquare },
	],
	admin: [
		{ label: "Overview", key: "overview", icon: LayoutDashboard },
		{ label: "User Management", key: "users", icon: Users },
		{ label: "Assessments", key: "assessments", icon: ClipboardCheck },
		{ label: "Bookings", key: "bookings", icon: Calendar },
		{ label: "Resources", key: "resources", icon: BookOpen },
		{ label: "Forum Moderation", key: "forum", icon: Shield },
		{ label: "Audit Logs", key: "logs", icon: FileText },
		{ label: "Settings", key: "settings", icon: Settings },
	],
	counsellor: [
		{ label: "Overview", key: "overview", icon: LayoutDashboard },
		{ label: "Chat", key: "chat", icon: Bot },
		{ label: "Assessments", key: "assessments", icon: ClipboardCheck },
		{ label: "My Bookings", key: "bookings", icon: Calendar },
		{ label: "Resources", key: "resources", icon: Library },
		{ label: "Forum", key: "forum", icon: MessageSquare },
	],
};

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const [role] = useState<UserRole>(user?.role || "student");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [active, setActive] = useState("overview");

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
				case "forum": return <StudentForum />;
			}
		}
		if (role === "admin") {
			switch (active) {
				case "overview": return <AdminOverview />;
				case "users": return <AdminUsers />;
				case "assessments": return <AdminAssessments />;
				case "bookings": return <AdminBookings />;
				case "resources": return <AdminResources />;
				case "forum": return <AdminForum />;
				case "logs": return <AdminLogs />;
				case "settings": return <AdminSettings />;
			}
		}
		if (role === "counsellor") {
			switch (active) {
				case "overview": return <CounsellorOverview />;
				case "chat": return <CounsellorChat />;
				case "assessments": return <CounsellorAssessments />;
				case "bookings": return <CounsellorBookings />;
				case "resources": return <CounsellorResources />;
				case "forum": return <CounsellorForum />;
			}
		}
		return <Card><CardContent>Invalid tab</CardContent></Card>;
	};

	return (
		<ProtectedRoute>
			<div className="flex h-screen w-screen relative">
				<div className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none overflow-hidden -z-10">
					<Image alt="BG" src={"/dashboard-bg.svg"} width={1024} height={720} className="w-full" />
				</div>
				{/* Sidebar */}
				<motion.aside
					initial={{ x: -200 }}
					animate={{ x: 0 }}
					transition={{ type: "spring", stiffness: 80 }}
					className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex flex-col border-r shadow-lg`}
				>
					<div className="p-6">
						<h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
						<p className="text-sm text-text-secondary capitalize">{role}</p>
					</div>
					<nav className="flex-1 space-y-2 px-4">
						{navItems.map(({ label, key, icon: Icon }) => (
							<Button
								key={key}
								variant={active === key ? "secondary" : "ghost"}
								className="w-full justify-start"
								onClick={() => setActive(key)}
							>
								<Icon className="mr-2 h-5 w-5" />
								{label}
							</Button>
						))}
					</nav>
					<div className="p-4">
						<Button variant="ghost" className="w-full justify-start text-rose-500" onClick={handleLogout}>
							<LogOut className="mr-2 h-5 w-5" /> Logout
						</Button>
					</div>
				</motion.aside>

				{/* Main */}
				<div className="flex flex-1 flex-col">
					<header className="flex items-center justify-between border-b px-6 py-4 shadow-sm">
						<h1 className="text-xl font-semibold capitalize">
							<Button variant="outline" className="mr-4 p-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
								<LayoutDashboard className="inline-block " />
							</Button>
							{active}
						</h1>
						<div className="flex items-center space-x-4">
							<Button size="sm" variant="default">
								{user?.name || "User"}
							</Button>
							<img
								src="https://i.pravatar.cc/40"
								alt="User Avatar"
								className="h-10 w-10 rounded-full border"
							/>
						</div>
					</header>
					<main className="flex-1">
						<motion.div
							key={active}
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-6 h-full"
						>
							{renderContent()}
						</motion.div>
					</main>
				</div>
			</div>
		</ProtectedRoute >
	);
}
