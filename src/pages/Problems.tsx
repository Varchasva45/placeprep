import { Calendar } from "../components/ui/calendar";
import AllProblems from "./AllProblems";
import GaugeCircle from "../components/ui/circle";

const Problems = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4  w-fit h-fit">
      <div className="flex flex-row justify-between">
        <div className="flex-1 flex flex-col">
          {/* Study Plan Section */}
          <div className="flex-1 p-4">
            <h1 className="text-3xl font-bold mb-4">Study Plan</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="bg-slate-900 p-4 rounded-lg flex flex-row justify-evenly">
                <div>
                  <img
                    src="data:image/png;base64,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"
                    alt="Image 1"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2 ml-4">
                    SQL Crash Course
                  </h2>
                  <p className="text-gray-400 mb-4 ml-4">
                    Small description goes here.
                  </p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-slate-900 p-4 rounded-lg flex flex-row justify-evenly">
                <div>
                  <img
                    src="https://www.shutterstock.com/image-vector/dsa-letter-logo-design-illustration-600nw-2309157673.jpg"
                    alt="Image 2"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2 ml-4">
                    Data Structures and Algorithms
                  </h2>
                  <p className="text-gray-400 mb-4 ml-4">
                    Small description goes here.
                  </p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="bg-slate-900 p-4 rounded-lg flex flex-row justify-evenly">
                <div>
                  <img
                    src="https://i0.wp.com/www.iedunote.com/img/21161/interview-1.jpg"
                    alt="Image 3"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2 ml-4">
                    Placeprep's Interview Crash Course
                  </h2>
                  <p className="text-gray-400 mb-4 ml-4">
                    Small description goes here.
                  </p>
                </div>
              </div>
              {/* Add more cards as needed */}
            </div>
          </div>

          {/* Problems Section */}
          <div className="flex-1 p-4">
            <h1 className="text-3xl font-bold mb-4">Problems</h1>
            <AllProblems />
          </div>
        </div>
        {/* Calendar Section */}
        <div className="flex flex-col">
          <div className=" flex-4 p-4">
            <h1 className="text-3xl font-bold mb-4">The Daily Dilemma</h1>
            <Calendar className="w-fit bg-slate-900 text-white rounded-lg" />
          </div>
          <div className=" flex-4 p-4">
            <h1 className="text-3xl font-bold mb-4">Progression</h1>
            <div className="w-fit bg-slate-900 text-white rounded-lg flex flex-row">
              <GaugeCircle
                max={100}
                min={0}
                value={75}
                gaugePrimaryColor="rgb(102, 255, 178)"
                gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
              />
              <div className="flex flex-col justify-evenly mr-5">
                <div className="flex flex-row justify-between">
                  <h1 className="text-blue-300">Easy</h1>
                  <h1 className="ml-5">100/200</h1>
                </div>
                <div className="flex flex-row justify-between">
                  <h1 className="text-yellow-400">Medium</h1>
                  <h1 className="ml-5">150/200</h1>
                </div>
                <div className="flex flex-row justify-between">
                  <h1 className="text-red-400">Hard</h1>
                  <h1 className="ml-5">50/200</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;
