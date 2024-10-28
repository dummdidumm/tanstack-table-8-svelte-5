# tanstack-table-8-svelte-5

A (almost) drop-in replacement for [`@tanstack/svelte-table@8`](https://www.npmjs.com/package/@tanstack/svelte-table) which works with Svelte 5.

## Setup

We recommend creating an alias in your `package.json` so that you don't need to change all your imports.

If you're sure that only your app and none of your dependencies depends on `@tanstack/svelte-table` then you can also simply adjust your `dependencies`:

```diff
{
  "dependencies": {
-    "@tanstack/svelte-table": "^8"
+    "@tanstack/svelte-table": "npm:tanstack-table-8-svelte-5"
  }
}
```

Else use you package manager's override mechanism to ensure that dependencies of your app also get the drop-in:

**Using npm (with `overrides` field)**

```json
{
	"overrides": {
		"@tanstack/svelte-table": "npm:tanstack-table-8-svelte-5"
	}
}
```

**Using pnpm (with `pnpm.overrides` field)**

```json
{
	"pnpm": {
		"overrides": {
			"@tanstack/svelte-table": "npm:tanstack-table-8-svelte-5"
		}
	}
}
```

## Caveat

This drop-in package works exactly like the original version, except when you want to provide custom components for rendering. You need to wrap those with `createComponent`:

```ts
import SomeCell from './SomeCell.svelte';
import { createComponent } from '@tanstack/svelte-table';

const defaultColumns: ColumnDef<Person>[] = [
	{
		accessorKey: 'firstName',
		// previously you were able to do this to render a custom component:
		// cell: SomeCell,
		// now you have to do this instead:
		cell: (props) => createComponent(SomeCell, props)
	}
];
```

> As a side effect, this prepares you for `@tanstack/svelte-table@9` because you will need to do the same there

## Documentation

For documentation about everything else refer to the original docs at https://tanstack.com/table/latest/docs/framework/svelte/svelte-table
