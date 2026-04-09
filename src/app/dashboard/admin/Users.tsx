"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	Search,
	LoaderPinwheel,
	ShieldCheck,
	UserCog,
	UserX,
	Trash2,
	Filter,
	Users,
	Mail,
	Building2,
} from "lucide-react";
import {
	adminService,
	AdminUser,
	UserFilters,
} from "@/services/adminService";
import { toast } from "sonner";

export default function AdminUsers() {
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("");
	const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [actionLoading, setActionLoading] = useState<string | null>(null);

	const fetchUsers = useCallback(async (filters?: UserFilters) => {
		setLoading(true);
		setError("");
		try {
			const data = await adminService.getUsers(filters);
			setUsers(data);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load users");
			toast.error("Failed to load users");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers({
			search: search || undefined,
			role: roleFilter && roleFilter !== "__all__" ? roleFilter : undefined,
		});
	}, [fetchUsers, search, roleFilter]);

	const handleRoleChange = async (id: string, role: string) => {
		setActionLoading(id);
		try {
			await adminService.updateUser(id, { role: role as AdminUser["role"] });
			setEditingUser(null);
			toast.success("User role updated");
			fetchUsers({
				search: search || undefined,
				role: roleFilter && roleFilter !== "__all__" ? roleFilter : undefined,
			});
		} catch (e) {
			toast.error("Failed to update role: " + (e instanceof Error ? e.message : "Unknown error"));
		} finally {
			setActionLoading(null);
		}
	};

	const handleActiveToggle = async (id: string, is_active: boolean) => {
		setActionLoading(id);
		try {
			await adminService.updateUser(id, { is_active });
			toast.success(is_active ? "User activated" : "User deactivated");
			fetchUsers({
				search: search || undefined,
				role: roleFilter && roleFilter !== "__all__" ? roleFilter : undefined,
			});
		} catch (e) {
			toast.error("Failed to update status: " + (e instanceof Error ? e.message : "Unknown error"));
		} finally {
			setActionLoading(null);
		}
	};

	const handleDelete = async (id: string) => {
		setActionLoading(id);
		try {
			await adminService.deleteUser(id);
			setDeleteConfirm(null);
			toast.success("User deleted");
			fetchUsers({
				search: search || undefined,
				role: roleFilter && roleFilter !== "__all__" ? roleFilter : undefined,
			});
		} catch (e) {
			toast.error("Failed to delete user: " + (e instanceof Error ? e.message : "Unknown error"));
		} finally {
			setActionLoading(null);
		}
	};

	const roleIcon = (role: string) => {
		switch (role) {
			case "admin":
				return <ShieldCheck className="w-3 h-3" />;
			case "counsellor":
				return <UserCog className="w-3 h-3" />;
			default:
				return null;
		}
	};

	return (
		<div className="p-4 sm:p-6 space-y-4">
			{/* Header Stats */}
			<div className="grid grid-cols-3 gap-4">
				{[
					{
						label: "Total Users",
						value: users.length,
						icon: Users,
						color: "bg-indigo-500",
					},
					{
						label: "Active",
						value: users.filter((u) => u.is_active).length,
						icon: ShieldCheck,
						color: "bg-emerald-500",
					},
					{
						label: "Inactive",
						value: users.filter((u) => !u.is_active).length,
						icon: UserX,
						color: "bg-rose-500",
					},
				].map((stat) => (
					<Card key={stat.label}>
						<CardContent className="pt-4 flex items-center justify-between">
							<div>
								<p className="text-2xl font-bold">{stat.value}</p>
								<p className="text-xs text-text-secondary">{stat.label}</p>
							</div>
							<div className={`p-2.5 rounded-xl ${stat.color}`}>
								<stat.icon className="w-4 h-4 text-white" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">User Management</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
								<Input
									placeholder="Search name or email..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="pl-9 w-full sm:w-56 text-sm"
								/>
							</div>
							<div className="relative">
								<Select value={roleFilter} onValueChange={setRoleFilter}>
									<SelectTrigger className="h-10 pl-8 pr-3 w-full rounded-xl">
										<div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
											<Filter className="w-4 h-4 text-text-secondary" />
										</div>
										<SelectValue placeholder="All Roles" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="__all__">All Roles</SelectItem>
										<SelectItem value="student">Student</SelectItem>
										<SelectItem value="counsellor">Counsellor</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{loading ? (
						<div className="flex justify-center py-12">
							<LoaderPinwheel className="animate-spin w-6 h-6 text-muted-foreground" />
						</div>
					) : error ? (
						<div className="flex items-center justify-center py-12 text-red-500 text-sm gap-2">
							<UserX className="w-4 h-4" />
							{error}
						</div>
					) : users.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 gap-2">
							<Users className="w-8 h-8 text-text-secondary/50" />
							<p className="text-sm text-text-secondary">No users found</p>
						</div>
					) : (
						<div className="space-y-2">
							{users.map((u) => (
								<div
									key={u.id}
									className="flex items-center justify-between p-3 rounded-2xl border border-border/40 hover:border-border/80 transition-all bg-gradient-to-br from-background to-background/80"
								>
									<div className="flex items-center gap-3 flex-1 min-w-0">
										{/* Avatar */}
										<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
											{u.is_anonymous
												? "?"
												: (u.name || u.email || "?").charAt(0).toUpperCase()}
										</div>

										{/* Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												<p className="text-sm font-semibold truncate">
													{u.is_anonymous ? u.anon_id : u.name || "Unnamed"}
												</p>
												<Badge
													variant={u.role}
												>
													<span className="flex items-center gap-1">
														{roleIcon(u.role)}
														{u.role}
													</span>
												</Badge>
												{!u.is_active && (
													<Badge variant="error-soft">
														Inactive
													</Badge>
												)}
											</div>
											<div className="flex items-center gap-3 mt-0.5">
												{u.is_anonymous ? (
													<span className="text-xs text-text-secondary">Anonymous</span>
												) : (
													<span className="text-xs text-text-secondary flex items-center gap-1">
														<Mail className="w-3 h-3" />
														{u.email}
													</span>
												)}
												{u.department && (
													<span className="text-xs text-text-secondary flex items-center gap-1">
														<Building2 className="w-3 h-3" />
														{u.department}
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex items-center gap-2 ml-4 shrink-0">
										{actionLoading === u.id ? (
											<LoaderPinwheel className="animate-spin w-4 h-4" />
										) : editingUser?.id === u.id ? (
											<>
												<select
													className="border rounded-xl px-2 py-1.5 text-sm"
													defaultValue={u.role}
													id={`role-${u.id}`}
												>
													<option value="student">Student</option>
													<option value="counsellor">Counsellor</option>
													<option value="admin">Admin</option>
												</select>
												<button
													className="px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
													onClick={() => {
														const sel = document.getElementById(
															`role-${u.id}`
														) as HTMLSelectElement;
														handleRoleChange(u.id, sel.value);
													}}
												>
													Save
												</button>
												<button
													className="px-3 py-1.5 rounded-xl text-xs font-medium text-text-secondary hover:bg-gray-100 transition-colors"
													onClick={() => setEditingUser(null)}
												>
													Cancel
												</button>
											</>
										) : deleteConfirm === u.id ? (
											<>
												<span className="text-xs text-text-secondary">
													Delete?
												</span>
												<button
													className="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
													onClick={() => handleDelete(u.id)}
												>
													Confirm
												</button>
												<button
													className="px-3 py-1.5 rounded-xl text-xs font-medium text-text-secondary hover:bg-gray-100 transition-colors"
													onClick={() => setDeleteConfirm(null)}
												>
													Cancel
												</button>
											</>
										) : (
											<>
												<button
													className="px-3 py-1.5 rounded-xl text-xs font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors"
													onClick={() => setEditingUser(u)}
												>
													Edit Role
												</button>
												<button
													className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
														u.is_active
															? "text-amber-600 border-amber-200 hover:bg-amber-50"
															: "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
													}`}
													onClick={() =>
														handleActiveToggle(u.id, !u.is_active)
													}
												>
													{u.is_active ? "Deactivate" : "Activate"}
												</button>
												<button
													className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
													onClick={() => setDeleteConfirm(u.id)}
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
