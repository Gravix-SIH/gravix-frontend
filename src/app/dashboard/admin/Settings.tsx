"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
	Settings as SettingsIcon,
	Globe,
	Mail,
	Bell,
	Shield,
	Save,
	LoaderPinwheel,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminSettings() {
	const { user } = useAuth();
	const [saving, setSaving] = useState(false);
	const [formData, setFormData] = useState({
		orgName: "MindCare",
		supportEmail: "support@gravix.com",
		maintenanceMode: false,
		emailNotifications: true,
		crisisAlert: true,
	});

	const handleSave = async () => {
		setSaving(true);
		// Simulate save
		await new Promise((r) => setTimeout(r, 1000));
		setSaving(false);
		toast.success("Settings saved successfully");
	};

	return (
		<div className="p-4 sm:p-6 space-y-6 max-w-2xl">
			<div>
				<h2 className="text-lg font-semibold">System Settings</h2>
				<p className="text-sm text-text-secondary">
					Manage your platform configuration
				</p>
			</div>

			{/* Organization */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<Globe className="w-4 h-4 text-indigo-500" />
						Organization
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-1.5">
						<label className="text-sm font-medium">Organization Name</label>
						<Input
							value={formData.orgName}
							onChange={(e) =>
								setFormData({ ...formData, orgName: e.target.value })
							}
							className="rounded-xl"
							placeholder="Your organization name"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-sm font-medium">Support Email</label>
						<Input
							type="email"
							value={formData.supportEmail}
							onChange={(e) =>
								setFormData({ ...formData, supportEmail: e.target.value })
							}
							className="rounded-xl"
							placeholder="support@example.com"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Notifications */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<Bell className="w-4 h-4 text-indigo-500" />
						Notifications
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{[
						{
							label: "Email Notifications",
							description: "Receive email alerts for important events",
							key: "emailNotifications",
						},
						{
							label: "Crisis Alerts",
							description: "Immediate alerts when a student triggers crisis detection",
							key: "crisisAlert",
						},
					].map((item) => (
						<div
							key={item.key}
							className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-gradient-to-br from-background to-background/80"
						>
							<div>
								<p className="text-sm font-medium">{item.label}</p>
								<p className="text-xs text-text-secondary">{item.description}</p>
							</div>
							<button
								className={`relative w-11 h-6 rounded-full transition-colors ${
									(formData as any)[item.key]
										? "bg-indigo-500"
										: "bg-gray-300"
								}`}
								onClick={() =>
									setFormData({
										...formData,
										[item.key]: !(formData as any)[item.key],
									})
								}
							>
								<span
									className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
										(formData as any)[item.key] ? "translate-x-5" : ""
									}`}
								/>
							</button>
						</div>
					))}
				</CardContent>
			</Card>

			{/* Maintenance */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<SettingsIcon className="w-4 h-4 text-amber-500" />
						Maintenance
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-gradient-to-br from-background to-background/80">
						<div>
							<p className="text-sm font-medium">Maintenance Mode</p>
							<p className="text-xs text-text-secondary">
								Prevent all users (except admins) from accessing the platform
							</p>
						</div>
						<button
							className={`relative w-11 h-6 rounded-full transition-colors ${
								formData.maintenanceMode
									? "bg-amber-500"
									: "bg-gray-300"
							}`}
							onClick={() =>
								setFormData({
									...formData,
									maintenanceMode: !formData.maintenanceMode,
								})
							}
						>
							<span
								className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
									formData.maintenanceMode ? "translate-x-5" : ""
								}`}
							/>
						</button>
					</div>
					{formData.maintenanceMode && (
						<p className="text-xs text-amber-600 mt-2 px-1">
							⚡ Maintenance mode is active. Students and counsellors will see a
							maintenance page.
						</p>
					)}
				</CardContent>
			</Card>

			{/* Account Info */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<Shield className="w-4 h-4 text-indigo-500" />
						Admin Account
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-gradient-to-br from-background to-background/80">
						<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
							{(user?.name || user?.email || "A").charAt(0).toUpperCase()}
						</div>
						<div>
							<p className="text-sm font-medium">
								{user?.name || "Admin User"}
							</p>
							<p className="text-xs text-text-secondary">
								{user?.email} · Admin
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Save */}
			<div className="flex justify-end">
				<button
					className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50"
					onClick={handleSave}
					disabled={saving}
				>
					{saving ? (
						<LoaderPinwheel className="w-4 h-4 animate-spin" />
					) : (
						<Save className="w-4 h-4" />
					)}
					{saving ? "Saving..." : "Save Changes"}
				</button>
			</div>
		</div>
	);
}
