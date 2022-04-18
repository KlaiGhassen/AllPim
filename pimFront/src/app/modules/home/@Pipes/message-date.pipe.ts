import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({
  name: 'messageDate',
})
export class MessageDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!moment.isMoment(value)) {
      let date = moment(value);
      if (date.isSame(moment(), 'day')) {
        return date.format('hh:mm a');
      } else if (date.isSame(moment().subtract(1, 'd'), 'day')) {
        return 'Yesterday, ' + date.format('hh:mm a');
      } else if (date.isSame(moment(), 'week')) {
        return date.format('dddd, hh:mm a');
      } else {
        return date.format('DD/MM/YYYY, hh:mm a');
      }
    } else {
      return 'unknown';
    }
  }
}
