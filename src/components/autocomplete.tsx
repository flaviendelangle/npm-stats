'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface AutocompleteProps<T> {
  items: T[];
  value: T[];
  onValueChange: (value: T[]) => void;
  getItemLabel: (item: T) => string;
  getItemKey: (item: T) => string;
  /**
   * Called when the user types a value that doesn't exist in the items list and presses Enter.
   * Return the new item to add, or null to prevent adding.
   */
  createItem?: (inputValue: string) => T | null;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function Autocomplete<T>({
  items,
  value,
  onValueChange,
  getItemLabel,
  getItemKey,
  createItem,
  placeholder = 'Search...',
  className,
  id,
}: AutocompleteProps<T>) {
  const [inputValue, setInputValue] = React.useState('');
  const highlightedItemRef = React.useRef<T | null>(null);

  const handleSelect = (item: T | null) => {
    if (!item) return;

    const key = getItemKey(item);
    const isSelected = value.some((v) => getItemKey(v) === key);

    if (isSelected) {
      onValueChange(value.filter((v) => getItemKey(v) !== key));
    } else {
      onValueChange([...value, item]);
    }

    setInputValue('');
  };

  const handleRemove = (item: T) => {
    onValueChange(value.filter((v) => getItemKey(v) !== getItemKey(item)));
  };

  const isItemSelected = (item: T) => {
    return value.some((v) => getItemKey(v) === getItemKey(item));
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Selected items as tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item) => (
            <span
              key={getItemKey(item)}
              className="inline-flex items-center gap-1 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground"
            >
              {getItemLabel(item)}
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="hover:text-foreground text-muted-foreground transition-colors"
                aria-label={`Remove ${getItemLabel(item)}`}
              >
                <XIcon className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Autocomplete input */}
      <AutocompletePrimitive.Root
        items={items}
        value={inputValue}
        onValueChange={(newValue, eventDetails) => {
          if (eventDetails.reason === 'input-change') {
            setInputValue(newValue ?? '');
          } else if (
            eventDetails.reason === 'item-press' ||
            eventDetails.reason === 'list-navigation'
          ) {
            // Find the selected item and toggle it
            const selectedItem = items.find(
              (item) => getItemLabel(item).toLowerCase() === newValue?.toLowerCase(),
            );
            if (selectedItem) {
              handleSelect(selectedItem);
            }
          }
        }}
        onItemHighlighted={(highlightedValue) => {
          highlightedItemRef.current = highlightedValue ?? null;
        }}
        itemToStringValue={getItemLabel}
      >
        <div className="relative">
          <AutocompletePrimitive.Input
            id={id}
            placeholder={placeholder}
            className={cn(
              'border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50',
              'h-8 w-full rounded-none border bg-transparent py-2 pr-8 pl-2.5 text-xs transition-colors',
              'outline-none focus-visible:ring-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                highlightedItemRef.current == null &&
                inputValue.trim() !== '' &&
                createItem
              ) {
                event.preventDefault();
                const trimmedValue = inputValue.trim();
                // Check if it's already selected
                const alreadySelected = value.some(
                  (v) => getItemKey(v).toLowerCase() === trimmedValue.toLowerCase(),
                );
                if (!alreadySelected) {
                  const newItem = createItem(trimmedValue);
                  if (newItem) {
                    onValueChange([...value, newItem]);
                  }
                }
                setInputValue('');
              }
            }}
          />
          <AutocompletePrimitive.Trigger className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDownIcon className="size-4" />
          </AutocompletePrimitive.Trigger>
        </div>

        <AutocompletePrimitive.Portal>
          <AutocompletePrimitive.Positioner
            side="bottom"
            sideOffset={4}
            align="start"
            className="isolate z-50"
          >
            <AutocompletePrimitive.Popup
              className={cn(
                'bg-popover text-popover-foreground',
                'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95',
                'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
                'ring-foreground/10 min-w-36 rounded-none shadow-md ring-1 duration-100',
                'relative isolate z-50 max-h-60 w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto',
              )}
            >
              <AutocompletePrimitive.Empty className="py-6 text-center text-sm text-muted-foreground empty:py-0">
                No results found.
              </AutocompletePrimitive.Empty>
              <AutocompletePrimitive.List>
                {(item) => (
                  <AutocompletePrimitive.Item
                    key={getItemKey(item)}
                    value={item}
                    className={cn(
                      'focus:bg-accent focus:text-accent-foreground',
                      'gap-2 rounded-none py-2 pr-8 pl-2 text-xs',
                      'relative flex w-full cursor-default items-center outline-hidden select-none',
                      'data-disabled:pointer-events-none data-disabled:opacity-50',
                      'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
                    )}
                  >
                    <span className="flex-1">{getItemLabel(item)}</span>
                    {isItemSelected(item) && <CheckIcon className="absolute right-2 size-4" />}
                  </AutocompletePrimitive.Item>
                )}
              </AutocompletePrimitive.List>
            </AutocompletePrimitive.Popup>
          </AutocompletePrimitive.Positioner>
        </AutocompletePrimitive.Portal>
      </AutocompletePrimitive.Root>
    </div>
  );
}
