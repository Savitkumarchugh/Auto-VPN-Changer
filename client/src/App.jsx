import { useState, useEffect } from "react";

function App() {
  const [locations, setLocations] = useState(""); // To store the input string
  const [displayList, setDisplayList] = useState([]); // To store the processed list with counts
  const [activeSection, setActiveSection] = useState("VPN"); // Tracks the active section
  const [clickedLocation, setClickedLocation] = useState(null); // Tracks the last clicked button

  useEffect(() => {
    const savedLocations = localStorage.getItem("locations");
    const savedDisplayList = localStorage.getItem("displayList");
    const savedClickedLocation = localStorage.getItem("clickedLocation");

    if (savedLocations) setLocations(savedLocations);
    if (savedDisplayList) setDisplayList(JSON.parse(savedDisplayList));
    if (savedClickedLocation) setClickedLocation(savedClickedLocation);
  }, []);

  const handleInputChange = (event) => {
    const input = event.target.value;
    setLocations(input);
    localStorage.setItem("locations", input); // Save to localStorage
  };
  const handleGenerateList = () => {
    const locationArray = locations
      .trim()
      .split(/\r?\n/)
      .filter((line) => line);

    const locationCount = {};
    locationArray.forEach((location) => {
      locationCount[location] = (locationCount[location] || 0) + 1;
    });

    const sortedLocations = Object.entries(locationCount).sort(
      (a, b) => b[1] - a[1]
    );

    setDisplayList(sortedLocations);
    localStorage.setItem("displayList", JSON.stringify(sortedLocations));
    setActiveSection("VPN");
  };

  const handleClear = () => {
    setLocations("");
    setDisplayList([]);
    localStorage.removeItem("locations");
    localStorage.removeItem("displayList");
    localStorage.removeItem("clickedLocation");
  };

  const handleButtonClick = async (location) => {
    try {
      const response = await fetch("http://localhost:8080/change_vpn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
      });
      const data = await response.json();
      setClickedLocation(location);
      localStorage.setItem("clickedLocation", location);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to communicate with the backend.");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
            >
              <path
                fill="#c1272d"
                d="M15.242,37H27.91c1.894,0,3.625-1.07,4.472-2.764l0.222-0.445C33.705,31.59,32.104,29,29.643,29H15	c-1.105,0-2-0.895-2-2v-1h-2.5l-1.001,2.446C7.829,32.528,10.832,37,15.242,37z"
              ></path>
              <polygon
                fill="#c1272d"
                points="6.093,27 32,27 32,19 10.093,19"
              ></polygon>
              <path
                fill="#c1272d"
                d="M34.333,9H24.23c-3.496,0-6.675,2.024-8.154,5.191L14.763,17H37c0.552,0,1,0.448,1,1	c0,0.552-0.448,1-1,1H13.829l-3.737,8h21.574c4.44,0,8.444-2.669,10.153-6.767l0,0C44.047,14.89,40.122,9,34.333,9z"
              ></path>
            </svg>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              VPN Changer
            </span>
          </a>

          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <a
              href="tel:5541251234"
              className="mt-4 text-sm text-gray-500 dark:text-white hover:underline"
            >
              Click to change VPN
            </a>
          </div>
        </div>
      </nav>

      <nav className="bg-gray-50 dark:bg-gray-700">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div className="flex items-center">
            <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={() => setActiveSection("VPN")}
                >
                  VPN
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={() => setActiveSection("Location")}
                >
                  Location
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={() => setActiveSection("Pointer")}
                >
                  Pointer
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={() => setActiveSection("Feedback")}
                >
                  Read
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Navbar */}

      {/* Sections */}
      {activeSection === "VPN" && (
        <div className="w-full max-w-sm p-8 bg-white border border-gray-200 overflow-y-auto max-h-64 shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700 scroll-smooth">
          <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
            VPN Opener
          </h5>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Connect with one of our available VPN providers and apply filter in
            excel according to VPN.
          </p>

          <ul className="my-4 space-y-3">
            {displayList.length === 0 ? (
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                >
                  Locations
                </button>
              </li>
            ) : (
              displayList.map(([location, count], index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleButtonClick(location)}
                    className={`flex items-center w-full p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white ${
                      clickedLocation === location
                        ? "bg-red-500 text-white"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100 dark:bg-gray-600 dark:text-white"
                    }`}
                  >
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {location} : {count}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>

          <div>
            <a
              href="#"
              className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
            >
              <svg
                className="w-3 h-3 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Why do I need to connect my VPN?
            </a>
          </div>
        </div>
      )}

      {activeSection === "Location" && (
        <div className="mt-4">
          <form className="max-w-sm mx-auto">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Paste Locations Here:
            </label>
            <textarea
              id="message"
              rows="4"
              value={locations}
              onChange={handleInputChange}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Paste here:"
            ></textarea>
          </form>

          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={handleGenerateList}
              className="px-3 py-2 text-xs font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Generate List
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {activeSection === "Pointer" && (
        <>
          <div className="mt-4">
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Connect with one of our available VPN providers and apply filter
              in excel according to VPN.
            </p>

            <div className="flex space-x-4 mt-4">
              <button
                type="button"
                className="px-3 py-2 text-xs font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Start
              </button>

              <button
                type="button"
                className="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                Stop
              </button>
            </div>
          </div>
        </>
      )}

      {activeSection === "Feedback" && (
        <>
          <h1 class="mt-4 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Developing VPN Changer{" "}
            <span class="text-blue-600 dark:text-blue-500">
              which will change VPN
            </span>{" "}
            in <span class="text-blue-600 dark:text-blue-500">just</span> one
            click.
          </h1>
        </>
      )}
    </>
  );
}

export default App;
