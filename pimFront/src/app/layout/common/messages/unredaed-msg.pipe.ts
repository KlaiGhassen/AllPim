import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unredaedMsg'
})
export class UnredaedMsgPipe implements PipeTransform {
  transform(value: any[], ...args: unknown[]): number {
    console.log("value",value);
let count : any=0;
for(let element of value) {
  count+=element.unreaded.count;
}
    return count;
  }

}
