<script lang="ts">
	import {
		Dialog,
		DialogTrigger,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogFooter,
		DialogClose
	} from '$lib/components/ui/dialog';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus } from '@lucide/svelte'; // Standard import for lucide-svelte
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	let isUpdatting = $state(false);
	let open = $state(false);

	let imgPreview = $state<string | null>(null);
	let videoPreview = $state<string | null>(null);

	const resetFormState = () => {
		open = false;
		if (imgPreview) URL.revokeObjectURL(imgPreview);
		if (videoPreview) URL.revokeObjectURL(videoPreview);
		imgPreview = null;
		videoPreview = null;
	};

	const onOpenChange = (isOpen: boolean) => {
		open = isOpen;
		if (!isOpen) resetFormState();
	};

	function handleFileChange(e: Event, type: 'image' | 'video') {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const objectUrl = URL.createObjectURL(file);
			if (type === 'image') {
				if (imgPreview) URL.revokeObjectURL(imgPreview);
				imgPreview = objectUrl;
			} else {
				if (videoPreview) URL.revokeObjectURL(videoPreview);
				videoPreview = objectUrl;
			}
		}
	}
</script>

<Dialog bind:open {onOpenChange}>
	<DialogTrigger>
		<Button variant="outline" size="icon" class="cursor-pointer"><Plus class="h-4 w-4" /></Button>
	</DialogTrigger>

	<DialogContent class="flex max-h-[90vh] flex-col overflow-y-auto sm:max-w-[480px]">
		<form
			class="flex flex-1 flex-col px-2 py-4"
			method="POST"
			action="/user?/createUser"
			enctype="multipart/form-data"
			use:enhance={() => {
				isUpdatting = true;
				return async ({ result, update }) => {
					if (result.type === 'success') {
						await update();
						resetFormState();
					}
					isUpdatting = false;
				};
			}}
		>
			<DialogHeader>
				<DialogTitle>Add a new user</DialogTitle>
				<DialogDescription class="py-2.5">
					Fill in the details below to create a new user profile.
				</DialogDescription>
			</DialogHeader>

			<div class="grid flex-1 gap-4">
				<div class="grid gap-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" type="text" placeholder="Enter your name" required />
				</div>

				<div class="grid gap-2">
					<Label for="age">Age</Label>
					<Input
						id="age"
						name="age"
						type="number"
						min="1"
						max="100"
						placeholder="Enter your age"
						required
					/>
				</div>

				<div class="grid gap-2">
					<Label for="dob">Date of Birth</Label>
					<Input id="dob" name="dob" type="date" required />
				</div>

				<div class="grid gap-2">
					<Label for="profilePic">Profile Picture</Label>
					<div class="flex flex-col items-center gap-2">
						<Input
						id="profilePic"
						name="profilePic"
						type="file"
						accept="image/*"
						onchange={(e) => handleFileChange(e, 'image')}
						/>
					{#if imgPreview}
					<div class="mt-2">
							<img
							src={imgPreview}
							alt="Profile preview"
							class="h-32 w-32 rounded-lg border object-cover shadow-sm"
							/>
						</div>
						{/if}
					</div>
				</div>

				<!-- Bio Video Input + Preview -->
				<div class="grid gap-2">
					<Label for="bioVideo">Bio Video</Label>
					<div class="flex flex-col items-center gap-2">
						<Input
						id="bioVideo"
						name="bioVideo"
						type="file"
						accept="video/*"
						onchange={(e) => handleFileChange(e, 'video')}
						/>
						{#if videoPreview}
						<div class="mt-2">
							<!-- svelte-ignore a11y_media_has_caption -->
							<video
							src={videoPreview}
							controls
							class="aspect-video w-full rounded-lg border shadow-sm"
							>
						</video>
					</div>
					{/if}
				</div>
				</div>
			</div>

			<DialogFooter class="sticky bottom-0 mt-2 border-t bg-background pt-4">
				<DialogClose>
					<Button variant="outline" type="button" class="cursor-pointer">Cancel</Button>
				</DialogClose>
				<Button type="submit" class="cursor-pointer" disabled={isUpdatting}>
					{#if isUpdatting}
						<Spinner />
					{:else}
						Add User
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
