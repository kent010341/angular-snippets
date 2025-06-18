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
 * Typical tri-state values for selection states.
 * - 'indeterminate': Some items are selected, but not all.
 * - 'all': All items are selected.
 * - 'none': No items are selected.
 */
export type TriState = 'indeterminate' | 'all' | 'none';

/**
 * Computes the tri-state selection status based on the provided items and selected items,
 * using a comparison function to determine item equality.
 * Optionally accepts a state mapper to transform the tri-state result.
 * 
 * @param allItems 
 * @param selectedItems 
 * @param compareFn 
 * @param stateMapper Mapper function to transform the tri-state result.
 *                    If not provided, the function will return the tri-state as is.
 * @returns 
 */
export function computeSelectionTriStateByCompare<T, R = TriState>(
    allItems: T[],
    selectedItems: T[],
    compareFn: (a: T, b: T) => boolean = (a, b) => a === b,
    stateMapper: (state: TriState) => R = (state) => state as R
): R {
    let hasSelected = false;
    let hasUnselected = false;

    for (const item of allItems) {
        const isSelected = selectedItems.some(selected => compareFn(item, selected));
        if (isSelected) {
            hasSelected = true;
        } else {
            hasUnselected = true;
        }
        if (hasSelected && hasUnselected) {
            return stateMapper('indeterminate');
        }
    }
    return hasSelected ? stateMapper('all') : stateMapper('none');
}

export function computeSelectionTriStateByKey<T, R = TriState>(
    allItems: T[],
    selectedItems: T[],
    keyExtractor: (item: T) => string | number,
    stateMapper?: (state: TriState) => R
): R;

export function computeSelectionTriStateByKey<T, R = TriState>(
    allItems: T[],
    selectedItems: T[],
    key: keyof T,
    stateMapper?: (state: TriState) => R
): R;

/**
 * Computes the tri-state selection status based on the provided items and selected items,
 * using a key or extractor function to determine item uniqueness.
 * Optionally accepts a state mapper to transform the tri-state result.
 * 
 * @param allItems 
 * @param selectedItems 
 * @param keyOrExtractor 
 * @param stateMapper Mapper function to transform the tri-state result.
 *                    If not provided, the function will return the tri-state as is.
 * @returns 
 */
export function computeSelectionTriStateByKey<T, R = TriState>(
    allItems: T[],
    selectedItems: T[],
    keyOrExtractor: ((item: T) => string | number) | keyof T,
    stateMapper: (state: TriState) => R = (state) => state as R
): R {
    const extractor: (item: T) => string | number =
        typeof keyOrExtractor === 'function'
            ? keyOrExtractor
            : (item: T) => item[keyOrExtractor] as string | number;

    const selectedKeys = new Set(selectedItems.map(extractor));

    let hasSelected = false;
    let hasUnselected = false;

    for (const item of allItems) {
        const key = extractor(item);
        if (selectedKeys.has(key)) {
            hasSelected = true;
        } else {
            hasUnselected = true;
        }
        if (hasSelected && hasUnselected) {
            return stateMapper('indeterminate');
        }
    }
    return hasSelected ? stateMapper('all') : stateMapper('none');
}
