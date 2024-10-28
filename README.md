# tanstack-table-8-svelte-5

A (almost) drop-in replacement for [`@tanstack/svelte-table@8`](https://www.npmjs.com/package/@tanstack/svelte-table) which works with Svelte 5.

Almost, because it works exactly like the original version, except when you want to provide custom components for rendering, you need to wrap it in `createComponent`:

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

For documentation about everything else refer to https://tanstack.com/table/latest/docs/framework/svelte/svelte-table
