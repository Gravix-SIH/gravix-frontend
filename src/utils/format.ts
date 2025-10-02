// Number & string formatting
export function truncate(str: string, max: number = 50) {
	return str.length > max ? str.substring(0, max) + "..." : str;
}

export function formatCurrency(amount: number, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount);
}
