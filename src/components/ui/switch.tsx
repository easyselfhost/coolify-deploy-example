"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  // Add a ref to store the previous checked state
  const prevCheckedRef = React.useRef(props.checked);

  // Memoize handler to prevent infinite loops  
  const handleCheckedChange = React.useCallback((checked: boolean) => {
    if (props.onCheckedChange && prevCheckedRef.current !== checked) {
      prevCheckedRef.current = checked;
      props.onCheckedChange(checked);
    }
  }, [props.onCheckedChange]);

  React.useEffect(() => {
    // Update ref when checked prop changes externally
    if (props.checked !== undefined) {
      prevCheckedRef.current = props.checked;
    }
  }, [props.checked]);

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=unchecked]:bg-slate-200",
        className
      )}
      onCheckedChange={handleCheckedChange}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch } 