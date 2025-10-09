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

import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe for generating excess mock data with safe nested mocks, primarily used for visual testing.
 *
 * This pipe is intended for **temporary development** purposes such as verifying layout stability,
 * scroll performance, and overflow handling in Angular or PrimeNG components.
 *
 * - When the input array is small or empty, it will be expanded or filled with dummy objects.
 * - When empty, specified mock fields will be populated with *safe mock proxies* created by `createMock()`.
 *   These proxies allow arbitrary nested property access without runtime errors.
 * - The final output ensures at least a minimum dataset size, useful for UI stress testing.
 *
 * Caution: Not intended for production. Should only be used in mock or visual testing environments.
 * 
 * ---
 * ### Example
 * 
 * ** 1. Fill an empty array with 100 mock items (default):**
 * ```html
 * @for (item of data | mockMore) {
 *     {{ item.id }}
 * }
 * ```
 * 
 * **2. Mock one field with a safe proxy:**
 * ```html
 * @for (item of data | mockMore: 'profile') {
 *     {{ item.profile.name.first }} – {{ item.profile.name.get() }}
 * }
 * ```
 * 
 * **3. Mock multiple fields with safe proxies:**
 * ```html
 * @for (item of data | mockMore: ['profile','address']) {
 *     {{ item.profile.name.first }} – {{ item.address.city }}
 * }
 * ```
 * 
 * **4. Custom target size and display token:**
 * ```html
 * @for (item of data | mockMore: ['foo','bar']:200:'dummy') {
 *     {{ item.id }} – {{ item.foo.bar.baz }} – {{ item.bar.value }}
 * }
 * ```
 *
 * @template T The type of array items.
 */
@Pipe({
    name: 'mockMore',
    standalone: true
})
export class MockMorePipe<T> implements PipeTransform {

    transform(
        value: T[],
        field?: keyof T,
        targetSize?: number,
        mockLabel?: string
    ): T[];

    transform(
        value: T[],
        fields?: (keyof T)[],
        targetSize?: number,
        mockLabel?: string
    ): T[];

    /**
     * Expands the input array to exceed a target size.
     *
     * Behavior:
     * - If the array is empty -> fills with dummy objects containing mock proxies for specified fields.
     * - If the array is smaller than the target size -> repeats the original data until it exceeds the target size.
     * - If already large enough -> returns the array unchanged.
     *
     * Note: The final result may exceed the target size slightly due to batch duplication.
     *
     * @param value The original array.
     * @param fieldsOrField One or more field keys to populate with mock proxies.
     * @param targetSize Minimum number of items to reach (default: 100).
     * @param mockLabel String used when a mock proxy is coerced to string or displayed (default: `'mock'`).
     * @returns The expanded array.
     */
    transform(
        value: T[],
        fieldsOrField?: (keyof T)[] | keyof T,
        targetSize: number = 100,
        mockLabel: string = 'mock'
    ): T[] {
        const currentLength = value.length;

        // Case 1: Empty array -> fill with dummy mock objects
        if (currentLength === 0) {
            const fields = Array.isArray(fieldsOrField)
                ? fieldsOrField
                : fieldsOrField ? [fieldsOrField] : [];

            return Array.from({ length: targetSize }, (_, i) => {
                const base: Record<string, any> = { id: i };
                
                if (fields && fields.length > 0) {
                    for (const f of fields) {
                        base[f as string] = createMock(mockLabel);
                    }
                }
                return base as T;
            });
        }

        // Case 2: Too small -> duplicate until exceeding target size
        if (currentLength < targetSize) {
            const result = [...value];
            while (result.length < targetSize) {
                result.push(...value);
            }
            return result;
        }
        
        // Case 3: Already sufficient
        return value;
    }

}

/**
 * Create a fully safe mock Proxy that:
 * - Never throws runtime errors on any property access or method call.
 * - Supports unlimited nesting (e.g. foo.bar.baz[0].id).
 * - Can be used safely in template bindings (e.g. Angular `{{foo.bar}}`).
 *
 * @template T The intended type being mocked (for TypeScript typing convenience).
 * @returns A Proxy that safely absorbs any operation without throwing.
 */
function createMock<T = any>(displayToken: string): T {

    const proxy: any = new Proxy(() => {}, {

        /*
         * Trap for property access, e.g., `myProxy.foo`, `myProxy[0]`, `myProxy['foo']`.
         * Always return the same proxy so that any depth of property access remains valid.
         */
        get: (_, prop) => {
            // `Symbol.toPrimitive` is triggered when converting to a primitive type,
            // e.g., string concatenation or template binding.
            if (prop === Symbol.toPrimitive) {
                return () => displayToken;
            }

            // return mock to allow infinite safe chaining
            return proxy;
        },

        /*
         * Trap for function calls, e.g., `myProxy()`.
         * Return the same proxy so chained calls like `myProxy().foo.bar()` stay valid.
         */
        apply: () => proxy,

        /*
         * Trap for `Object.keys(myProxy)` or `for...in`.
         * Returning an empty array prevents errors when enumerating.
         */
        ownKeys: () => [],

    });

    return proxy as unknown as T;
}
