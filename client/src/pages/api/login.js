import axios from 'axios';


export default async function login(req, res) {
    try {
        if (req.method === 'POST') {
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            const userData = req.body.data;
            const response = await axios.post(`${API_URL}/authentication/login`, userData);
            res.status(200).json(response.data);
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
