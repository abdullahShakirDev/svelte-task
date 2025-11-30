<script lang="ts">
	import {
		Dialog,
		DialogClose,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { enhance } from '$app/forms';

	let { open, closeForm, user } = $props();

	let previewProfilePic = $state<string | null>(user.profilePic);
	let previewBioVideo = $state<string | null>(user.bioVideo);

	function handleProfilePicChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			previewProfilePic = URL.createObjectURL(file);
		}
	}

	function handleBioVideoChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			previewBioVideo = URL.createObjectURL(file);
		}
	}

	let isUpdating = $state(false) as boolean;
</script>

<Dialog {open} onOpenChange={closeForm}>
	<DialogContent class="flex max-h-[90vh] flex-col overflow-y-auto sm:max-w-[480px]">
		<form
			class="flex flex-1 flex-col px-2 py-4"
			method="POST"
			action="/user?/updateUser"
			enctype="multipart/form-data"
			use:enhance={() => {
				isUpdating = true;
				return async ({ result, update }) => {
					if (result.type === 'success') {
						await update();
						closeForm();
					}
					isUpdating = false;
				};
			}}
		>
			<DialogHeader>
				<DialogTitle>Update User</DialogTitle>
				<DialogDescription class="py-2.5">Update the details below.</DialogDescription>
			</DialogHeader>

			<div class="grid flex-1 gap-4">
				<div class="grid gap-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" type="text" value={user.name} required />
				</div>

				<div class="grid gap-2">
					<Label for="age">Age</Label>
					<Input id="age" name="age" type="number" min="1" max="100" value={user.age} required />
				</div>

				<div class="grid gap-2">
					<Label for="dob">Date of Birth</Label>
					<Input
						id="dob"
						name="dob"
						type="date"
						value={user.dob.toISOString().split('T')[0]}
						required
					/>
				</div>

				<div class="grid gap-2">
					<Label for="profilePic">Profile Picture</Label>
					<Input
						id="profilePic"
						name="profilePic"
						type="file"
						accept="image/*"
						onchange={handleProfilePicChange}
					/>
				</div>
				{#if previewProfilePic}
					<div class="mt-2 flex justify-center">
						<img
							src={previewProfilePic}
							class="rounded object-cover"
							width="100"
							height="100"
							alt=""
						/>
					</div>
				{/if}

				<div class="grid gap-2">
					<Label for="bioVideo">Bio Video</Label>
					<Input
						id="bioVideo"
						name="bioVideo"
						type="file"
						accept="video/*"
						onchange={handleBioVideoChange}
					/>

					{#if previewBioVideo}
						<video
							src={previewBioVideo}
							class="mt-2 max-h-48 w-full rounded border"
							controls
							preload="metadata"
						>
							<track kind="captions" />
						</video>
					{/if}
				</div>
			</div>

			<input type="hidden" name="id" value={user.id} />

			<DialogFooter class="sticky bottom-0 mt-2 border-t bg-background pt-4">
				<DialogClose>
					<Button variant="outline" type="button">Cancel</Button>
				</DialogClose>

				<Button type="submit">Update User</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
