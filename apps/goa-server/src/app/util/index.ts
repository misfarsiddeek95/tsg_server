// import moment from 'moment';
import moment from 'moment-timezone';

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
export const PAYMENT_RATE_ORDER = [
  'AVL',
  'SES_DE',
  'STAT_ALW',
  'SES_AD_SEC',
  'INC_PAY'
];

export const PAYMENT_RATE_ORDER_NEW = [
  'AVL_AFT',
  'AVL_EVE',
  'AVL_MID',
  'SES_DE',
  'STAT_ALW',
  'SES_AD_SEC',
  'INC_PAY'
];

export const CONTRY_ABBERVIATIONS = {
  Srilanka: 'TSG',
  India: 'TSG-IND'
};
export const LEAVE_MOVEMENTS = [
  'on-hold',
  'resign',
  'long-term',
  'termination',
  'no-show',
  'community',
  'suspension'
];

export const ONBORDING_MOVEMENTS = [
  'return-from-long',
  'return-from-temp',
  'released-from',
  'withdrawal-resignation'
];

export const TUTOR_STATUS_KEYWORDS = {
  'on-hold': 'On Hold',
  resign: 'Resined',
  'long-term': 'Long Term Leave',
  termination: 'Termination',
  'no-show': 'No Show',
  community: 'Community',
  'return-from-long': 'Active',
  'return-from-temp': 'Active',
  'released-from': 'Active',
  'withdrawal-resignation': 'Active',
  initial: 'Active'
};

export const LAST_WORKING_DAY_APPLICABLE_MOVEMENTS = [
  'on-notice',
  'resign',
  'termination'
];

export const EFFECTIVE_DAY_APPLICABLE_MOVEMENTS = [
  'no-show',
  'long-term',
  'community',
  'suspension'
];

export const getTutorWorkingCountry = (center) => {
  return center === 'TSG' ? 'Srilanka' : 'India';
};

export const CHANGE_REQUEST_STATUS = {
  Pending: 0,
  Rejected: 1,
  Actioned: 2,
  Cancelled: 3
};

export const getTheExactDate = (startDate, day) => {
  const days = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6
  };
  const date = moment(startDate)
    .startOf('isoWeek')
    .add(days[day], 'days')
    .format('YYYY/MM/DD');
  return date;
};

export const allArraysHaveValues = (...arrays: any[][]) => {
  return arrays.every((array) => array.length > 0);
};

export const getWeekDate = (field: string, date: any) => {
  const begin = moment(date).isoWeekday(1).startOf('week');
  switch (field) {
    case 'Monday':
      return begin.add(1, 'd').format('YYYY-MM-DD');
    case 'Tuesday':
      return begin.add(2, 'd').format('YYYY-MM-DD');
    case 'Wednesday':
      return begin.add(3, 'd').format('YYYY-MM-DD');
    case 'Thursday':
      return begin.add(4, 'd').format('YYYY-MM-DD');
    case 'Friday':
      return begin.add(5, 'd').format('YYYY-MM-DD');
    default:
      return date;
  }
};

export const getDatesOfAhead7Days = (startDate: string) => {
  const startMoment = moment(startDate).utc(false);
  const dates = {};

  for (let i = 0; i < WEEKDAYS.length; i++) {
    const weekday = WEEKDAYS[startMoment.day()];
    dates[weekday] = startMoment.format('YYYY/MM/DD');
    startMoment.add(1, 'day');
  }

  return dates;
};

export const getHourStatusCode = (GOATutorHourState) => {
  return GOATutorHourState[0] &&
    GOATutorHourState[0].GOATutorHourStateDetails[0]
    ? GOATutorHourState[0].GOATutorHourStateDetails[0].hour_state.name
    : '...';
};

export const groupAndSortTutorMovementsAndReturnActiveTutors = (
  details,
  movementTypesForFilter,
  excludeResign = false
) => {
  const groupedArray = details.reduce((result, currentItem) => {
    const tutorTspId = currentItem.tutorTspId;
    const date = new Date(currentItem.effectiveDate).getTime();

    let group = result.find((item) => item.tutorTspId === tutorTspId);

    if (!group) {
      group = {
        tutorTspId: parseInt(tutorTspId, 10),
        details: [],
        latestDate: date
      };
      result.push(group);
    }

    group.details.push(currentItem);

    if (date > group.latestDate) {
      group.latestDate = date;
    }

    return result;
  }, []);

  groupedArray.forEach((data) => {
    data.details.sort((a, b) => {
      const dateA = new Date(b.effectiveDate).getTime();
      const dateB = new Date(a.effectiveDate).getTime();

      if (dateA === dateB) {
        return b.id - a.id;
      }

      return dateA - dateB;
    });
  });

  if (excludeResign) {
    const selectedTutors = groupedArray
      .map((tutor) => tutor.details[0])
      .filter(
        (details) =>
          !movementTypesForFilter.slice(1, 7).includes(details.movementType)
      )
      .map((details) => details.tutorTspId);

    return selectedTutors;
  }

  return groupedArray.map((tutor) => tutor.tutorTspId);
};

export const activeTutorsForInvoicing = (lastMovements, movementsForRange) => {
  // Concatenate the arrays
  const mergedArray = lastMovements.concat(movementsForRange);
  // Group by tutorTspId
  const groupedByTutorTspId = mergedArray.reduce((acc, obj) => {
    const { tutorTspId } = obj;
    acc[tutorTspId] = acc[tutorTspId] || [];
    acc[tutorTspId].push(obj);
    return acc;
  }, {});

  // Convert the grouped result to an array
  const resultArray = Object.values(groupedByTutorTspId);

  const result = resultArray.reduce(
    (accumulator: number[], movement: any[]) => {
      const releaseMovementAvailable = movement.find((mov) =>
        ONBORDING_MOVEMENTS.includes(mov.movementType)
      );

      if (releaseMovementAvailable) {
        accumulator.push(releaseMovementAvailable.tutorTspId);
      }

      return accumulator;
    },
    []
  );

  return result;
};

export const getDatesExcludingWeekends = (startDate, endDate, noSessions) => {
  const dates = [];
  let currentDate = moment(startDate);
  const start = moment(startDate);
  const end = moment(endDate);

  // Get the working dates
  while (currentDate <= end) {
    const dayOfWeek = currentDate.day();
    if (dayOfWeek !== 6 && dayOfWeek !== 0) {
      if (
        !noSessions.some(
          (day) =>
            moment(day.effective_date).isSame(currentDate, 'day') &&
            (day.holidays_type_id === 2 || day.holidays_type_id === 8)
        )
      ) {
        dates.push({
          date: moment(currentDate).format('YYYY-MM-DD'),
          dayOfWeek: moment(currentDate).format('dddd'),
          satutaryDay: noSessions.some(
            (day) =>
              moment(day.effective_date).isSame(currentDate, 'day') &&
              day.holidays_type_id === 1
          )
        });
      }
    }
    currentDate = moment(currentDate).add(1, 'days');
  }

  // Initialize an array to store the weeks
  const weeks = [];
  // Clone the start date to avoid modifying the original date
  let currentWeekStartDate = moment(dates[0].date);

  // Iterate through the dates from start to end
  while (currentWeekStartDate.isSameOrBefore(endDate)) {
    // Calculate the end date of the current week (assuming weeks start on Sundays)
    const currentWeekEndDate = currentWeekStartDate.clone().endOf('week');

    // Add the current week to the 'weeks' array
    weeks.push({
      start: moment(currentWeekStartDate.clone())
        .utc(true)
        .format('YYYY-MM-DD'),
      end: moment(currentWeekEndDate.clone()).utc(true).format('YYYY-MM-DD')
    });

    // Move to the start of the next week
    currentWeekStartDate = currentWeekEndDate.clone().add(1, 'day');
  }

  return {
    workingDates: dates,
    weeks
  };
};

export const checkInvoiceCalculationEligibility = (tutorMovements, date) => {
  const effectiveDate = moment(date).utc(true).format('YYYY-MM-DD');
  //If there is no movment then tutor is eligible
  if (tutorMovements.length === 0) {
    return true;
  }

  const topMovement = tutorMovements[tutorMovements.length - 1];

  // Check any of onbording movments happen in the middle of the timeframe
  // If it is the case need to skip the calculation for that date
  if (ONBORDING_MOVEMENTS.includes(topMovement.movementType)) {
    const movmentEffectiveDate = moment(topMovement.effectiveDate)
      .utc(true)
      .format('YYYY-MM-DD');

    // If the effective date is less than the movement date
    if (movmentEffectiveDate > effectiveDate) {
      return false;
    }
  }

  // Get the movments for that day or less than that day
  const movementsForEffectiveDate = tutorMovements.filter(
    (move) =>
      moment(move.effectiveDate).utc(true).format('YYYY-MM-DD') <= effectiveDate
  );

  // If no movments are available then good to go with calculation
  if (movementsForEffectiveDate.length === 0) return true;

  // take the latest movment
  const movement = movementsForEffectiveDate[0];

  //If the latest movment is onbording movement then good to go with calculation
  if (ONBORDING_MOVEMENTS.includes(movement.movementType)) {
    return true;
  }

  //If not skip the calculation for that day
  return false;
};

export const getAvailabilityForTimeFrame = (
  availabilityOfTutors,
  tspId,
  date,
  slots
) => {
  const theDate = new Date(date.date);
  const dayOfWeek = date.dayOfWeek;

  // Filter slots that match the dayOfWeek and map their IDs
  const slotIds = slots
    .filter((s) => s.date.date === dayOfWeek)
    .map((s) => s.id);

  // Find availability for the given date range
  const availabilityForTimeFrame = availabilityOfTutors.find(
    (av) => new Date(av.startDate) <= theDate && new Date(av.endDate) >= theDate
  );

  if (!availabilityForTimeFrame) {
    return []; // No availability for the specified date range
  }

  // Filter tutorAvailability based on tspId
  const tutorAvailability = availabilityForTimeFrame.availabilibityCount.find(
    (av) => av.tsp_id === tspId
  );

  if (!tutorAvailability || !tutorAvailability.GOATutorSlotsDetails) {
    return []; // No tutor availability or slots details for the specified tspId
  }

  // Filter availabilityForDay based on slotIds
  const availabilityForDay = tutorAvailability.GOATutorSlotsDetails.filter(
    (a) => slotIds.includes(a.slot_id)
  );

  return availabilityForDay;
};

export const eligibilityForIncentives = (
  tutorsSessionsSwaps,
  tutorUPFR,
  tutorLateLaunches
) => {
  if (tutorsSessionsSwaps.length > 0) {
    return false;
  }

  if (tutorUPFR.length > 0) {
    return false;
  }

  if (tutorLateLaunches.length > 0) {
    return false;
  }

  return true;
};

export const getNextDayOfWeekFromDate = (
  inputDate: string,
  dayOfWeek: string
): string => {
  const inputMoment = moment(inputDate);
  const currentDayOfWeek = inputMoment.day();
  const targetDayOfWeek = moment().day(dayOfWeek).day(); // Get the target day of the week as a number
  const daysToAdd = (targetDayOfWeek + 7 - currentDayOfWeek) % 7;
  const nextDate = inputMoment.add(daysToAdd, 'days');
  return nextDate.format('YYYY-MM-DD');
};

export const getCountries = (countries: any) => {
  switch (countries) {
    case 'TSG-IND':
      return 'indian';
    case 'TSG':
      return 'srilankan';
    default:
      return 'srilankan';
  }
};

export const getDayOfWeek = (dateString: string) => {
  const date = moment(dateString, 'DD.MM.YYYY');
  return date.format('dddd'); // This will return the full name of the day
};

// export const convertSLTimeToUKTime = (slTime) => {
//   // Define the time zone for Sri Lanka and the UK
//   const SL_TIMEZONE = 'Asia/Colombo';
//   const UK_TIMEZONE = 'Europe/London';

//   // Get the current date and combine it with the input time
//   const currentDate = moment().format('YYYY-MM-DD');
//   const slDateTime = `${currentDate} ${slTime}`;

//   // Parse the combined date and time string as a moment object in Sri Lanka time
//   const slMoment = momentTimeZone.tz(slDateTime, SL_TIMEZONE);

//   // Convert the time to UK time
//   const ukMoment = slMoment.clone().tz(UK_TIMEZONE);

//   return ukMoment.format('HH:mm'); // Format the output as desired (HH:mm for just the time)
// };

export const excelToDate = (excelDate: number) => {
  // Excel's date system starts on 1900-01-01
  const startDate = moment('1900-01-01');
  // Excel counts 1900-01-01 as day 1
  const date = startDate.add(excelDate - 2, 'days').utc(true);
  return date.toDate();
};

export const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = moment(startDate);

  while (currentDate <= moment(endDate)) {
    dates.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'days');
  }

  return dates;
};

export const getDatesWithDays = (startDate, endDate) => {
  const dates = [];
  let currentDate = moment(startDate);

  while (currentDate <= moment(endDate)) {
    dates.push({
      day: currentDate.format('dddd'), // Get the day of the week
      date: currentDate.format('YYYY-MM-DD') // Get the date in YYYY-MM-DD format
    });
    currentDate = currentDate.add(1, 'days');
  }

  return dates;
};

export const adjustTime = (time, minutes) => {
  // Parse the time, allowing for 24-hour format or 12-hour format with AM/PM
  let parsedTime = moment(time, ['HH:mm', 'hh:mm A']);

  // Check if the time was parsed successfully
  if (!parsedTime.isValid()) {
    throw new Error('Invalid time format');
  }

  // Adjust the time by the given number of minutes
  parsedTime = parsedTime.add(minutes, 'minutes');

  // Return the adjusted time in both 24-hour and 12-hour formats
  return {
    '24-hour': parsedTime.format('HH:mm'),
    '12-hour': parsedTime.format('hh:mm A')
  };
};

export const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const convertToTimeString = (input: string | number) => {
  if (typeof input === 'number') {
    // Excel represents time as a fraction of a day. Convert it to milliseconds and format.
    const totalMinutes = Math.round(input * 24 * 60); // Total minutes in the day from the fraction
    const hours = Math.floor(totalMinutes / 60); // Extract hours
    const minutes = totalMinutes % 60; // Extract remaining minutes

    // Create a moment object for the time and format it as 'hh:mm A'
    const date = moment()
      .startOf('day')
      .add(hours, 'hours')
      .add(minutes, 'minutes');
    return date.format('hh:mm A');
  } else if (typeof input === 'string') {
    // If the input is already a string, parse it as a time.
    const date = moment(input, ['h:mm A', 'hh:mm A'], true);
    if (date.isValid()) {
      return date.format('hh:mm A');
    }
  }

  throw new Error('Invalid input format');
};

export const compareDateIsDateBefor = (date1, date2) => {
  return date1.isBefore(date2);
};

export const convertUKDateTimeToSLTime = (ukTime: string) => {
  // Define the UK and Sri Lanka time zones
  const ukTimeZone = 'Europe/London';
  const sriLankaTimeZone = 'Asia/Colombo';
  // Parse the UK time string to a moment object with the correct timezone
  const timeInUK = moment.tz(ukTime, 'YYYY-MM-DD HH:mm', ukTimeZone);
  // Convert to Sri Lanka time
  const timeInSriLanka = timeInUK.clone().tz(sriLankaTimeZone);

  //Format the result in 24-hour format
  return timeInSriLanka.format('HH:mm');
};

export const convertSLDateTimeToUKTime = (slTime: string) => {
  // Define the UK and Sri Lanka time zones
  const ukTimeZone = 'Europe/London';
  const sriLankaTimeZone = 'Asia/Colombo';

  // Parse the SL time string to a moment object with the SL timezone
  const timeInSL = moment.tz(slTime, 'YYYY-MM-DD HH:mm', sriLankaTimeZone);

  // Convert to UK time
  const timeInUK = timeInSL.clone().tz(ukTimeZone);

  // Format the result with both date and 24-hour time format
  return timeInUK.format('HH:mm');
};
export const convertSLDateTimeToUKTimeSchoolStartTime = (slTime) => {
  // Define the UK and Sri Lanka time zones
  const ukTimeZone = 'Europe/London';
  const sriLankaTimeZone = 'Asia/Colombo';

  // Parse the SL time string to a moment object with the SL timezone
  const timeInSL = moment.tz(slTime, 'YYYY-MM-DD HH:mm', sriLankaTimeZone);

  // Convert the time to the UK time zone
  let timeInUK = timeInSL.clone().tz(ukTimeZone);

  // Check if the converted UK time is in BST
  const isBST = timeInUK.isDST();

  // Adjust the UK time by subtracting or adding 1 hour
  if (isBST) {
    timeInUK = timeInUK.subtract(1, 'hour');
  } else {
    timeInUK = timeInUK.add(1, 'hour');
  }

  // Format the result with both date and 24-hour time format
  return timeInUK.format('HH:mm');
  // return timeInUK.format('YYYY-MM-DD HH:mm');
};

export const convertSLTimeToUKTime = (slTime) => {
  // Define the UK and Sri Lanka time zones
  const ukTimeZone = 'Europe/London';
  const sriLankaTimeZone = 'Asia/Colombo';

  // Parse the SL time string to a moment object with the SL timezone
  const timeInSL = moment.tz(slTime, 'HH:mm', sriLankaTimeZone);

  // Convert to UK time
  const timeInUK = timeInSL.clone().tz(ukTimeZone);

  // Format the result with both date and 24-hour time format
  return timeInUK.format('HH:mm');
};

export const convertUKTimeToSLTime = (ukTime: string) => {
  // Define the UK and Sri Lanka time zones
  const ukTimeZone = 'Europe/London';
  const sriLankaTimeZone = 'Asia/Colombo';
  // Parse the UK time string to a moment object with the correct timezone
  const timeInUK = moment.tz(ukTime, 'HH:mm', ukTimeZone); // when only converting time, defult date is 2001-01-01 which is not in the DST, it's mean +5.30
  // Convert to Sri Lanka time
  const timeInSriLanka = timeInUK.clone().tz(sriLankaTimeZone);

  //Format the result in 24-hour format
  return timeInSriLanka.format('HH:mm');
};

// export const convertUKDateTimeToSLTimeSchoolStartTime = (ukTime: string) => {
//   // Define the UK and Sri Lanka time zones
//   const ukTimeZone = 'Europe/London';
//   const sriLankaTimeZone = 'Asia/Colombo';

//   // Parse the UK time string to a moment object with the UK timezone
//   let timeInUK = moment.tz(ukTime, 'YYYY-MM-DD HH:mm', ukTimeZone);

//   // Check if the given UK time is in BST
//   const isBST = timeInUK.isDST();

//   // Adjust the UK time by adding or subtracting 1 hour before conversion to SL
//   if (isBST) {
//     timeInUK = timeInUK.add(1, 'hour');
//   } else {
//     timeInUK = timeInUK.subtract(1, 'hour');
//   }

//   // Convert the adjusted UK time to Sri Lanka time
//   const timeInSL = timeInUK.clone().tz(sriLankaTimeZone);

//   // Format the result with both date and 24-hour time format
//   return timeInSL.format('HH:mm');
//   // return timeInSL.format('YYYY-MM-DD HH:mm');
// };

export const getExactDateFromStartingDay = (startDate, targetWeekday) => {
  // Parse the start date as a Moment object
  const startMoment = moment(startDate, 'YYYY-MM-DD');

  // Create an array to map weekdays
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  // Find the index of the target weekday and the start date weekday
  const startDayIndex = startMoment.day();
  const targetDayIndex = weekdays.indexOf(targetWeekday);

  if (targetDayIndex === -1) {
    throw new Error('Invalid weekday name');
  }

  // Calculate the difference in days between the start date and target weekday
  const dayDifference = targetDayIndex - startDayIndex;

  // Calculate the target date by adding the day difference to the start date
  const targetDate = startMoment.clone().add(dayDifference, 'days');

  // Format the result in "YYYY-MM-DD" format
  return targetDate.format('YYYY-MM-DD');
};

export const getWeekStartAndEnd = (date) => {
  // Parse the input date
  const givenDate = moment(date, 'YYYY-MM-DD');

  // Set the start of the week to Monday
  const startOfWeek = givenDate.clone().startOf('week').add(1, 'day'); // Monday

  // Set the end of the week to Friday
  const endOfWeek = startOfWeek.clone().add(4, 'days'); // Friday

  // Format the dates
  return {
    startOfWeek: startOfWeek.format('YYYY-MM-DD'),
    endOfWeek: endOfWeek.format('YYYY-MM-DD')
  };
};
