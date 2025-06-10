/**
 * MIT License
 * 
 * Copyright (c) 2025 Kent010341
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Creates a numeric validator function that checks whether the value satisfies a given comparison operation.
 *
 * @param limit - The numeric limit to compare against.
 * @param op - The comparison operator: 
 *   - `'gt'` = greater than,
 *   - `'ge'` = greater than or equal to,
 *   - `'lt'` = less than,
 *   - `'le'` = less than or equal to,
 *   - `'eq'` = equal to.
 * @returns A `ValidatorFn` that validates the control's numeric value.
 *          Returns `null` if valid, or an error object if the value does not satisfy the condition.
 *
 * @example
 * ```ts
 * const control = new FormControl(10, numberValidator(5, 'gt')); // valid
 * const control = new FormControl(3, numberValidator(5, 'gt'));  // invalid
 * ```
 */
export function numberValidator(limit: number, op: 'gt' | 'ge' | 'lt' | 'le' | 'eq'): ValidatorFn {
    return (control: AbstractControl<number | null>): ValidationErrors | null => {
        const value = control.value;

        if (value == null) {
            return { nullInput: true };
        }

        let isValid = false;

        switch (op) {
            case 'gt':
                isValid = value > limit; 
                break;
            case 'ge':
                isValid = value >= limit; 
                break;
            case 'lt':
                isValid = value < limit; 
                break;
            case 'le':
                isValid = value <= limit; 
                break;
            case 'eq':
                isValid = value === limit; 
                break;
        }

        return isValid ? null : {
            numberValidator: {
                operator: op,
                expected: limit,
                actual: value
            }
        };
    };
}