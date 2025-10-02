"use client";
import { useState } from "react";

export function useBooking() {
	const [bookings, setBookings] = useState<any[]>([]);

	const createBooking = async (slotId: string) => {
		const res = await fetch("/api/booking", {
			method: "POST",
			body: JSON.stringify({ slotId }),
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();
		setBookings((prev) => [...prev, data]);
		return data;
	};

	const fetchBookings = async () => {
		const res = await fetch("/api/booking");
		const data = await res.json();
		setBookings(data);
	};

	return { bookings, createBooking, fetchBookings };
}
