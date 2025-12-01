import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SectionK = ({
   flightsBase = { 
    small: 750000,
    medium: 7500000,
    large: 22500000,},

  flightsUpperSource = {            
    small: 2500000,
    medium: 25000000,
    large: 275000000,},

  uavsBase = {            
    small: 25000,
    medium: 25000,
    large: 2500,},

  uavsUpperSource = {            
    small: 87500,
    medium: 100000,
    large: 42500,},
}) => {
  const safe = (v) => (isFinite(v) ? v : 0);

  const roundDownExcel = (value) => {
    value = safe(value);
    if (value <= 0) return 0;
    const power = Math.floor(Math.log10(value * 4));
    const magnitude = Math.pow(10, power) / 4;
    return Math.floor(value / magnitude) * magnitude;
  };

  const roundUpExcel = (value) => {
    value = safe(value);
    if (value <= 0) return 0;
    const power = Math.floor(Math.log10(value));
    const magnitude = Math.pow(10, power) / 4;
    return Math.ceil(value / magnitude) * magnitude;
  };

  // Local state for inputs
  const [inputs, setInputs] = useState({
    flightsBase: { ...flightsBase },
    flightsUpperSource: { ...flightsUpperSource },
    uavsBase: { ...uavsBase },
    uavsUpperSource: { ...uavsUpperSource },
  });

  const [computed, setComputed] = useState(null);

  const updateInput = (category, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: parseFloat(value) || 0,
      },
    }));
  };

const generateTable = (base = {}, upperSrc = {}) => {
  const lower = {
    small: roundDownExcel(safe(base.small)),
    medium: roundDownExcel(safe(base.medium)),
    large: roundDownExcel(safe(base.large)),
  };

  const upper = {
    small: roundUpExcel(safe(upperSrc.small)),
    medium: roundUpExcel(safe(upperSrc.medium)),
    large: roundUpExcel(safe(upperSrc.large)),
  };

  const range = {
    small: upper.small - lower.small,
    medium: upper.medium - lower.medium,
    large: upper.large - lower.large,
  };

  // SEQUENTIAL VALUES
  const step1 = {
    small: lower.small,
    medium: lower.medium,
    large: lower.large,
  };

  const step2 = {
    small: step1.small + 0.1 * range.small,
    medium: step1.medium + 0.1 * range.medium,
    large: step1.large + 0.1 * range.large,
  };

  const step3 = {
    small: step2.small + 0.2 * range.small,
    medium: step2.medium + 0.2 * range.medium,
    large: step2.large + 0.2 * range.large,
  };

  const step4 = {
    small: step2.small + 0.5 * range.small,
    medium: step2.medium + 0.5 * range.medium,
    large: step2.large + 0.5 * range.large,
  };

  const step5 = {
    small: upper.small,
    medium: upper.medium,
    large: upper.large,
  };

  return [
    {
      label: "Lower Bound",
      small: Math.round(step1.small),
      medium: Math.round(step1.medium),
      large: Math.round(step1.large),
      total: Math.round(step1.small + step1.medium + step1.large),
    },
    {
      label: "+10%",
      small: Math.round(step2.small),
      medium: Math.round(step2.medium),
      large: Math.round(step2.large),
      total: Math.round(step2.small + step2.medium + step2.large),
    },
    {
      label: "+20%",
      small: Math.round(step3.small),
      medium: Math.round(step3.medium),
      large: Math.round(step3.large),
      total: Math.round(step3.small + step3.medium + step3.large),
    },
    {
      label: "+50%",
      small: Math.round(step4.small),
      medium: Math.round(step4.medium),
      large: Math.round(step4.large),
      total: Math.round(step4.small + step4.medium + step4.large),
    },
    {
      label: "Upper Bound",
      small: Math.round(step5.small),
      medium: Math.round(step5.medium),
      large: Math.round(step5.large),
      total: Math.round(step5.small + step5.medium + step5.large),
    },
  ];
};

  const fmt = (n) => (isFinite(n) ? n.toLocaleString() : "-");

  const renderTable = (title, rows) => (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "right",
          border: "1px solid #ddd",
        }}
      >
        <thead style={{ background: "#f9f9f9" }}>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Category</th>
            <th style={{ padding: 8 }}>Small Recreational</th>
            <th style={{ padding: 8 }}>Medium Commercial</th>
            <th style={{ padding: 8 }}>Large Urban Mobility</th>
            <th style={{ padding: 8 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: "1px solid #eee" }}>
              <td style={{ textAlign: "left", padding: 8, fontWeight: 600 }}>
                {r.label}
              </td>
              <td style={{ padding: 8 }}>{fmt(r.small)}</td>
              <td style={{ padding: 8 }}>{fmt(r.medium)}</td>
              <td style={{ padding: 8 }}>{fmt(r.large)}</td>
              <td
                style={{
                  padding: 8,
                  fontWeight: 700,
                  background: "#fafafa",
                }}
              >
                {fmt(r.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderChart = (title, data) => (
    <div style={{ width: "48%", minWidth: 300, height: 300 }}>
      <h3 style={{ textAlign: "center", marginBottom: 8 }}>{title}</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 40, left: 30, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend />

          <Line
            type="monotone"
            dataKey="small"
            stroke="#cccccc"
            name="Small Recreational"
          />
          <Line
            type="monotone"
            dataKey="medium"
            stroke="#d85c1a"
            name="Medium Commercial"
          />
          <Line
            type="monotone"
            dataKey="large"
            stroke="#3b82f6"
            name="Large Urban Mobility"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#000000"
            strokeDasharray="3 3"
            name="Total"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const calculate = () => {
    const flightsRows = generateTable(
      inputs.flightsBase,
      inputs.flightsUpperSource
    );
    const uavsRows = generateTable(inputs.uavsBase, inputs.uavsUpperSource);

    setComputed({ flightsRows, uavsRows });
  };

  return (
    <section className="card">
      <div style={{ padding: 16 }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>
          K. Chart Calculations
        </h2>

        {/* Inputs Panel */}
        <div className="grid">
          {["flightsBase", "flightsUpperSource", "uavsBase", "uavsUpperSource"].map(
            (cat) => (
              <div key={cat}>
                <div>{cat}</div>
                {["small", "medium", "large"].map((field) => (
                  <label key={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <input
                      type="number"
                      value={inputs[cat][field] || 0}
                      onChange={(e) => updateInput(cat, field, e.target.value)}
                    />
                  </label>
                ))}
              </div>
            )
          )}
        </div>

        <button onClick={calculate}>Calculate</button>

        {/* TABLES & CHARTS */}
        {computed && (
          <>
            {renderTable("Annual Flights", computed.flightsRows)}
            {renderTable("Annual UAVs", computed.uavsRows)}

            <h2 style={{ textAlign: "center", marginTop: 40 }}>Results</h2>
            <p style={{ textAlign: "center", fontStyle: "italic" }}>
              Volume Estimates for Year 2049
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 24,
              }}
            >
              {renderChart("Annual Flights", computed.flightsRows)}
              {renderChart("Annual UAVs", computed.uavsRows)}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SectionK;
