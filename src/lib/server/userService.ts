import { prisma } from '$lib/prisma';
import type { SortDirection, SortOptionAge, SortOptionDob, SortOptionName } from '$lib/types/sort';
import type { Prisma } from '@prisma/client';

// export async function filterUsers(params: {
// 	search?: string;
// 	ageRange?: string;
// 	dobRange?: string;
// 	sort?: string;
// 	page?: number;
// }) {
// 	const { users } = await getAllUsers(
// 		params.page ?? 1,
// 		10,
// 		params.ageRange ?? 'all',
// 		params.dobRange ?? 'all',
// 		params.sort ?? '',
// 		params.search ?? ''
// 	);

// 	return users;
// }

// Get All Users

export async function getAllUsers(
	page = 1,
	limit = 5,
	ageRange?: string,
	dobRange?: string,
	sort?: string,
	search?: string
) {
	// Pagination
	const skip = (page - 1) * limit;
	const where: Prisma.UserWhereInput = {};

	// Search filter

	if (search) {
		const orCondition: Prisma.UserWhereInput[] = [];

		if (isNaN(Number(search)) && search.length >= 3) {
			orCondition.push({ name: { contains: search } });
			where.OR = orCondition;
		}

		if (!isNaN(Number(search)) && search.length > 0) {
			orCondition.push({ age: { equals: Number(search) } });
			where.OR = orCondition;
		}

		if (!isNaN(Number(search)) && search.length === 4) {
			const year = Number(search);
			orCondition.push({
				dob: {
					gte: new Date(`${year}-01-01T00:00:00.000Z`),
					lte: new Date(`${year}-12-31T23:59:59.999Z`)
				}
			});
			where.OR = orCondition;
		}
	}

	// Age filter
	if (!ageRange) {
		// do nothing
	} else if (ageRange === 'all') {
		where.age = {};
	} else if (ageRange === '40+') {
		where.age = { gte: 40 };
	} else if (ageRange.includes('-')) {
		const [minAge, maxAge] = ageRange.split('-').map(Number);
		where.age = { gte: minAge, lte: maxAge };
	}

	// DOB filter
	if (!dobRange) {
		// do nothing
	} else if (dobRange === 'all') {
		where.dob = {};
	} else if (dobRange === '2000+') {
		where.dob = {
			gte: new Date('2000-01-01T00:00:00.000Z')
		};
	} else {
		const [start, end] = dobRange.split('-').map(Number);
		where.dob = {
			gte: new Date(`${start}-01-01T00:00:00.000Z`),
			lte: new Date(`${end}-12-31T23:59:59.999Z`)
		};
	}

	// Build orderBy inline
	const getOrderBy = (): (SortOptionName | SortOptionAge | SortOptionDob)[] | undefined => {
		if (!sort) return undefined;

		const allowedFields = new Set(['name', 'age', 'dob']);
		const sortParts = sort.split(',');

		const orderBy = sortParts.flatMap((part) => {
			const [field, direction] = part.split('-') as [string, SortDirection];

			if (!allowedFields.has(field)) {
				return [];
			}

			return [{ [field]: direction }];
		});

		return orderBy.length > 0 ? orderBy : undefined;
	};

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			skip,
			take: limit,
			where,
			orderBy: getOrderBy()
		}),
		prisma.user.count({ where })
	]);

	return { users, totalPages: Math.ceil(total / limit) };
}
