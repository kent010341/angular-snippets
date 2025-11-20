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

import { Directive, output, signal } from '@angular/core';

/**
 * A directive that detects pure clicks by distinguishing between click and drag operations.
 * Emits a click event only when the pointer hasn't moved beyond the threshold during the pointer interaction.
 * 
 * @example
 * ```html
 * <div (pureClick)="handlePureClick($event)">Click me</div>
 * ```
 */
@Directive({
    selector: '[pureClick]',
    host: {
        '(pointerdown)': 'onPointerDown($event)',
        '(pointermove)': 'onPorinterMove($event)',
        '(pointerup)': 'onPointerUp($event)' 
    }
})
export class PureClickDirective {

    /**
     * The movement threshold in pixels. If the pointer moves more than this distance,
     * the interaction is considered a drag rather than a click.
     * Default value is 4 pixels.
     */
    readonly threshold = signal(4);

    /**
     * Output event that emits when a pure click is detected (pointer up without significant movement).
     */
    readonly pureClick = output<PointerEvent>();

    /**
     * The X coordinate where the pointer down event started.
     */
    private startX: number = 0;

    /**
     * The Y coordinate where the pointer down event started.
     */
    private startY: number = 0

    /**
     * Flag indicating whether the pointer has moved beyond the threshold.
     */
    private readonly moved = signal(false);

    /**
     * Handles the pointer down event, recording the starting position.
     * @param event - The pointer down event
     */
    onPointerDown(event: PointerEvent): void {
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.moved.set(false);
    }

    /**
     * Handles the pointer move event, checking if the movement exceeds the threshold.
     * @param event - The pointer move event
     */
    onPorinterMove(event: PointerEvent): void {
        if (this.moved()) {
            return;
        }

        const dx = Math.abs(event.clientX - this.startX);
        const dy = Math.abs(event.clientY - this.startY);

        if (dx > this.threshold() || dy > this.threshold()) {
            this.moved.set(true);
        }
    }

    /**
     * Handles the pointer up event, emitting the pureClick event if no significant movement occurred.
     * @param event - The pointer up event
     */
    onPointerUp(event: PointerEvent): void {
        if (!this.moved()) {
            this.pureClick.emit(event);
        }
    }

}
