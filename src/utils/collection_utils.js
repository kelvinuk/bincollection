import { convertDateFromCouncilUKTimeStr } from './time_utils';

function filterBinCollectionsByTimeRange (collections, startDateTime, endDateTime) {
  if (collections === null) {
    return [];
  }

  console.log(collections);

  let data = collections.filter((collectionObj) => {
    // console.log(collectionObj.date);
    // or use moment(collectionObj.date, "DD/MM/YYYY")
    let d = convertDateFromCouncilUKTimeStr(collectionObj.date);
    // console.log(d);
    return d && d >= startDateTime && d < endDateTime;
  });

  console.log(data);

  return data;
}

export {
  filterBinCollectionsByTimeRange
}
