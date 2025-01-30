import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { Contextapi } from '../../context/Appcontext';
import Dashboardleftside from '../../components/Dashboard/Dashboardleftside';
import Dashboradheader from '../../components/Dashboard/Dashboardheader';
import { GrLineChart } from "react-icons/gr";
import { FaTrophy } from "react-icons/fa";
import { SiSololearn } from "react-icons/si";
import { CgWebsite } from "react-icons/cg";
import { FaRegAddressCard } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import axios from "axios"
import Swal from 'sweetalert2';
import { MdOutlineDelete } from "react-icons/md";
const Orders = () => {
   const navigate=useNavigate();
     const {activesidebar,setactivesidebar,activetopbar,setactivetopbar}=useContext(Contextapi);
        useEffect(()=>{
     window.addEventListener("scroll",()=>{
      if(window.scrollY > 100){
             setactivetopbar(true)
      }else{
             setactivetopbar(false)
      }
     })
   },[]);
   const [searchQuery, setSearchQuery] = useState("");
const [orderstatus,setorderstatus]=useState(["pending", "processing", "hold","completed", "suspended"]);
  const [filter, setFilter] = useState("");
  const [orders, setOrders] = useState([]);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const [pending_order,setpending_order]=useState([])
  // ---------------all-feedback--------------
  const get_orders = () => {
    axios
      .get(`${base_url}/admin/all-orders`)
      .then((res) => {
        if (res.data.success) {
            setOrders(res.data.data);
            setpending_order(req.data.pending_order)
        }
      })
      .catch((err) => {
        console.log(err.name);
      });
  };
  useEffect(() => {
    get_orders();
  }, []);
  // ------------delete category-------------
  const delete_order = (id) => {
    const confirm_box = confirm("Are you sure?");
    if (confirm_box) {
      axios
        .delete(`${base_url}/admin/delete-order/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          if (res.data.success) {
            Swal.fire("Success", `${res.data.message}`, "success");
            get_orders();
          }
        })
        .catch((err) => {
          toast.error(err.name);
        });
    }
  };
  const statuses = ["Pending", "Completed", "Failed", "Shipped", "Cancelled"];

  const handleStatusChange = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDelete = (id) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  const filteredOrders = orders.filter(
    (order) =>
    //   order.product_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filter === "" || order.status === filter)
  );
  const handlestatus=(id,status_val)=>{
    try {
     Swal.fire({
       title: 'Are you sure?',
       text: 'You want be update the deposit status!',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonText: 'Yes, Update it!',
       cancelButtonText: 'Cancel',
       reverseButtons: true
   }).then((result) => {
       if (result.isConfirmed) {
         axios.put(`${base_url}/admin/update-order-status/${id}`, {
           status: status_val,
         }).then((res)=>{
           if(res.data.success){
             Swal.fire({
                 title: 'Successful',
                 text: `${res.data.message} to ${status_val}`,
                 icon: 'success',
             })
         }
         }).catch((err)=>{
           console.log(err)
         })
       } else {
           // If canceled, no action is taken
           console.log('Delete action was canceled');
       }
   });
      
   } catch (error) {
     console.log(error);
   }
}
  return (
    <section className='w-full h-[100vh] flex font-poppins'>
  <section className='w-full h-[100vh] flex font-poppins'>
        <section className={activesidebar ? 'w-0 h-[100vh] transition-all duration-300 overflow-hidden':'w-0 xl:w-[20%] transition-all duration-300 h-[100vh]'}>
            <Dashboardleftside/>
        </section>
        <section className={activesidebar ? 'w-[100%] h-[100vh] overflow-y-auto transition-all duration-300':' transition-all duration-300 w-[100%] overflow-y-auto xl:w-[85%] h-[100vh]'}>
        <Dashboradheader/> 
       {/* ----------------box-------------- */}
<section className="pt-[20px] ">
<div className="p-6">
      <div className="w-full bg-white p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Orders Table</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search by Product Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <table className="w-full border-collapse border-[1px] border-[#eee]">
          <thead>
            <tr className="bg-indigo-500 text-white">
              <th className="py-3 px-4 text-left">Invoice</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Payment Method</th>
              <th className="py-3 px-4 text-left">Payer Number</th>
              <th className="py-3 px-4 text-left">Transaction</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3 px-4 text-orange-500 font-[500]">{order.invoice_id}</td>
                <td className="py-3 px-4">{order?.createdAt.slice(0,10)}</td>
                <td className="py-3 px-4">{order?.product_price}</td>
                <td className="py-3 px-4">{order?.provider_name}</td>
                <td className="py-3 px-4">{order?.payeer_number}</td>
                <td className="py-3 px-4">{order?.transiction}</td>
                <td className="py-3 px-4">
                  <select
                    className={`border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}

                    defaultValue={order.status} onChange={(e)=>{handlestatus(order._id,e.target.value)}}
                  >
                    {
                        orderstatus.map((dat,i)=>{
                          return(
                            <option value={dat} key={i}>{dat}</option>
                          )
                        })
                      }
                  </select>
                </td>
                <td className="py-3 px-4 flex justify-center items-center gap-[5px]">
                    <NavLink to={`/order-invoice/${order._id}`}>
                    <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none"
                  >
                    Details
                  </button>
                    </NavLink>
                   <button onClick={()=>{delete_order(order._id)}} className='p-[10px] bg-red-500 rounded-[5px] text-[18px] text-white'>
                    <MdOutlineDelete/>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
</section>
{/* ----------------box-------------- */}

        </section>
        </section>

     </section>
  )
}

export default Orders