import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import { Table } from "reactstrap";
import { format, parse, isBefore } from "date-fns";
import { Settings2 } from "lucide-react";
import RecordNotFoundImage from "../../assets/Images/Record-Not-Found.png";
import MaskGroup from "../../assets/Images/Mask-group.png";

const WeekDayView = ({
  selectedCourt,
  setloading,
  updateSelectedCourt,
  addDays,
  selectedSport,
  startDate,
  isToday,
  handleEditSlotTiming,
  timeSlots,
  allBookingDetails,
  handleOpenModal,
}) => {
  return (
    <>
      <div
        className="border-1 border-slate-300 border-bottom-none bg-white"
        style={{ borderRadius: "8px 8px 0px 0px" }}
      >
        <Box
          sx={{
            flexGrow: 1,

            borderRadius: "8px 8px 0px 0px",
            paddingLeft: 2,
          }}
        >
          <Tabs
            value={selectedCourt}
            onChange={(event, newValue) => {
              setloading(true);
              updateSelectedCourt(newValue);
            }}
            style={{ overflow: "auto" }}
            scrollButtons
            allowScrollButtonsMobile
            className="custom-court"
            aria-label=" scrollable force tabs example"
          >
            {selectedSport?.courts?.map((court, i) => (
              <Tab
                label={court?.courtname}
                value={court?.venuecourtid}
                key={i}
              />
            ))}
          </Tabs>
        </Box>
      </div>

      <div
        className="cal-table table-responsive"
        style={{ maxHeight: "calc( 100vh - 230px)" }}
      >
        {" "}
        <Table
          id="table-calendar"
          className=" rounded-lg  w-full custom-table  p-4"
        >
          <thead className="sticky " style={{ top: 0 }}>
            <tr className="bg-white">
              <th
                className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-10 border-1 border-slate-300"
                style={{
                  backgroundColor: "#ffffff",
                  zIndex: 999,
                  width: 100,
                }}
              >
                Time
              </th>
              {[...Array(7)].map((_, index) => {
                const date = addDays(startDate, index);

                const isCurrentDate = isToday(date); // check if the date is today

                return (
                  <th
                    key={index}
                    style={{
                      borderTop: isCurrentDate && "4px solid #0044CA",
                      backgroundColor: isCurrentDate ? "white" : "",
                      minWidth: 100,
                    }}
                    className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-1 border-slate-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 16,
                            color: "black",
                          }}
                        >
                          {format(date, "dd")}
                        </div>
                        <div>{format(date, "EE").toUpperCase()}</div>
                      </div>
                      <div
                        style={{
                          background: "black",
                          padding: 5,
                          borderRadius: 6,
                        }}
                      >
                        <Settings2
                          onClick={() => {
                            handleEditSlotTiming(format(date, "EEEE"));
                          }}
                          className="cursor-pointer text-white"
                          size={18}
                        />
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {timeSlots?.length <= 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center justify-center p-4 md:p-10 w-full">
                    <img
                      src={RecordNotFoundImage}
                      className="h-48 w-64 md:h-64 md:w-80 object-contain"
                      alt="No records found"
                    />
                    <p className="text-lg md:text-2xl font-semibold text-[#012e53] mt-3 text-center">
                      No Time Slots Found.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              timeSlots.map((slot, slotIndex) => (
                <tr
                  key={slot}
                  className={`border-1 border-slate-300 ${
                    slotIndex % 2 === 0 ? "bg-white" : "bg-white"
                  }`}
                >
                  <td
                    className="py-2 px-3  text-sm text-gray-500 sticky left-0 z-10 border-r-1 border-slate-300"
                    style={{
                      backgroundColor: "white",
                      zIndex: 999,
                      width: 100,
                      minWidth: 100,
                    }}
                  >
                    {slot}
                  </td>
                  {[...Array(7)].map((_, dayIndex) => {
                    const date = addDays(startDate, dayIndex);

                    const slotDateTime = parse(
                      `${format(date, "yyyy-MM-dd")} ${slot}`,
                      "yyyy-MM-dd HH:mm",
                      new Date()
                    );

                    const isPastTimeSlot = isBefore(slotDateTime, new Date());

                    const isBooked = allBookingDetails?.bookingSlots?.find(
                      (booking) => {
                        if (
                          booking.date === format(date, "yyyy-MM-dd") &&
                          booking.startTime === slot
                        ) {
                          return booking;
                        } else {
                          return false;
                        }
                      }
                    );

                    return (
                      <td
                        style={{
                          minWidth: 150,

                          cursor: !isBooked?.isavailable
                            ? "not-allowed"
                            : "pointer",
                        }}
                        onClick={() => {
                          if (!isPastTimeSlot) {
                            handleOpenModal(slot, dayIndex, isBooked);
                          } else {
                            handleOpenModal(slot, dayIndex, isBooked, true);
                          }
                        }}
                        key={dayIndex}
                        className="py-2 px-3 text-center border-r-1 border-slate-300"
                      >
                        {isBooked?.isBooked && !isBooked?.ispartialpayment ? (
                          <div
                            className={`flex items-center h-12 bg-green-50 rounded-md overflow-hidden max-w-xs`}
                          >
                            <div className="w-2 h-12 bg-green-600"></div>
                            <div className="px-2 text-start">
                              <p className={`text-sm font-bold text-gray-800`}>
                                {isBooked?.price && `₹ ${isBooked?.price}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {isBooked?.startTime} - {isBooked?.endTime}
                              </p>
                            </div>
                          </div>
                        ) : isBooked?.isBooked && isBooked?.ispartialpayment ? (
                          <div
                            className={`flex items-center h-12 bg-orange-50 rounded-md overflow-hidden max-w-xs`}
                          >
                            <div className="w-2 h-12 bg-orange-600"></div>
                            <div className="px-2 text-start">
                              <p className={`text-sm font-bold text-gray-800`}>
                                {isBooked?.price && `₹ ${isBooked?.price}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {isBooked?.startTime} - {isBooked?.endTime}
                              </p>
                            </div>
                          </div>
                        ) : !isBooked?.isavailable || isPastTimeSlot ? (
                          <div
                            style={{
                              backgroundImage: `url(${MaskGroup})`,
                            }}
                            className={`flex items-center h-12 bg-slate-50 rounded-md overflow-hidden max-w-xs`}
                          >
                            {/* <div className="w-2 h-12 bg-slate-600"></div> */}
                            <div className="px-2 text-start">
                              <p className={`text-sm font-bold text-gray-800`}>
                                {isBooked?.price && `₹ ${isBooked?.price}`}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`flex items-center h-12  rounded-md overflow-hidden max-w-xs`}
                          >
                            <div className="px-2 text-start">
                              <p
                                className={`text-sm font-normal text-gray-800`}
                              >
                                {isBooked?.price && `₹ ${isBooked?.price}`}
                              </p>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default WeekDayView;
