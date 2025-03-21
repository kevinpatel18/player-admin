// const baseUrl =
// "https://fd8a6942-2a37-4632-8c05-bd8874f009d9.e1-us-east-azure.choreoapps.dev/";
// const baseUrl = "http://localhost:8080/";
const baseUrl = "https://pllayer-backend-68514470993.us-central1.run.app/";

export const getAllSportDetails = async () => {
  const data = await fetch(`${baseUrl}sports`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};

export const getAmenitiesDetails = async () => {
  const data = await fetch(`${baseUrl}amenities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};

export const getLocationDetails = async () => {
  const data = await fetch(`${baseUrl}locations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};
export const getAreaDetails = async (formData) => {
  const data = await fetch(
    `${baseUrl}areas?locationId=${formData?.locationId || ""}&locationName=${
      formData.locationName || ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const _data = await data.json();
  return _data;
};

export const storeVenue = async (formData) => {
  const data = await fetch(`${baseUrl}storevenue`, {
    method: "POST",
    headers: {
      // 'Content-Type': 'multipart/form-data'
    },
    body: formData,
  });
  const _data = await data.json();
  return _data;
};

export const getAllVenue = async (formData) => {
  if (formData.limit) {
    let api = formData?.userid
      ? `${baseUrl}venues?userId=${formData?.userid || ""}&location=${
          formData?.location || ""
        }&page=${formData?.offset}&page_size=${formData?.limit}&areaName=${
          formData?.areaName || ""
        }&phoneNumber=${formData?.phoneNumber || ""}&name=${
          formData?.name || ""
        }`
      : `${baseUrl}venues?location=${formData?.location || ""}&page=${
          formData?.offset
        }&page_size=${formData?.limit}&areaName=${
          formData?.areaName || ""
        }&phoneNumber=${formData?.phoneNumber || ""}&name=${
          formData?.name || ""
        }`;

    const data = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const _data = await data.json();
    return _data;
  } else {
    let api = formData?.userid
      ? `${baseUrl}venues?userId=${formData?.userid || ""}&location=${
          formData?.location || ""
        }&areaName=${formData?.areaName || ""}`
      : `${baseUrl}venues?location=${formData?.location || ""}&areaName=${
          formData?.areaName || ""
        }`;

    const data = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const _data = await data.json();
    return _data;
  }
};

export const storeSlots = async (formData) => {
  const data = await fetch(`${baseUrl}storeslot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};

export const updateSlots = async (formData) => {
  const data = await fetch(`${baseUrl}updateslot`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};

export const getAllBookingSlots = async (formData) => {
  const data = await fetch(
    `${baseUrl}allbookingslot?venue_id=${formData?.venueId}&venue_court_id=${formData?.venueCourtId}&sport_id=${formData?.sportId}&from_date=${formData?.fromDate}&to_date=${formData?.toDate}&admin=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const _data = await data.json();
  return _data;
};

export const updateSlotDetails = async (formData, id) => {
  const data = await fetch(`${baseUrl}updateslotdetails/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};

export const storeBookingSlots = async (formData) => {
  const data = await fetch(`${baseUrl}bookingslot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};

export const updatePartialBookingSlots = async (formData) => {
  const data = await fetch(`${baseUrl}updatePartialPayment`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};
export const updateCancelBooking = async (formData) => {
  const data = await fetch(`${baseUrl}cancelBooking`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};

export const getAllUserReport = async (formData) => {
  let url = formData?.userid
    ? `${baseUrl}manageUser/${formData?.userid}?page=${
        formData?.offset
      }&page_size=${formData?.limit}&name=${formData?.name || ""}&phoneNumber=${
        formData?.phoneNumber || ""
      }`
    : `${baseUrl}userReport?page=${formData?.offset}&page_size=${
        formData?.limit
      }&venueOwnerId=${formData?.userid}&name=${
        formData?.name || ""
      }&phoneNumber=${formData?.phoneNumber || ""}`;
  const data = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};

export const getAllRevenueAnalysisReport = async (formData) => {
  let api = formData?.userid
    ? `${baseUrl}bookingVenueReport?page=${formData?.offset}&page_size=${
        formData?.limit
      }&from_date=${formData?.fromDate}&to_date=${
        formData?.toDate
      }&venueOwnerId=${formData?.userid || ""}&locationId=${
        formData?.locationId || ""
      }&venueSportId=${formData?.venueSportId || ""}&venueId=${
        formData?.venueId || ""
      }&courtId=${formData?.courtId || ""} `
    : `${baseUrl}bookingVenueReport?page=${formData?.offset}&page_size=${
        formData?.limit
      }&from_date=${formData?.fromDate}&to_date=${
        formData?.toDate
      }&locationId=${formData?.locationId || ""}&venueSportId=${
        formData?.venueSportId || ""
      }&venueId=${formData?.venueId || ""}&courtId=${formData?.courtId || ""}`;

  const data = await fetch(api, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};

export const getAllSettlementReport = async (formData) => {
  let api = formData?.userid
    ? `${baseUrl}transactionSettlementList?page=${formData?.offset}&page_size=${
        formData?.limit
      }&from_date=${formData?.fromDate}&to_date=${
        formData?.toDate
      }&venueOwnerId=${formData?.userid || ""} `
    : `${baseUrl}transactionSettlementList?page=${formData?.offset}&page_size=${formData?.limit}&from_date=${formData?.fromDate}&to_date=${formData?.toDate}`;

  const data = await fetch(api, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};
export const getAllRefundsReport = async (formData) => {
  let api = formData?.userid
    ? `${baseUrl}transactionRefundsList?page=${formData?.offset}&page_size=${
        formData?.limit
      }&from_date=${formData?.fromDate}&to_date=${
        formData?.toDate
      }&venueOwnerId=${formData?.userid || ""} `
    : `${baseUrl}transactionRefundsList?page=${formData?.offset}&page_size=${formData?.limit}&from_date=${formData?.fromDate}&to_date=${formData?.toDate}`;

  const data = await fetch(api, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};

export const getAllCancelBookingReport = async (formData) => {
  console.log("formData: ", formData);
  let api = formData?.userid
    ? `${baseUrl}cancelBookingReport?page=${formData?.offset}&page_size=${
        formData?.limit
      }&from_date=${formData?.fromDate}&to_date=${
        formData?.toDate
      }&venueOwnerId=${formData.userid || ""}&locationId=${
        formData?.locationId || ""
      }&venueSportId=${formData?.venueSportId || ""}&venueId=${
        formData?.venueId || ""
      }&courtId=${formData?.courtId || ""} `
    : `${baseUrl}cancelBookingReport?page=${formData?.offset}&page_size=${
        formData?.limit
      }&from_date=${formData?.fromDate}&to_date=${
        formData?.toDate
      }&locationId=${formData?.locationId || ""}&venueSportId=${
        formData?.venueSportId || ""
      }&venueId=${formData?.venueId || ""}&courtId=${formData?.courtId || ""} `;

  const data = await fetch(api, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};

export const getAllVenueBookingReport = async (formData) => {
  let api = formData.userid
    ? `${baseUrl}venueBookingReport?page=${formData?.offset}&page_size=${
        formData?.limit
      }&from_date=${formData?.fromDate}&to_date=${
        formData?.toDate
      }&venueOwnerId=${formData?.userid || ""} `
    : `${baseUrl}venueBookingReport?page=${formData?.offset}&page_size=${
        formData?.limit
      }&from_date=${formData?.fromDate}&to_date=${formData?.toDate}&venueId=${
        formData?.venueId || ""
      }&venueCourtId=${formData?.courtId || ""}&sportId=${
        formData?.sportId || ""
      }`;

  const data = await fetch(api, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};

export const loginApi = async (formData) => {
  const data = await fetch(`${baseUrl}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};
export const UpdatePaymentStatus = async (formData) => {
  const data = await fetch(`${baseUrl}updateBookingStatus`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};
export const UpdateCancelBookingVenueStatus = async (formData) => {
  const data = await fetch(`${baseUrl}updateCancelBookingStatus`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};
export const venueSlotDetails = async (formData) => {
  const data = await fetch(`${baseUrl}venuesdetailbyvenue/${formData}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};
export const getAllSlotByVenueCourtId = async (formData) => {
  const data = await fetch(
    `${baseUrl}slotByVenueCourtId?venueCourtId=${
      formData?.venueCourtId || ""
    }&days=${formData?.days || ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const _data = await data.json();
  return _data;
};

export const updateVenueDetails = async (formData, venueId) => {
  const data = await fetch(`${baseUrl}updateVenueDetails/${venueId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};
export const updateTransactionRefundStatus = async (formData) => {
  const data = await fetch(`${baseUrl}updateTransactionRefundStatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const _data = await data.json();
  return _data;
};

export const getAllRating = async (formData) => {
  let url = formData?.userid
    ? `${baseUrl}rating?page=${formData?.offset}&page_size=${
        formData?.limit
      }&venueOwnerId=${formData?.userid}&name=${
        formData?.name || ""
      }&phoneNumber=${formData?.phoneNumber || ""}`
    : `${baseUrl}rating?page=${formData?.offset}&page_size=${
        formData?.limit
      }&name=${formData?.name || ""}&phoneNumber=${
        formData?.phoneNumber || ""
      }`;
  const data = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const _data = await data.json();
  return _data;
};
