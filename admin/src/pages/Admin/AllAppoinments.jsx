import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppoinments = () => {
  const {
    aToken,
    appoinments,
    getAllAppoinments,
    cancelAppoinment,
    confirmAppoinment,
  } = useContext(AdminContext);
  const { calulateAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    getAllAppoinments()
      .then((data) => {
        //console.log('Fetched Appointments:', data);
        // If necessary, update state or do other actions here
      })
      .catch((error) => console.error("Error fetching appointments:", error));
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl ">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm min-h-[60vh] max-h-[80vh] overflow-y-scroll">
        {/* Header row */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b font-semibold text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* Data rows */}
        {appoinments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-100"
          >
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={item.userdata.image}
                alt="patient"
              />
              <p>{item.userdata.name}</p>
            </div>

            <p className="max-sm:hidden">{item.age}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>{item.name}</p>
            <p>₹{item.fees}</p>

            {/* Actions (e.g., cancel, details) */}
            <div className="flex flex-col gap-1">
              {!item.cancelled && !item.isComplete && (
                <>
                  <button
                    onClick={() => confirmAppoinment(item._id)}
                    className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs hover:bg-green-200"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to cancel this appointment?"
                        )
                      ) {
                        cancelAppoinment(item._id);
                      }
                    }}
                    className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200"
                  >
                    Cancel
                  </button>
                </>
              )}
              {item.cancelled && (
                <span className="text-xs text-red-500 font-semibold">
                  Cancelled
                </span>
              )}
              {item.isComplete && (
                <span className="text-xs text-green-600 font-semibold">
                  Confirmed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppoinments;
