import React, { useState, useEffect } from 'react'
import jwt from 'jwt-decode'
import { useRouter } from 'next/router';

import Manufacturer from '../../components/Manufacturer';
import Transporter from '../../components/Transporter'

function Home() {
  const router = useRouter()

  const [role, setRole] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem("userToken")) {
        const jwtDecode = jwt(localStorage.getItem("userToken"));
        const userValue = jwtDecode.user;
        const [email, name, userRole] = userValue.split(' ');
        setRole(userRole)
      } else {
        router.push("/login")
      }
    }
  }, [])

  return (
    <>
      {
        role === "manufacturer" ? <Manufacturer userRole={role} /> : <Transporter userRole={role} />
      }
    </>
  );
}

export default Home;