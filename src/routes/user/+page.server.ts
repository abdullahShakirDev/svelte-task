import { prisma } from '$lib/prisma';
import type { Actions } from './$types';

export const actions = {
	createUser: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name') as string;
		const age = Number(formData.get('age'));
		const dob = formData.get('dob') as string;
		const profileFile = formData.get('profilePic') as File | null;
		const videoFile = formData.get('bioVideo') as File | null;

		const uploadFile = async (file: File | null, type: 'image' | 'video') => {
			if (!file || file.size === 0) return { url: '', key: '' };

			const data = new FormData();
			data.append('file', file);
			data.append('type', type);

			const res = await event.fetch(`/api/fileupload`, {
				method: 'POST',
				body: data
			});

			const json = await res.json();
			return { url: json.url || '', key: json.key || '' };
		};

		const profilePicUpload = await uploadFile(profileFile, 'image');
		const bioVideoUpload = await uploadFile(videoFile, 'video');

		await prisma.user.create({
			data: {
				name,
				age,
				dob: new Date(dob),
				profilePic: profilePicUpload.url,
				profilePicKey: profilePicUpload.key,
				bioVideo: bioVideoUpload.url,
				bioVideoKey: bioVideoUpload.key
			}
		});

		return { success: true };
	},
	deleteUser: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		if (!id) return;

		const user = await prisma.user.findUnique({ where: { id } });
		if (!user) return;

		const filesToDelete = [
			{ key: user.profilePicKey, type: 'profilePic' },
			{ key: user.bioVideoKey, type: 'bioVideo' }
		].filter((file) => file.key);

		await Promise.all(
			filesToDelete.map((file) =>
				event.fetch(`/api/filedelete`, {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: id, fileType: file.type })
				})
			)
		);

		await prisma.user.delete({ where: { id } });
		return { success: true };
	},
	updateUser: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const age = Number(formData.get('age'));
		const dob = formData.get('dob') as string;

		if (!id) return;

		const user = await prisma.user.findUnique({ where: { id } });
		if (!user) return;

		const profileFile = formData.get('profilePic') as File | null;
		const videoFile = formData.get('bioVideo') as File | null;

		const uploadFile = async (file: File | null, type: 'image' | 'video') => {
			if (!file || file.size === 0) return { url: null, key: null };

			const data = new FormData();
			data.append('file', file);
			data.append('type', type);

			const res = await event.fetch(`/api/fileupload`, {
				method: 'POST',
				body: data
			});

			if (!res.ok) throw new Error('Upload failed');
			const json = await res.json();
			return { url: json.url, key: json.key };
		};

		let newProfileUrl = user.profilePic;
		let newProfileKey = user.profilePicKey;
		let newVideoUrl = user.bioVideo;
		let newVideoKey = user.bioVideoKey;

		if (profileFile && profileFile.size > 0) {
			if (user.profilePicKey) {
				await event.fetch(`/api/filedelete`, {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: id, fileType: 'profilePic' })
				});
			}

			const profileUpload = await uploadFile(profileFile, 'image');
			if (profileUpload.url && profileUpload.key) {
				newProfileUrl = profileUpload.url;
				newProfileKey = profileUpload.key;
			}
		}

		if (videoFile && videoFile.size > 0) {
			if (user.bioVideoKey) {
				await event.fetch(`/api/filedelete`, {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: id, fileType: 'bioVideo' })
				});
			}

			const videoUpload = await uploadFile(videoFile, 'video');
			if (videoUpload.url && videoUpload.key) {
				newVideoUrl = videoUpload.url;
				newVideoKey = videoUpload.key;
			}
		}

		await prisma.user.update({
			where: { id },
			data: {
				name,
				age,
				dob: new Date(dob),
				profilePic: newProfileUrl,
				profilePicKey: newProfileKey,
				bioVideo: newVideoUrl,
				bioVideoKey: newVideoKey
			}
		});

		return { success: true };
	}
} satisfies Actions;
