// In-memory store for verification codes
// In production, use Redis or database
interface VerificationEntry {
	code: string;
	email: string;
	name: string;
	password: string;
	role: 'student' | 'counsellor';
	expiresAt: number;
}

const verificationStore = new Map<string, VerificationEntry>();

// Cleanup expired codes periodically
setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of verificationStore.entries()) {
		if (entry.expiresAt < now) {
			verificationStore.delete(key);
		}
	}
}, 60000); // Clean every minute

export function generateVerificationCode(email: string): string {
	// Generate 6-digit code
	const code = Math.floor(100000 + Math.random() * 900000).toString();

	// Clean up any existing entry for this email
	const existingKey = [...verificationStore.entries()
		.find(([_, entry]) => entry.email === email)?.[0]];

	if (existingKey) {
		verificationStore.delete(existingKey[0]);
	}

	// Store with 10 minute expiry
	const expiresAt = Date.now() + 10 * 60 * 1000;
	verificationStore.set(email, {
		code,
		email,
		name: '', // Will be set during signup
		password: '', // Will be set during signup
		role: 'student',
		expiresAt,
	});

	return code;
}

export function getVerificationEntry(email: string): VerificationEntry | null {
	const entry = verificationStore.get(email);
	if (!entry) return null;

	if (entry.expiresAt < Date.now()) {
		verificationStore.delete(email);
		return null;
	}

	return entry;
}

export function verifyCode(email: string, code: string): boolean {
	const entry = getVerificationEntry(email);
	if (!entry) return false;

	if (entry.code !== code) return false;

	// Delete after successful verification
	verificationStore.delete(email);
	return true;
}

export function setPendingUser(email: string, name: string, password: string, role: 'student' | 'counsellor'): void {
	const entry = verificationStore.get(email);
	if (entry) {
		entry.name = name;
		entry.password = password;
		entry.role = role;
	}
}

export function getPendingUser(email: string): { name: string; password: string; role: 'student' | 'counsellor' } | null {
	const entry = getVerificationEntry(email);
	if (!entry) return null;
	return {
		name: entry.name,
		password: entry.password,
		role: entry.role,
	};
}

export function clearVerification(email: string): void {
	verificationStore.delete(email);
}