/** Node layout for the AI Operations visuals — no three.js imports here,
 *  so pages can reference labels without pulling the 3D bundle. */

export interface NodeDef {
  label: string;
  pos: [number, number, number];
  color: string;
}

export const OPS_NODES: NodeDef[] = [
  { label: "Website Lead", pos: [-4.6, 1.7, -0.6], color: "#56D9FF" },
  { label: "AI Agent", pos: [-2.4, -2.0, 1.2], color: "#8FB4FF" },
  { label: "CRM", pos: [2.2, 2.3, 0.8], color: "#3E7BFF" },
  { label: "WhatsApp", pos: [4.6, 0.4, -0.8], color: "#3DDC97" },
  { label: "Email", pos: [3.4, -1.9, 1.0], color: "#3DDC97" },
  { label: "Calendar", pos: [0.6, 3.2, -1.4], color: "#FFB454" },
  { label: "Database", pos: [-3.6, 0.1, -1.8], color: "#8FB4FF" },
  { label: "ERP", pos: [-1.2, 2.9, 1.6], color: "#8FB4FF" },
  { label: "Payments", pos: [1.6, -3.0, -1.2], color: "#FFB454" },
  { label: "Sales", pos: [4.4, 2.4, 0.6], color: "#3DDC97" },
  { label: "Support", pos: [-4.4, -1.6, 0.8], color: "#3DDC97" },
  { label: "Analytics", pos: [2.8, 0.9, 2.0], color: "#56D9FF" },
];
