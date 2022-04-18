import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({
  name: 'latestMessageDate',
})
export class LatestMessageDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!moment.isMoment(value)) {
      let date = moment(value);
      if (date.isSame(moment(), 'day')) {
        return date.format('hh:mm a');
      } else if (date.isSame(moment().subtract(1, 'd'), 'day')) {
        return 'Yesterday';
      } else if (date.isSame(moment(), 'week')) {
        return date.format('dddd');
      } else {
        return date.format('DD/MM/YYYY');
      }
    } else {
      return 'unknown';
    }
  }
}
