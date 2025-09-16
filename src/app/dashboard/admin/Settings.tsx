"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AdminSettings() {
	const [maintenanceMode, setMaintenanceMode] = useState(false);

	return (
		<Card>
			<CardHeader>
				<CardTitle>System Settings</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Maintenance Mode */}
				<div className="flex items-center justify-between">
					<Label htmlFor="maintenance">Maintenance Mode</Label>
					<Switch
						id="maintenance"
						checked={maintenanceMode}
						onCheckedChange={setMaintenanceMode}
					/>
				</div>

				{/* Organization Info */}
				<div className="space-y-2">
					<Label htmlFor="orgName">Organization Name</Label>
					<Input id="orgName" placeholder="Enter organization name" />
				</div>

				{/* Save */}
				<Button>Save Settings</Button>
			</CardContent>
		</Card>
	);
}
