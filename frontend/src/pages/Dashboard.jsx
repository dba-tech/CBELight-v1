import { useEffect, useState } from 'react'
import axios from '../api'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, byDepartment: [] })
  const [registrations, setRegistrations] = useState([])
  const [loadingRegs, setLoadingRegs] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get('/api/registrations/stats')
        setStats(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    async function fetchRegistrations() {
      try {
        const res = await axios.get('/api/registrations')
        setRegistrations(res.data || [])
        setLoadingRegs(false)
      } catch (err) {
        console.error(err)
        setLoadingRegs(false)
      }
    }

    fetchStats()
    fetchRegistrations()
    const id = setInterval(fetchStats, 10000)

    // Socket.io dynamic import (keeps tests happy)
    let socket
    ;(async () => {
      try {
        const mod = await import('socket.io-client')
        const io = mod.io || mod.default
        const base = import.meta.env.VITE_API_URL
        if (!base) {
          console.warn('VITE_API_URL is not defined')
          return
        }

        socket = io(base, {
          transports: ['websocket'],
          withCredentials: true,
        })

        socket.on('registration:created', () => {
          fetchStats()
          fetchRegistrations()
        })
        socket.on('registration:updated', () => {
          fetchStats()
          fetchRegistrations()
        })
      } catch (err) {
        console.warn('Socket.io connection failed', err)
      }
    })()

    return () => {
      clearInterval(id)
      try {
        if (socket) socket.disconnect()
      } catch (e) {}
    }
  }, [])

  const data = (stats.byDepartment || []).map(d => ({ name: d._id || 'Unknown', value: d.count }))
  const total = stats.total || data.reduce((s, x) => s + x.value, 0)
  const colors = ['#1e40af', '#7dace6ff', '#036664ff', '#D4AF37', '#010715ff']

  return (
    <div className="space-y-6 min-h-screen p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold text-cbelight-primary mb-3">Registration Dashboard</h2>
        <p className="text-gray-600 text-sm mb-4">
          Total Registrations:{' '}
          <strong className="text-lg text-cbelight-primary">{total}</strong>
        </p>

        {/* Responsive chart container: different heights by breakpoint */}
        <div className="w-full h-56 md:h-72 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Use percent radius so chart scales with container */}
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="60%"
                innerRadius="30%"
                label={({ name, percent }) =>
                  // hide labels on very small datasets / small screens by CSS (we'll rely on tooltip)
                  `${name}: ${Math.round((percent || 0) * 100)}%`
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              {/* Legend will wrap responsively */}
              <Legend
                verticalAlign="bottom"
                layout="horizontal"
                wrapperStyle={{ marginTop: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Registrations */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Your Registrations</h3>
          <Link
            to="/edit-registration"
            className="text-sm bg-cbelight-primary text-white px-3 py-1 rounded hover:shadow-md transition"
          >
            Edit a Registration
          </Link>
        </div>

        {loadingRegs ? (
          <p className="text-gray-500">Loading registrations...</p>
        ) : registrations.length === 0 ? (
          <p className="text-gray-500 py-4">
            No registrations yet.{' '}
            <Link to="/register" className="text-cbelight-primary hover:underline">
              Submit a new registration
            </Link>
          </p>
        ) : (
          <>
            {/* 1) MOBILE card/list view for small screens */}
            <div className="block md:hidden space-y-3" aria-label="Registrations list (mobile)">
              {registrations.map(reg => (
                <div
                  key={reg._id}
                  className="p-3 rounded-lg shadow-sm bg-white border flex flex-col"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Student ID</div>
                      <div className="font-medium">{reg.studentId || '-'}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">Status</div>
                      <div>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            reg.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : reg.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {reg.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    <div className="truncate">
                      <strong className="font-medium">{reg.firstName} {reg.lastName}</strong>
                    </div>
                    <div className="truncate text-xs">{reg.email}</div>
                    <div className="mt-1 text-xs text-gray-500">{reg.department || '-'}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <Link to={`/register/${reg._id}`} className="text-cbelight-primary text-sm font-medium">
                      Edit
                    </Link>
                    <div className="text-xs text-gray-400">ID: {reg._id.slice(-6)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2) DESKTOP / TABLE view (md+) */}
            <div className="hidden md:block">
              {/* keep the table inside a scrollable box so it doesn't push header/nav */}
              <div className="overflow-x-auto border rounded-md max-h-[50vh] md:max-h-[60vh]">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100 border-b-2 border-gray-300 sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Student ID</th>
                      <th className="text-left px-4 py-3 font-semibold">Name</th>
                      <th className="text-left px-4 py-3 font-semibold">Email</th>
                      {/* hide department on very small screens already handled by switching to cards */}
                      <th className="text-left px-4 py-3 font-semibold">Department</th>
                      <th className="text-left px-4 py-3 font-semibold">Status</th>
                      <th className="text-center px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, idx) => (
                      <tr key={reg._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 border-b whitespace-nowrap">{reg.studentId || '-'}</td>
                        <td className="px-4 py-3 border-b font-medium whitespace-normal">
                          <div className="truncate max-w-[18rem]">{reg.firstName} {reg.lastName}</div>
                        </td>
                        <td className="px-4 py-3 border-b text-sm truncate max-w-[20rem]">{reg.email}</td>
                        <td className="px-4 py-3 border-b">{reg.department || '-'}</td>
                        <td className="px-4 py-3 border-b">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            reg.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            reg.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reg.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b text-center">
                          <Link to={`/register/${reg._id}`} className="text-cbelight-primary hover:underline text-sm font-medium">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// import { useEffect, useState } from 'react'
// import axios from '../api'
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
// import { Link } from 'react-router-dom'

// // socket.io client is optional; we'll attempt dynamic import so tests don't fail

// export default function Dashboard() {
//   const [stats, setStats] = useState({ total: 0, byDepartment: [] })
//   const [registrations, setRegistrations] = useState([])
//   const [loadingRegs, setLoadingRegs] = useState(true)

// useEffect(() => {
//   async function fetchStats() {
//     try {
//       const res = await axios.get('/api/registrations/stats');
//       setStats(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async function fetchRegistrations() {
//     try {
//       const res = await axios.get('/api/registrations');
//       setRegistrations(res.data || []);
//       setLoadingRegs(false);
//     } catch (err) {
//       console.error(err);
//       setLoadingRegs(false);
//     }
//   }

//   fetchStats();
//   fetchRegistrations();
//   const id = setInterval(fetchStats, 10000);

//   // ✅ Refined Socket.io connection
//   let socket;
//   (async () => {
//     try {
//       const mod = await import('socket.io-client');
//       const io = mod.io || mod.default;
//       const base = import.meta.env.VITE_API_URL;

//       if (!base) {
//         console.warn('VITE_API_URL is not defined');
//         return;
//       }

//       socket = io(base, {
//         transports: ['websocket'],
//         withCredentials: true
//       });

//       socket.on('registration:created', () => {
//         fetchStats();
//         fetchRegistrations();
//       });

//       socket.on('registration:updated', () => {
//         fetchStats();
//         fetchRegistrations();
//       });
//     } catch (err) {
//       console.warn('Socket.io connection failed', err);
//     }
//   })();

//   return () => {
//     clearInterval(id);
//     try {
//       if (socket) socket.disconnect();
//     } catch (e) {}
//   };
// }, []);

//   const data = (stats.byDepartment || []).map(d => ({ name: d._id || 'Unknown', value: d.count }))
//   const total = stats.total || data.reduce((s, x) => s + x.value, 0)

//   const colors = ['#1e40af', '#7dace6ff', '#036664ff', '#D4AF37', '#010715ff']

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-cbelight-primary mb-3">Registration Dashboard</h2>
//         <p className="text-gray-600 text-sm mb-4">Total Registrations: <strong className="text-lg text-cbelight-primary">{total}</strong></p>

//         <div className="w-full h-72">
//           <ResponsiveContainer>
//             <PieChart>
//               <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(entry) => `${entry.name}: ${Math.round((entry.value/ (total || 1))*100)}%`}>
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="border-t pt-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-bold text-gray-800">Your Registrations</h3>
//           <Link
//             to="/edit-registration"
//             className="text-sm bg-cbelight-primary text-white px-3 py-1 rounded hover:shadow-md transition"
//           >
//             Edit a Registration
//           </Link>
//         </div>

//         {loadingRegs ? (
//           <p className="text-gray-500">Loading registrations...</p>
//         ) : registrations.length === 0 ? (
//           <p className="text-gray-500 py-4">No registrations yet. <Link to="/register" className="text-cbelight-primary hover:underline">Submit a new registration</Link></p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border-collapse">
//               <thead className="bg-gray-100 border-b-2 border-gray-300">
//                 <tr>
//                   <th className="text-left px-4 py-3 font-semibold">Student ID</th>
//                   <th className="text-left px-4 py-3 font-semibold">Name</th>
//                   <th className="text-left px-4 py-3 font-semibold">Email</th>
//                   <th className="text-left px-4 py-3 font-semibold">Department</th>
//                   <th className="text-left px-4 py-3 font-semibold">Status</th>
//                   <th className="text-center px-4 py-3 font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {registrations.map((reg, idx) => (
//                   <tr key={reg._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                     <td className="px-4 py-3 border-b">{reg.studentId || '-'}</td>
//                     <td className="px-4 py-3 border-b font-medium">{reg.firstName} {reg.lastName}</td>
//                     <td className="px-4 py-3 border-b text-sm">{reg.email}</td>
//                     <td className="px-4 py-3 border-b">{reg.department || '-'}</td>
//                     <td className="px-4 py-3 border-b">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${reg.status === 'confirmed' ? 'bg-green-100 text-green-800' : reg.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                         {reg.status || 'pending'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 border-b text-center">
//                       <Link
//                         to={`/register/${reg._id}`}
//                         className="text-cbelight-primary hover:underline text-sm font-medium"
//                       >
//                         Edit
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
