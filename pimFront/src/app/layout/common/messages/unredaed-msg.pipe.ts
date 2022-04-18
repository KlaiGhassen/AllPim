import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'unredaedMsg',
    pure: false,
})
export class UnredaedMsgPipe implements PipeTransform {
    cachedValue = null;
    cachedResult = 0;
    transform(value: any[], ...args: unknown[]): number {
        if (JSON.stringify(this.cachedValue) !== JSON.stringify(value)) {
            this.cachedValue = Array(...value);
            let count: any = 0;
            for (let element of value) {
                count += element.unreaded.count;
            }
            this.cachedResult = count;
        }
        return this.cachedResult;
    }
}
