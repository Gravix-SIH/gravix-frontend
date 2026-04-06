import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { ReactNode, useEffect } from 'react';
import { LoaderPinwheel } from 'lucide-react';

interface ProtectedRouteProps {
	children: ReactNode;
	redirectTo?: string;
	requireAdmin?: boolean;
}

export function ProtectedRoute({
	children,
	redirectTo = '/login',
	requireAdmin = false,
}: ProtectedRouteProps) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push(redirectTo);
		} else if (!loading && user && requireAdmin && user.role !== 'admin') {
			router.push('/');
		}
	}, [user, loading, router, redirectTo, requireAdmin]);

	if (loading) {
		return (
			<div className="absolute background-gradient flex w-screen h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900">
					<LoaderPinwheel className='animate-spin' />
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	if (requireAdmin && user.role !== 'admin') {
		return null;
	}

	return <>{children} </>;
}