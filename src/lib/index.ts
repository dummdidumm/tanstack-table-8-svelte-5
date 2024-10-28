import {
	type RowData,
	createTable,
	type TableOptions,
	type TableOptionsResolved
} from '@tanstack/table-core';
import Placeholder from './placeholder.svelte';
import { type Component, type ComponentProps } from 'svelte';
import { readable, writable, derived, type Readable, get } from 'svelte/store';

export * from '@tanstack/table-core';

/**
 * A helper function to help create cells from Svelte components through ColumnDef's `cell` and `header` properties.
 * @param component A Svelte component
 * @param props The props to pass to `component`
 * @returns A `RenderComponentConfig` object that helps svelte-table know how to render the header/cell component.
 * @example
 * ```ts
 * // +page.svelte
 * const defaultColumns = [
 *   columnHelper.accessor('name', {
 *     header: header => renderComponent(SortHeader, { label: 'Name', header }),
 *   }),
 *   columnHelper.accessor('state', {
 *     header: header => renderComponent(SortHeader, { label: 'State', header }),
 *   }),
 * ]
 * ```
 * @see {@link https://tanstack.com/table/latest/docs/guide/column-defs}
 */
export function renderComponent<TComponent extends Component<any>>(
	Comp: TComponent,
	props: ComponentProps<TComponent>
): any {
	return (anchor: any) => Comp(anchor, props);
}

function wrapInPlaceholder(content: any) {
	return renderComponent(Placeholder, { content });
}

export function flexRender(component: any, props: any): Component | null {
	if (!component) return null;

	if (typeof component === 'function') {
		const result = component(props);
		if (result === null || result === undefined) return null;

		if (typeof result === 'function') {
			return renderComponent(result, props);
		}

		return wrapInPlaceholder(result);
	}

	return wrapInPlaceholder(component);
}

type ReadableOrVal<T> = T | Readable<T>;

export function createSvelteTable<TData extends RowData>(
	options: ReadableOrVal<TableOptions<TData>>
) {
	let optionsStore: Readable<TableOptions<TData>>;

	if ('subscribe' in options) {
		optionsStore = options;
	} else {
		optionsStore = readable(options);
	}

	let resolvedOptions: TableOptionsResolved<TData> = {
		state: {}, // Dummy state
		onStateChange: () => {}, // noop
		renderFallbackValue: null,
		...get(optionsStore)
	};

	let table = createTable(resolvedOptions);

	let stateStore = writable(/** @type {number} */ table.initialState);
	// combine stores
	let stateOptionsStore = derived([stateStore, optionsStore], (s) => s);
	const tableReadable = readable(table, function start(set) {
		const unsubscribe = stateOptionsStore.subscribe(([state, options]) => {
			table.setOptions((prev) => {
				return {
					...prev,
					...options,
					state: { ...state, ...options.state },
					// Similarly, we'll maintain both our internal state and any user-provided
					// state.
					onStateChange: (updater) => {
						if (updater instanceof Function) {
							stateStore.update(updater);
						} else {
							stateStore.set(updater);
						}

						resolvedOptions.onStateChange?.(updater);
					}
				};
			});

			// it didn't seem to rerender without setting the table
			set(table);
		});

		return function stop() {
			unsubscribe();
		};
	});

	return tableReadable;
}
