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
 * Generates an array of numbers similar to Python's `range()`.
 * This is optimized for `range(stop)`, using `Array.from` for better performance,
 * while keeping `range(start, stop, step)` flexible via `for` loop.
 *
 * Equivalent to `for (let i = start; i < stop; i += step)`.
 *
 * Example usage:
 * ```
 * <div *ngFor="let i of (5 | range)">{{ i }}</div>   <!-- 0, 1, 2, 3, 4 -->
 * <div *ngFor="let i of (2 | range:5)">{{ i }}</div>  <!-- 2, 3, 4 -->
 * <div *ngFor="let i of (1 | range:10:2)">{{ i }}</div> <!-- 1, 3, 5, 7, 9 -->
 * <div *ngFor="let i of (10 | range:1:-2)">{{ i }}</div> <!-- 10, 8, 6, 4, 2 -->
 * ```
 */
@Pipe({
    name: 'range',
    standalone: true
})
export class RangePipe implements PipeTransform {

    // Overload signatures for better type inference
    transform(stop: number): number[];
    transform(start: number, stop: number): number[];
    transform(start: number, stop: number, step: number): number[];

    /**
     * Generates an array from `start` to `stop - 1`, incrementing by `step`.
     * Optimized for `range(stop)`, using `Array.from` for better performance.
     * If `step === 0`, an error is thrown to prevent infinite loops.
     */
    transform(startOrStop: number, stop?: number, step: number = 1): number[] {
        if (stop === undefined) {
            // Optimized case: range(stop) → use Array.from for better performance
            return Array.from({ length: startOrStop }, (_, i) => i);
        }

        // General case: range(start, stop, step)
        const start = startOrStop;
        if (step === 0) {
            throw new Error('Step cannot be zero');
        }

        const result: number[] = [];
        if (step > 0) {
            for (let i = start; i < stop; i += step) {
                result.push(i);
            }
        } else {
            for (let i = start; i > stop; i += step) {
                result.push(i);
            }
        }

        return result;
    }
}
