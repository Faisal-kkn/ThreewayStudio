import axios from 'axios';


export default async function getOrders(req, res) {
    try {
        if (req.method === 'GET') {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const accessToken = req.headers?.authorization?.split(' ')[1];
            const response = await axios.get(`${API_URL}/transporter/getOrders`, {
                headers: {
                    'authorization': accessToken
                }
            });
            res.status(200).json(response.data);
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
