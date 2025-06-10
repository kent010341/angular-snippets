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
 * Deeply update an object by merging it with a patch object.  
 * This function recursively updates the original object by applying 
 * changes from the patch object.
 *
 * Note: For shallow updates of plain objects, consider using
 * the spread operator (`{...originalObj, ...patchObj}`) for a 
 * more efficient and concise alternative.
 * 
 * @param originalObj The original object to be updated.
 * @param patchObj The patch object containing updates to be applied.
 * 
 * @returns The updated object with changes from the patch object.
 */
export function deepUpdate<T extends Record<string, any>>(originalObj: T, patchObj: Partial<T>): T {
    let updatedObj: T = { ...originalObj };

    for (const [key, patchValue] of Object.entries(patchObj)) {
        if (typeof patchValue === 'object' && patchValue != null) {
            updatedObj = { ...updatedObj, [key]: deepUpdate(updatedObj[key], patchValue) };
        } else {
            updatedObj = { ...updatedObj, [key]: patchValue };
        }
    }

    return updatedObj;
}
