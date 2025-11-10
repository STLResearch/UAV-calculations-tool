import React, { useState } from "react";
import SectionA from "./components/sectionA";
import SectionB from "./components/sectionB";
import SectionC from "./components/sectionC";
import SectionD from "./components/sectionD";
import SectionE from "./components/sectionE";
import SectionF from "./components/sectionF";
import SectionG from "./components/sectionG";
import SectionH from "./components/sectionH";

function App() {
  const [activeSection, setActiveSection] = useState("A");

  const [inputs, setInputs] = useState({
    year: 2049,
    population: 6500000,
    operationalHoursPerDay: 6,
    operationalDaysPerWeek: 5,
    operationalWeeksPerYear: 48,
    operationalTimeInFlightPct: 70,
    averageHoursPerFlight: 1,
    averageOverheadHoursPerFlight: 0.5,
    averageVelocity: 20,
    coverageWidthPerPath: 100,
    maxStructuresPerWeek: 7,
    maxKmPerUAV: 250,       // for sections F/G
    coveredLinearPathPerFlight: 20, 
    maxStructuresPerUAV: 336,
    dailyAreaPerFlight: 2,    // for H
    avgEventServedPct: 50
  });

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Sections</h2>
        {["A","B","C","D","E","F","G","H"].map(sec => (
          <button key={sec} onClick={() => setActiveSection(sec)}>
            {`Section ${sec}`}
          </button>
        ))}
      </aside>

      <main className="content">
        {activeSection === "A" && <SectionA inputs={inputs} setInputs={setInputs} />}
        {activeSection === "B" && <SectionB inputs={inputs} />}
        {activeSection === "C" && <SectionC inputs={inputs} />}
        {activeSection === "D" && <SectionD inputs={inputs} />}
        {activeSection === "E" && <SectionE inputs={inputs} />}
        {activeSection === "F" && <SectionF inputs={inputs} />}
        {activeSection === "G" && <SectionG inputs={inputs} />}
        {activeSection === "H" && <SectionH inputs={inputs} />}
      </main>
    </div>
  );
}

export default App;
