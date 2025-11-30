<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogFooter
	} from '$lib/components/ui/dialog';
	import { Spinner } from '$lib/components/ui/spinner';

	const { open, onOpenChange, user, onConfirm } = $props<{
		open: boolean;
		onOpenChange: (open: boolean) => void;
		user: any | null;
		onConfirm?: () => void;
	}>();
	let isDeletting = $state(false) as boolean;
</script>

<Dialog {open} {onOpenChange}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle></DialogTitle>

			<div class="mt-2 text-sm text-muted-foreground">
				Are you sure you want to delete
				<strong> {user?.name ?? 'this user'} </strong>?
			</div>
		</DialogHeader>

		<form
			method="POST"
			action="/user?/deleteUser"
			use:enhance={() => {
				isDeletting = true;
				return async ({ result, update }) => {
					if (result.type === 'success') {
						await update();
						onOpenChange(false);
					}
					isDeletting = false;
				};
			}}
		>
			<input type="hidden" name="id" value={user?.id ?? ''} />

			<DialogFooter>
				<Button
					variant="ghost"
					type="button"
					onclick={() => onOpenChange(false)}
					class="cursor-pointer">Cancel</Button
				>

				<Button variant="destructive" disabled={isDeletting} type="submit" class="cursor-pointer">
					{#if isDeletting}
						<Spinner />
					{:else}
						Delete
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
