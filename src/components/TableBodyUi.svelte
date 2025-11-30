<script lang="ts">
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import { TableRow, TableCell, TableBody } from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { formatDate } from '$lib/helpers';
	import UpdateUserForm from './UpdateUserForm.svelte';
	import Confirm from './Confirm.svelte';
	import { Edit, EllipsisVertical, Trash } from '@lucide/svelte';
	import type { User } from '$lib/types/user';
	import DisplayPicture from './DisplayPicture.svelte';
	import DisplayVideo from './DisplayVideo.svelte';

	const { users } = $props<{ users: User[] }>();

	let openFormId = $state<number | null>(null);
	function openForm(id: number) {
		openFormId = id;
	}
	function closeForm() {
		openFormId = null;
	}

	let deleteOpen = $state(false);
	let selectedUserForDelete: User | null = $state(null);

	function openDeleteModal(user: User) {
		selectedUserForDelete = user;
		deleteOpen = true;
	}

	function handleDeleteConfirm() {
		console.log('DELETING user id:', selectedUserForDelete?.id);
	}
</script>

<TableBody>
	{#each users as user}
		<TableRow class="text-center transition-colors hover:bg-muted/50">
			<TableCell class="px-6 py-4 font-medium">{user.name}</TableCell>
			<TableCell class="px-6 py-4">{user.age}</TableCell>

			{#if user.profilePic}
				<TableCell class="flex justify-center px-6 py-4">
					<DisplayPicture url={user.profilePic} />
				</TableCell>
			{:else}
				<TableCell class="flex justify-center px-6 py-4">
					<span class="text-3xl text-muted-foreground">-</span>
				</TableCell>
			{/if}

			<TableCell class="px-6 py-4">
				{formatDate(new Date(user.dob))}
			</TableCell>

			{#if user.bioVideo}
				<TableCell class="flex justify-center px-6 py-4">
					<DisplayVideo url={user.bioVideo} />
				</TableCell>
			{:else}
				<TableCell class="flex justify-center px-6 py-4">
					<span class="text-3xl text-muted-foreground">-</span>
				</TableCell>
			{/if}

			<TableCell class="space-x-2 px-6 py-4">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button variant="outline" size="icon-sm" class="cursor-pointer">
							<EllipsisVertical />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent>
						<DropdownMenuItem onclick={() => openForm(user.id)}>
							<div class="flex items-center gap-2">
								<Edit />
								<span>Edit</span>
							</div>
						</DropdownMenuItem>

						<DropdownMenuItem onclick={() => openDeleteModal(user)}>
							<div class="flex items-center gap-2">
								<Trash />
								<span>Delete</span>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{#if openFormId === user.id}
					<UpdateUserForm {user} open={true} {closeForm} />
				{/if}
			</TableCell>
		</TableRow>
	{/each}
</TableBody>

<Confirm
	open={deleteOpen}
	onOpenChange={(o) => (deleteOpen = o)}
	user={selectedUserForDelete}
	onConfirm={handleDeleteConfirm}
/>
