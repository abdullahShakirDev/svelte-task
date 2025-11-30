import { s3 } from '$lib/r2client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { json } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	try {
		const formData = await event.request.formData();
		const file = formData.get('file') as File | null;
		const type = (formData.get('type') as string) || 'image';

		if (!file) {
			return json({ success: false, message: 'No file uploaded' }, { status: 400 });
		}

		const bucket = env.BUCKET_NAME!;
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const folder = type === 'video' ? 'biovideo' : 'profilepic';
		const ext = file.name.split('.').pop();
		const uniqueName = `${Date.now()}-${randomUUID()}.${ext}`;
		const key = `${folder}/${uniqueName}`;

		const command = new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: buffer,
			ContentType: file.type
		});

		await s3.send(command);

		const url = `https://pub-1c2a242956a54b398011e950789c62a7.r2.dev/${key}`;

		return json({ success: true, url, key });
	} catch (error) {
		console.error('Upload error:', error);
		return json({ success: false, message: 'Upload failed' }, { status: 500 });
	}
};
