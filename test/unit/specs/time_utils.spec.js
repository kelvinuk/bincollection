
import { convertDateFromCouncilUKTimeStr } from '@/utils/time_utils'

describe('time_utils.js', () => {
  it('should convert correct date time object', () => {
    const dateStr = "01/07/1997 00:00:00";
    let dateObj = convertDateFromCouncilUKTimeStr(dateStr);
    console.log(dateObj);
    expect(dateObj.getYear())
      .toEqual(97);
    expect(dateObj.getMonth()+1)
    .toEqual(7);
    expect(dateObj.getDate())
      .toEqual(1)
  })
})
