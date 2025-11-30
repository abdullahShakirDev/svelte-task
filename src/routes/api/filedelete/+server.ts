import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { s3 } from '$lib/r2client';
import { env } from '$env/dynamic/private';

export const DELETE: RequestHandler = async (event) => {
	try {
		const { userId, fileType } = await event.request.json();

		if (!userId || !fileType) {
			return json({ success: false, message: 'Missing userId or fileType' }, { status: 400 });
		}

		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			return json({ success: false, message: 'User not found' }, { status: 404 });
		}

		const key =
			fileType === 'profilePic'
				? user.profilePicKey
				: fileType === 'bioVideo'
					? user.bioVideoKey
					: null;

		if (!key) {
			return json({ success: false, message: 'No file key found' }, { status: 400 });
		}

		await s3.send(
			new DeleteObjectCommand({
				Bucket: env.BUCKET_NAME!,
				Key: key
			})
		);

		return json({ success: true, message: 'File deleted' });
	} catch (error) {
		return json(
			{
				success: false,
				message: error instanceof Error ? error.message : 'Delete failed'
			},
			{ status: 500 }
		);
	}
};
