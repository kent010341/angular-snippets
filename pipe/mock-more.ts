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

/**
 * A pipe for generating excess mock data, primarily used for visual testing.
 *
 * This pipe is intended for temporary development purposes, such as verifying
 * layout behavior, scroll performance, and overflow handling in PrimeNG components.
 *
 * When the input array is small or empty, it will be duplicated or filled with dummy
 * objects until it exceeds a predefined mock size. This helps simulate large datasets
 * without requiring actual backend data.
 *
 * @template T The type of array items.
 */
@Pipe({
    name: 'mockMore'
})
export class MockMorePipe<T> implements PipeTransform {

    /** The number of items should be mocked. */
    private static readonly TARGET_SIZE = 100;

    /**
     * Expands the input array to exceed a target size.
     * - If the array is empty, fills with dummy objects (with optional field).
     * - If the array is smaller than the target size, repeatedly appends the original data.
     * - Returns the array as-is if already larger than the target size.
     *
     * Note: The final result may exceed the target size.
     *
     * @param value The original array.
     * @param field Optional field to populate with dummy string if the array is empty.
     * @returns The expanded mock array.
     */
    transform(value: T[], field?: keyof T): T[] {
        const currentLength = value.length;

        if (currentLength === 0) {
            return Array.from({ length: MockMorePipe.TARGET_SIZE }, (_, i) => {
                if (field) {
                    return { id: i, [field]: 'dummy'};
                }
                return {id: i};
            }) as T[];
        }
        
        if (currentLength < MockMorePipe.TARGET_SIZE) {
            const result = [...value];
            while (result.length < MockMorePipe.TARGET_SIZE) {
                result.push(...value);
            }
            return result;
        }

        return value;
    }

}
