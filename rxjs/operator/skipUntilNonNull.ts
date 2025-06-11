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

import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Skips all values until the first non-null and non-undefined value is emitted.
 * After the first non-null value, all subsequent values are passed through.
 *
 * @returns OperatorFunction that delays emissions until a non-null value appears.
 */
export function skipUntilNonNull<T>(): OperatorFunction<T | null | undefined, T | null | undefined> {
    let hasEmitted = false;

    return source => source.pipe(
        filter(value => {
            if (hasEmitted) {
                return true;
            }
            if (value != null) {
                hasEmitted = true;
                return true;
            }
            return false;
        })
    );
}
