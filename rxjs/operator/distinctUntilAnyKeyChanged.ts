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

import { distinctUntilChanged, MonoTypeOperatorFunction } from 'rxjs';

/**
 * Emits the value only when any of the specified object keys change.
 * Performs a shallow comparison of the specified keys. If no keys are provided,
 * all keys from both previous and current values are used for comparison.
 *
 * @param keys - The keys of the object to monitor for changes. If none provided, uses all keys to compare.
 * @returns A {@link MonoTypeOperatorFunction} that filters out consecutive duplicate objects based on the specified keys.
 *
 * @example
 * ```typescript
 * distinctUntilAnyKeyChanged('a', 'b') // emits only when 'a' or 'b' has changed
 * ```
 */
export function distinctUntilAnyKeyChanged<T, K extends keyof T>(...keys: K[]): MonoTypeOperatorFunction<T> {
    return distinctUntilChanged((prev, curr) => {
        if (!prev || !curr) return prev === curr;

        const compareKeys: K[] = keys.length > 0
            ? keys
            : Array.from(new Set([...Object.keys(prev), ...Object.keys(curr)])) as K[];

        return compareKeys.every(key => prev[key] === curr[key]);
    });
}
