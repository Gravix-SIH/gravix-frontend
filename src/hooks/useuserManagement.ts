"use client";
import { useState } from "react";

export function useUserManagement() {
	const [users, setUsers] = useState<any[]>([]);

	const fetchUsers = async () => {
		const res = await fetch("/api/admin/users");
		const data = await res.json();
		setUsers(data);
	};

	const updateUserRole = async (userId: string, role: string) => {
		const res = await fetch(`/api/admin/users/${userId}`, {
			method: "PUT",
			body: JSON.stringify({ role }),
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();
		setUsers((prev) =>
			prev.map((u) => (u.id === userId ? { ...u, role: data.role } : u))
		);
	};

	return { users, fetchUsers, updateUserRole };
}
