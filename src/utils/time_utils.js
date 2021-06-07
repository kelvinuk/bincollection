function convertDateFromCouncilUKTimeStr (dateStr) {
  try {
    // Uk Time Format DDMMYYYY

    let bases = dateStr.split(" ");
    let parts = bases[0].split('/');
    let month = parts[1] - 1 // month is 0-based
    // console.log("Year: " + parts[2] + " Month: " + month, " Date: " + parts[0]);
    return new Date(parts[2], month, parts[0]);
  } catch (error) {
    console.log(error);
    return null;
  }
}

function getDateRange (numWeeks = 1) {
  let fromDateTime = new Date();
  let toDateTime = new Date();
  fromDateTime.setDate(fromDateTime.getDate());
  toDateTime.setDate(toDateTime.getDate() + numWeeks * 7);
  console.log("From: " + fromDateTime + " To: " + toDateTime);
  return { startDateTime: fromDateTime, endDateTime: toDateTime };
}

export {
  convertDateFromCouncilUKTimeStr,
  getDateRange
}
