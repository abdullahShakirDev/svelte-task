import type { PageServerLoad } from './$types';
import { getAllUsers } from '$lib/server/userService';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? 1);
	const ageRange = url.searchParams.get('age') ?? undefined;
	const dobRange = url.searchParams.get('dob') ?? undefined;
	const sort = url.searchParams.get('sort') ?? undefined;
	const search = url.searchParams.get('search') ?? undefined;

	const { users, totalPages } = await getAllUsers(page, 10, ageRange, dobRange, sort, search);

	return {
		users,
		currentPage: page,
		totalPages,
		ageRange,
		dobRange,
		sort,
		search
	};
};
