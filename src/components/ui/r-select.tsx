"use client";

import { cn } from "@/lib/utils";
import { CaretSortIcon, Cross2Icon } from "@radix-ui/react-icons";
import { forwardRef } from "react";
import type { ClearIndicatorProps, DropdownIndicatorProps } from "react-select";
import ReactSelect, { components } from "react-select";

export const RSelect = forwardRef<
    typeof ReactSelect,
    React.ComponentPropsWithoutRef<typeof ReactSelect>
>(({ className, ...props }, ref) => {
    return (
        <ReactSelect
            //@ts-expect-error -- ref
            ref={ref}
            className={cn("", className)}
            {...props}
            unstyled
            components={{ DropdownIndicator, ClearIndicator }}
            classNames={{
                control: ({ isDisabled, isFocused, isMulti }) =>
                    cn(
                        "flex !min-h-10 h-full w-full items-center gap-2 min-w-32 md:min-w-44 justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background [&>span]:line-clamp-1",
                        {
                            "outline-none ring-2 ring-ring ring-offset-2":
                                isFocused,
                            "cursor-not-allowed opacity-50": isDisabled,
                            "px-2": isMulti,
                        },
                    ),

                placeholder: () => cn("text-muted-foreground"),

                multiValue: () =>
                    cn(
                        "bg-secondary rounded-md items-center py-0.5 ps-2 pe-1 gap-1.5 me-1",
                    ),

                menu: () =>
                    cn(
                        "relative !z-[999999999] max-h-96 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                    ),

                menuList: () => cn("space-y-1 p-1 !z-[999999999]"),

                option: ({ isDisabled, isFocused, isSelected }) =>
                    cn(
                        "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ",
                        {
                            "bg-accent text-accent-foreground": isFocused,
                            "bg-primary text-primary-foreground": isSelected,
                            "pointer-events-none opacity-50": isDisabled,
                        },
                    ),

                groupHeading: () =>
                    cn(
                        "text-sm text-muted-foreground font-semibold px-2 py-1.5",
                    ),

                noOptionsMessage: () =>
                    cn("text-muted-foreground p-2 rounded-sm"),
            }}
            formatGroupLabel={({ options, label }) => (
                <div className="flex items-center gap-1.5">
                    <span>{label}</span>
                    <div className="flex aspect-square h-5 items-center justify-center rounded-full bg-secondary text-xs">
                        {options.length}
                    </div>
                </div>
            )}
            noOptionsMessage={() => "No Options"}
        />
    );
});

RSelect.displayName = "RSelect";

const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
        <components.DropdownIndicator {...props}>
            <CaretSortIcon className="h-4 w-4 opacity-50" />
        </components.DropdownIndicator>
    );
};

const ClearIndicator = (props: ClearIndicatorProps) => {
    return (
        <components.ClearIndicator
            {...props}
            className="me-1 rounded-md bg-secondary/50 p-1 transition-colors hover:bg-secondary"
        >
            <Cross2Icon className="h-4 w-4 opacity-50" />
        </components.ClearIndicator>
    );
};

export interface Option {
    readonly value: string;
    readonly label: string;
}

export interface GroupedOption {
    readonly label: string;
    readonly options: readonly Option[];
}
