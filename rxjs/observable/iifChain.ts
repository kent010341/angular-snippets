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

import { Observable, defer, isObservable, of } from 'rxjs';

/**
 * A builder for creating an Observable that conditionally emits based on multiple predicates,
 * similar to Excel's IFS or a switch-case pattern with a fallback.
 *
 * Example:
 * ```ts
 * const observable$ = iifChain<string>()
 *   .case(() => age > 60, 'Senior')
 *   .case(() => age >= 18, 'Adult')
 *   .else('Minor')
 *   .build();
 * ```
 *
 * Each condition is evaluated at subscription time.
 *
 * @template T The value type emitted by the resulting Observable.
 */
class IifChainBuilder<T> {
    private cases: { condition: () => boolean; result: T | Observable<T> }[] = [];
    private elseCase: T | Observable<T> | null = null;

    /**
     * Adds a conditional case to the chain.
     *
     * If the provided condition function returns `true` at subscription time,
     * the associated result will be emitted (or flattened if it's an Observable).
     *
     * @param condition A function returning a boolean, evaluated at subscription time.
     * @param result A value or Observable to be returned if the condition is true.
     * @returns This builder instance for method chaining.
     */
    case(condition: () => boolean, result: T | Observable<T>): this {
        this.cases.push({ condition, result });
        return this;
    }

    /**
     * Sets the fallback result to be emitted when none of the conditions match.
     *
     * If no `else` is specified and no condition matches, an error will be thrown upon subscription.
     *
     * @param result A value or Observable to return if no conditions are matched.
     * @returns This builder instance for method chaining.
     */
    else(result: T | Observable<T>): this {
        this.elseCase = result;
        return this;
    }

    /**
     * Constructs the final Observable from the defined conditions and fallback.
     *
     * At the moment of subscription, conditions are evaluated in order and the first matching result is emitted.
     * If none match and no `else` is provided, the Observable errors.
     *
     * @returns An Observable emitting the selected result based on the conditions.
     */
    build(): Observable<T> {
        return defer(() => {
            for (const { condition, result } of this.cases) {
                if (condition()) {
                    return this.toObservable(result);
                }
            }
            if (this.elseCase !== null) {
                return this.toObservable(this.elseCase);
            }
            throw new Error('No condition matched and no else case provided.');
        });
    }

    /**
     * Ensures the result is returned as an Observable.
     *
     * @param value A value or Observable.
     * @returns The value wrapped in an Observable if it's not already one.
     */
    private toObservable(value: T | Observable<T>): Observable<T> {
        return isObservable(value) ? value : of(value);
    }
}

/**
 * Factory function to create an `IifChainBuilder` instance.
 *
 * Allows chaining of `.case()` and `.else()` methods to define a conditional Observable chain.
 *
 * @template T The value type emitted by the resulting Observable.
 * @returns A new instance of `IifChainBuilder<T>`.
 */
export function iifChain<T>(): IifChainBuilder<T> {
    return new IifChainBuilder<T>();
}
