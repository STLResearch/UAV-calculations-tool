import { useState } from "react";


export default function SectionE({ inputs }) {
  const [agriData, setAgriData] = useState({
    agricultureLand: { hectares: 2000, locations: 8, coveragePerYear: 4 },
    cropland: { hectares: 80, locations: 2, coveragePerYear: 4 },
    forestParks: { hectares: 2000, locations: 0, coveragePerYear: 4 },
    uavCapacityPctLower: 5,
    uavCapacityPctUpper: 50,
  });

  const [results, setResults] = useState(null);

  const handleChange = (section, field, value) => {
    setAgriData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: parseFloat(value) || 0 }
    }));
  };

  const handleUAVCapacityChange = (field, value) => {
    setAgriData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const { agricultureLand, cropland, forestParks, uavCapacityPctLower, uavCapacityPctUpper } = agriData;

    // 1. Dynamic inputs from Section A
    const maxAreaPerUAV = inputs.maxAnnualAreaPerUAV || 250000; // A18
    const maxAnnualFlightsPerUAV = inputs.maxAnnualLinearPathPerUAV || 250; // optional flight capacity
    const coverageAreaPerFlight = inputs.coveredAreaPerFlightHa || 200; // Covered Area per Flight (ha)

    // 2. UAV Locations
    const agriLocations = Math.max(agricultureLand.locations, agricultureLand.hectares / maxAreaPerUAV);
    const croplandLocations = Math.max(cropland.locations, cropland.hectares / maxAreaPerUAV);
    const forestLocations = Math.max(forestParks.locations, forestParks.hectares / maxAreaPerUAV);

    // 3. Hectares per Location
    const agriHectaresPerLocation = agricultureLand.hectares / agriLocations;
    const croplandHectaresPerLocation = cropland.hectares / croplandLocations;
    const forestHectaresPerLocation = forestLocations > 0
      ? forestParks.hectares / forestLocations
      : maxAreaPerUAV;

    // 4. Annual UAV Flights per Location using Covered Area per Flight
    const agriFlightsPerLocation = Math.ceil(agriHectaresPerLocation / coverageAreaPerFlight) * agricultureLand.coveragePerYear;
    const croplandFlightsPerLocation = Math.ceil(croplandHectaresPerLocation / coverageAreaPerFlight) * cropland.coveragePerYear;
    const forestFlightsPerLocation = forestLocations > 0
      ? Math.ceil(forestHectaresPerLocation / coverageAreaPerFlight) * forestParks.coveragePerYear
      : 0;

    // 5. UAVs per Location
    const agriUAVsPerLocation = Math.ceil(agriFlightsPerLocation / maxAnnualFlightsPerUAV);
    const croplandUAVsPerLocation = Math.ceil(croplandFlightsPerLocation / maxAnnualFlightsPerUAV);
    const forestUAVsPerLocation = Math.ceil(forestFlightsPerLocation / maxAnnualFlightsPerUAV);

    // 6. Total UAV Flights & UAVs
    const totalFlights = agriFlightsPerLocation * agriLocations +
                         croplandFlightsPerLocation * croplandLocations +
                         forestFlightsPerLocation * forestLocations;

    const totalUAVs = agriUAVsPerLocation * agriLocations +
                      croplandUAVsPerLocation * croplandLocations +
                      forestUAVsPerLocation * forestLocations;

    // 7. Annual Flights per UAV
    const annualFlightsPerUAV = totalFlights / totalUAVs;

    // 8. Apply UAV % of Max Capacity
    const annualFlightsLower = (uavCapacityPctLower / 100) * totalFlights;
    const annualFlightsUpper = (uavCapacityPctUpper / 100) * totalFlights;

    const annualUAVsLower = annualFlightsLower / annualFlightsPerUAV;
    const annualUAVsUpper = annualFlightsUpper / annualFlightsPerUAV;

    setResults({
      agriLocations, croplandLocations, forestLocations,
      agriHectaresPerLocation, croplandHectaresPerLocation, forestHectaresPerLocation,
      agriFlightsPerLocation, croplandFlightsPerLocation, forestFlightsPerLocation,
      agriUAVsPerLocation, croplandUAVsPerLocation, forestUAVsPerLocation,
      totalFlights, totalUAVs, annualFlightsPerUAV,
      annualFlightsLower, annualFlightsUpper, annualUAVsLower, annualUAVsUpper
    });
  };

  return (
    <section className="card">
      <h2>E. Agriculture Use</h2>
      <div className="grid">
        {["agricultureLand", "cropland", "forestParks"].map(section => (
          <div key={section}>
            <h3 style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>{section.replace(/([A-Z])/g, ' $1')}</h3>
            <label>
              Hectares
              <input type="number" value={agriData[section].hectares} onChange={e => handleChange(section, "hectares", e.target.value)} />
            </label>
            <label>
              Locations
              <input type="number" value={agriData[section].locations} onChange={e => handleChange(section, "locations", e.target.value)} />
            </label>
            <label>
              Coverage Times per Year
              <input type="number" value={agriData[section].coveragePerYear} onChange={e => handleChange(section, "coveragePerYear", e.target.value)} />
            </label>
          </div>
        ))}

        <label>
          UAV % of Maximum Capacity - Lower
          <input type="number" value={agriData.uavCapacityPctLower} onChange={e => handleUAVCapacityChange("uavCapacityPctLower", e.target.value)} />
        </label>
        <label>
          UAV % of Maximum Capacity - Upper
          <input type="number" value={agriData.uavCapacityPctUpper} onChange={e => handleUAVCapacityChange("uavCapacityPctUpper", e.target.value)} />
        </label>
      </div>

      <button onClick={handleCalculate}>Calculate</button>

      {results && (
        <ul className="results">
          <li><strong>Agriculture UAV Locations:</strong> {results.agriLocations}</li>
          <li><strong>Cropland UAV Locations:</strong> {results.croplandLocations}</li>
          <li><strong>Forest UAV Locations:</strong> {results.forestLocations}</li>
          <li><strong>Agriculture Hectares per Location:</strong> {results.agriHectaresPerLocation}</li>
          <li><strong>Cropland Hectares per Location:</strong> {results.croplandHectaresPerLocation}</li>
          <li><strong>Forest Hectares per Location:</strong> {results.forestHectaresPerLocation}</li>
          <li><strong>Agriculture Annual Flights per Location:</strong> {results.agriFlightsPerLocation}</li>
          <li><strong>Cropland Annual Flights per Location:</strong> {results.croplandFlightsPerLocation}</li>
          <li><strong>Forest Annual Flights per Location:</strong> {results.forestFlightsPerLocation}</li>
          <li><strong>Total UAV Flights:</strong> {results.totalFlights}</li>
          <li><strong>Total UAVs:</strong> {results.totalUAVs}</li>
          <li><strong>Annual Flights per UAV:</strong> {results.annualFlightsPerUAV.toFixed(2)}</li>
          <li><strong>Annual UAV Flights - Lower:</strong> {results.annualFlightsLower.toFixed(2)}</li>
          <li><strong>Annual UAV Flights - Upper:</strong> {results.annualFlightsUpper.toFixed(2)}</li>
          <li><strong>Annual UAVs - Lower:</strong> {results.annualUAVsLower.toFixed(2)}</li>
          <li><strong>Annual UAVs - Upper:</strong> {results.annualUAVsUpper.toFixed(2)}</li>
        </ul>
      )}
    </section>
  );
}
