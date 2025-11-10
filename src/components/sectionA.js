import { useState } from "react";

export default function SectionA({ inputs, setInputs }) {
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const {
      operationalHoursPerDay,
      operationalDaysPerWeek,
      operationalWeeksPerYear,
      operationalTimeInFlightPct,
      averageHoursPerFlight,
      averageOverheadHoursPerFlight,
      averageVelocity,
      coverageWidthPerPath,
      maxStructuresPerWeek,
    } = inputs;

    const operationalHoursPerYear = operationalHoursPerDay * operationalDaysPerWeek * operationalWeeksPerYear * (operationalTimeInFlightPct / 100);
    const flightsPerYear = operationalHoursPerYear / (averageHoursPerFlight + averageOverheadHoursPerFlight);
    const coveredLinearPathPerFlight = averageVelocity * averageHoursPerFlight;
    const coveredAreaPerFlightSqKm = (averageVelocity * coverageWidthPerPath) / 1000;
    const coveredAreaPerFlightHa = coveredAreaPerFlightSqKm * 100;
    const maxAnnualStructures = maxStructuresPerWeek * operationalWeeksPerYear;

    setResults({ operationalHoursPerYear, flightsPerYear, coveredLinearPathPerFlight, coveredAreaPerFlightSqKm, coveredAreaPerFlightHa, maxAnnualStructures });
  };

  return (
    <section className="card">
      <h2>A. General Inputs</h2>
      <div className="grid">
        {Object.entries(inputs).map(([key, value]) => (
          <label key={key}>
            <span>{key.replace(/([A-Z])/g, ' $1')}</span>
            <input type="number" name={key} value={value} onChange={handleChange} />
          </label>
        ))}
      </div>
      <button onClick={handleCalculate}>Calculate</button>
      {results && (
        <ul className="results">
          <li>Operational Hours per Year: {results.operationalHoursPerYear.toFixed(2)}</li>
          <li>Flights per Year: {results.flightsPerYear.toFixed(2)}</li>
          <li>Covered Linear Path per Flight (km): {results.coveredLinearPathPerFlight.toFixed(2)}</li>
          <li>Covered Area per Flight (ha): {results.coveredAreaPerFlightHa.toFixed(2)}</li>
          <li>Max Annual Structures: {results.maxAnnualStructures.toFixed(2)}</li>
        </ul>
      )}
    </section>
  );
}
