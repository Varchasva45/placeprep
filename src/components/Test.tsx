import { useRef, useState } from "react";
import { useEffect } from "react";

export default function Test() {
  const [name, setName] = useState("");
  const prevName = useRef("");

  useEffect(() => {
    prevName.current = name;
  }, [name]);

  return (
    <main>
      {JSON.stringify(prevName.current)}
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </main>
  );
}

// app.post('/vendor-api', async (req, res) => {
//   const { audience_id } = req.body;
//   const randomNumber = Math.floor(Math.random() * 10) + 1;

//   const response = CommunicationLog.find({ audience_id });
//   const data = await response.json();

//   const customers = data.audience;

//   // sending message logic
//   customers.forEach(async (customer) => {
//     console.log(`Hi ${customer.name}, here is your 10 % discount on next message`);
//   })

//   let delivery_status;
//   if (randomNumber <= 9) {
//       delivery_status = 'Success';
//   } else {
//       delivery_status = 'Failed';
//   }

//   const response = await fetch('http://localhost:3000/delivery-status/?audience_id=' + audience_id + '&?delivery_status=' + delivery_status);
//   if(response.ok) {
//       return res.json({ success: true, message: `Delivery status updated successfully for audience ID ${audience_id}` });
//   }
//   return res.status(500).json({ success: false, error: 'Failed to update delivery status' });
// });

// app.post('/delivery-status/:audience_id', (req, res) => {
//   try {
//     const { audience_id } = req.params;
//     const { delivery_status } = req.body;
//     await CommunicationLog.updateOne({ audience_id }, { status: delivery_status })
//     return res.json({ success: true, message: `Delivery status updated successfully for audience ID ${audience_id}` });
//   } catch(error) {
//     return res.status(500).json({ success: false, error: 'Failed to update delivery status' });
//   }
// });
