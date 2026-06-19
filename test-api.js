async function test() {
  // Use local backend URL
  const API_BASE = 'http://localhost:5000';
  
  // Login first to get token
  const loginRes = await fetch(`${API_BASE}/api/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@example.com', password: 'password123' })
  });
  
  const loginData = await loginRes.json();
  const token = loginData.data?.token; // wait, loginData is { success, statusCode, data: { token, user } }

  if (!token) {
    console.log('Login failed:', loginData);
    return;
  }

  console.log('Logged in. Token:', token.slice(0, 10) + '...');

  // Get a tutor ID
  const tutorsRes = await fetch(`${API_BASE}/api/tutors`);
  const tutorsData = await tutorsRes.json();
  const tutorId = tutorsData.data[0]?.id;

  if (!tutorId) {
    console.log('No tutor found');
    return;
  }

  // Create booking
  const bookingRes = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      tutorId: tutorId,
      date: '2026-06-20',
      startTime: '10:00',
      endTime: '11:00'
    })
  });

  const bookingData = await bookingRes.json();
  console.log('Booking response:', JSON.stringify(bookingData, null, 2));
}

test();
