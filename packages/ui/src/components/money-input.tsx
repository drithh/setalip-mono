'use client';

import React, { useReducer, useState } from 'react';
import { Input, InputProps } from '#dep/components/ui/input';
import { cn } from '#dep/lib/utils';
import { moneyFormatter } from '@repo/shared/util';

const MoneyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const initialValue = props.value
      ? moneyFormatter.format(parseInt(props.value as string, 10))
      : '';

    const [value, setValue] = useReducer((_: any, next: string) => {
      const digits = next.replace(/\D/g, '');
      return moneyFormatter.format(Number(digits) / 100);
    }, initialValue);

    function handleChange(
      realChangeFn: Function | undefined,
      formattedValue: string
    ) {
      const digits = formattedValue.replace(/\D/g, '');
      const realValue = Number(digits) / 100;
      if (realChangeFn) {
        realChangeFn(realValue);
      }
    }
    return (
      <div className="relative">
        <Input type="hidden" name={props.name} value={props.value} />
        <Input
          type="text"
          className={cn('', className)}
          ref={ref}
          onChange={(ev) => {
            setValue(ev.target.value);
            handleChange(props.onChange, ev.target.value);
          }}
          value={value}
        />
      </div>
    );
  }
);
MoneyInput.displayName = 'MoneyInput';

export { MoneyInput };
