
import React, { useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

function fmtCurrency(n) {
  if (isNaN(n)) return "-";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function InfrastructureFiscalModule({ volumesFromParent = null }) {
  const [bound, setBound] = useState("low");
  const [showResults, setShowResults] = useState(false);


  const [cost_vertiport, set_cost_vertiport] = useState(1500000);
  const [cost_drone_hub, set_cost_drone_hub] = useState(250000);
  const [capacity_vertiport, set_capacity_vertiport] = useState(50000);
  const [capacity_hub, set_capacity_hub] = useState(200000);

 
  const [tax_rate_sales, set_tax_rate_sales] = useState(5.75);
  const [avg_cart_value, set_avg_cart_value] = useState(40.0);

 
  const defaults = {
    Vol_Delivery: { flightsLow: 9525600, flightsHigh: 23814000 },
    Vol_UAM: { flightsLow: 23400000, flightsHigh: 253500000 },
    Rev_Flight_UAM: { low: 23400000 * 180, high: 253500000 * 180 }
  };

  const volumes = volumesFromParent || defaults;

 
  const Vol_Delivery = bound === "low" ? volumes.Vol_Delivery.flightsLow : volumes.Vol_Delivery.flightsHigh;
  const Vol_UAM = bound === "low" ? volumes.Vol_UAM.flightsLow : volumes.Vol_UAM.flightsHigh;
  const Rev_Flight_UAM = bound === "low" ? volumes.Rev_Flight_UAM.low : volumes.Rev_Flight_UAM.high;

  const Hubs_Need = Math.ceil(Vol_Delivery / capacity_hub);
  const Verts_Need = Math.ceil(Vol_UAM / capacity_vertiport);
  const Total_CapEx = ( Hubs_Need * cost_drone_hub )+ (Verts_Need * cost_vertiport);

  const Taxable_Goods = Vol_Delivery * avg_cart_value;
  const Tax_Goods = Taxable_Goods * (tax_rate_sales / 100);
  const Tax_UAM = Rev_Flight_UAM * (tax_rate_sales / 100);
  const Total_Tax = Tax_Goods + Tax_UAM;

  const calculate = () => setShowResults(true);

  const fiscalData = [
    { name: "CapEx", value: Total_CapEx },
    { name: "Tax Revenue", value: Total_Tax }
  ];

  return (
    <section className="card">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Advanced Infrastructure & Fiscal</h2>

        <h4 className="mb-2">Infrastructure Inputs</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
          <label className="border p-2 rounded">
            Avg. Cost per Vertiport 
            <input type="number" value={cost_vertiport} onChange={e => set_cost_vertiport(parseFloat(e.target.value) || 0)} />
          </label>
          <label className="border p-2 rounded">
            Avg. Cost per Delivery Hub 
            <input type="number" value={cost_drone_hub} onChange={e => set_cost_drone_hub(parseFloat(e.target.value) || 0)} />
          </label>
          <label className="border p-2 rounded">
           Annual Trips per Vertiport 
            <input type="number" value={capacity_vertiport} onChange={e => set_capacity_vertiport(parseFloat(e.target.value) || 0)} />
          </label>
          <label className="border p-2 rounded">
            Annual Deliv. per Hub
            <input type="number" value={capacity_hub} onChange={e => set_capacity_hub(parseFloat(e.target.value) || 0)} />
          </label>
          <label className="border p-2 rounded">
            Sales Tax Rate (%)
            <input type="number" value={tax_rate_sales} onChange={e => set_tax_rate_sales(parseFloat(e.target.value) || 0)}/>
          </label>
          <label className="border p-2 rounded">
            Avg. Value of Goods Delivered 
            <input type="number" value={avg_cart_value} onChange={e => set_avg_cart_value(parseFloat(e.target.value) || 0)} />
          </label>
        </div>

        <button onClick={calculate}>Calculate</button>

        {showResults && (
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => setBound("low")} style={{
              padding: "8px 14px",
              marginRight: 8,
              background: bound === "low" ? "#007bff" : "#ddd",
              color: bound === "low" ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}>Lower Bound</button>

            <button onClick={() => setBound("high")}style={{
              padding: "8px 14px",
              marginRight: 8,
              background: bound === "high" ? "#007bff" : "#ddd",
              color: bound === "high" ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}>Upper Bound</button>
          </div>
        )}

        {showResults && (
          <>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
              <Card label="Vertiports Required" value={Verts_Need} />
              <Card label="Delivery Hubs Required" value={Hubs_Need} />
              <Card label="Total Infrastructure Investment" value={fmtCurrency(Total_CapEx)} />
              <Card label="Est. Annual Sales Tax Revenue" value={fmtCurrency(Total_Tax)} />
            </div>

            <table className="min-w-full border-collapse border border-gray-300 text-sm mb-4">
              <tbody>
                <Row label="Hubs Needed" value={Hubs_Need} />
                <Row label="Vertiports Needed" value={Verts_Need} />
                <Row label="Total CapEx" value={fmtCurrency(Total_CapEx)} bold />
                <Row label="Taxable Goods Value" value={fmtCurrency(Taxable_Goods)} />
                <Row label="Tax on Goods" value={fmtCurrency(Tax_Goods)} />
                <Row label="Tax on UAM Tickets" value={fmtCurrency(Tax_UAM)} />
                <Row label="Total Tax Revenue" value={fmtCurrency(Total_Tax)} bold />
              </tbody>
            </table>

            <h4 style={{ marginBottom: "8px" }}>Fiscal Mix Chart</h4>
            <PieChart width={510} height={300}>
              <Pie
                data={fiscalData}
                cx={220}
                cy={150}
                outerRadius={100}
                innerRadius={60}
                label={({ name, value }) => `${name}: ${fmtCurrency(value)}`}
                dataKey="value"
                nameKey="name"
              >
                <Cell key="c1" fill="#4d79ff" />
                <Cell key="c2" fill="#ffb74d" />
              </Pie>
              <Tooltip formatter={fmtCurrency} />
              <Legend />
            </PieChart>
          </>
        )}
      </div>
    </section>
  );
}

function Card({ label, value }) {
  return (
    <div style={{
      flex: "1 1 180px",
      minWidth: "180px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "12px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "12px", color: "#555", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "20px", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <tr style={{ fontWeight: bold ? 600 : 400 }}>
      <td style={{ paddingLeft: 0, paddingTop: 4, paddingBottom: 4 }}>{label}</td>
      <td className="text-right">{value}</td>
    </tr>
  );
}
