import { useState } from "react";

export default function SectionC({ inputs }) {
  const [commercial, setCommercial] = useState({
    annualTonnes: 7938000,
    manufacturedGoodsPct: 30,
    uavPotentialPct: 20,
    avgKgPerDelivery: 1,
    avgFlightsPerDay: 1,
    uavCapacityPctLower: 2,
    uavCapacityPctUpper: 5
  });
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommercial(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const { annualTonnes, manufacturedGoodsPct, uavPotentialPct, avgKgPerDelivery, avgFlightsPerDay, uavCapacityPctLower, uavCapacityPctUpper } = commercial;
    const { operationalDaysPerWeek, operationalWeeksPerYear } = inputs;

    const annualUAVTonnesMax = annualTonnes * (manufacturedGoodsPct/100) * (uavPotentialPct/100);
    const annualUAVFlightsMax = (annualUAVTonnesMax * 1000) / avgKgPerDelivery;
    const avgFlightsPerUAVPerYear = avgFlightsPerDay * operationalDaysPerWeek * operationalWeeksPerYear;
    const annualFlightsLower = annualUAVFlightsMax * (uavCapacityPctLower/100);
    const annualFlightsUpper = annualUAVFlightsMax * (uavCapacityPctUpper/100);
    const annualUAVsLower = annualFlightsLower / avgFlightsPerUAVPerYear;
    const annualUAVsUpper = annualFlightsUpper / avgFlightsPerUAVPerYear;

    setResults({ annualUAVTonnesMax, annualUAVFlightsMax, avgFlightsPerUAVPerYear, annualFlightsLower, annualFlightsUpper, annualUAVsLower, annualUAVsUpper });
  };

  return (
    <section className="card">
      <h2>C. Commercial Delivery</h2>
      <div className="grid">
        <label>
          Annual Tonnes
          <input type="number" name="annualTonnes" value={commercial.annualTonnes} onChange={handleChange} />
        </label>
        <label>
          Manufactured Goods %
          <input type="number" name="manufacturedGoodsPct" value={commercial.manufacturedGoodsPct} onChange={handleChange} />
        </label>
        <label>
          UAV Potential %
          <input type="number" name="uavPotentialPct" value={commercial.uavPotentialPct} onChange={handleChange} />
        </label>
        <label>
          Avg kg per delivery
          <input type="number" name="avgKgPerDelivery" value={commercial.avgKgPerDelivery} onChange={handleChange} />
        </label>
        <label>
          Flights per day
          <input type="number" name="avgFlightsPerDay" value={commercial.avgFlightsPerDay} onChange={handleChange} />
        </label>
        <label>
          UAV % of Max Capacity - Lower
          <input type="number" name="uavCapacityPctLower" value={commercial.uavCapacityPctLower} onChange={handleChange} />
        </label>
        <label>
          UAV % of Max Capacity - Upper
          <input type="number" name="uavCapacityPctUpper" value={commercial.uavCapacityPctUpper} onChange={handleChange} />
        </label>
      </div>
      <button onClick={handleCalculate}>Calculate</button>
      {results && (
        <ul className="results">
          <li>Annual UAV Tonnes Max: {results.annualUAVTonnesMax.toFixed(2)}</li>
          <li>Annual UAV Flights Max: {results.annualUAVFlightsMax.toFixed(0)}</li>
          <li>Avg Flights per UAV per Year: {results.avgFlightsPerUAVPerYear.toFixed(2)}</li>
          <li>Annual Flights Lower: {results.annualFlightsLower.toFixed(0)}</li>
          <li>Annual Flights Upper: {results.annualFlightsUpper.toFixed(0)}</li>
          <li>Annual UAVs Lower: {results.annualUAVsLower.toFixed(2)}</li>
          <li>Annual UAVs Upper: {results.annualUAVsUpper.toFixed(2)}</li>
        </ul>
      )}
    </section>
  );
}
