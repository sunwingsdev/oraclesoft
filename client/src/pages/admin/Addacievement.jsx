import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Contextapi } from "../../context/Appcontext";
import Dashboardleftside from "../../components/Dashboard/Dashboardleftside";
import Dashboradheader from "../../components/Dashboard/Dashboardheader";
import { IoIosArrowForward } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaCamera } from "react-icons/fa";

import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
const Addacievement = () => {
  const navigate = useNavigate();
  const { activesidebar, setactivesidebar, activetopbar, setactivetopbar } =
    useContext(Contextapi);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const admin_info = JSON.parse(localStorage.getItem("admin_data"));

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setactivetopbar(true);
      } else {
        setactivetopbar(false);
      }
    });
  }, []);

  // Form data state
  const [file, set_file] = useState();
  const [link_value, set_link] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // ----------image prevew-----
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      set_file(file);

      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const [title, set_title] = useState("");
  const [description, setdescription] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields before submitting
    if (!title || !description) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    // Append the profile image if it's available
    if (file) {
      formData.append("file", file);
    }
    console.log(file);
    // Show progress bar while submitting the form
    Swal.fire({
      title: "Submitting...",
      html: "Please wait while your achievement is being added.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Make the POST request with file upload
      const response = await axios.post(
        `${base_url}/admin/add-achievement`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            Swal.update({
              html: `Submitting... ${percentCompleted}% completed.`,
            });
          },
        }
      );

      // Close the progress popup and handle the response
      Swal.close(); // Close progress bar popup

      if (response.data.success) {
        // Reset the form if successful
        set_title("");
        setdescription("");
        setProfileImage(null);
        Swal.fire("Successful", `${response.data.message}`, "success");
      } else {
        Swal.fire("Error", `${response.data.message}`, "error");
      }
    } catch (err) {
      // Close the progress popup and show an error message
      Swal.close();
      console.error(err);
      Swal.fire(
        "Error",
        "Failed to submit the course. Please try again.",
        "error"
      );
    }
  };

  return (
    <section className="w-full h-[100vh] flex font-poppins">
      <section
        className={
          activesidebar
            ? "w-0 h-[100vh] transition-all duration-300 overflow-hidden"
            : "w-0 xl:w-[20%] transition-all duration-300 h-[100vh]"
        }
      >
        <Dashboardleftside />
      </section>
      <section
        className={
          activesidebar
            ? "w-[100%] h-[100vh] overflow-y-auto transition-all duration-300"
            : " transition-all duration-300 w-[100%] overflow-y-auto xl:w-[85%] h-[100vh]"
        }
      >
        <Dashboradheader />
        <section className="w-[100%] m-auto py-[20px] xl:py-[40px] px-[15px]">
          <div className="w-full flex justify-between items-center">
            <div>
              <h1 className="text-[20px] lg:text-[20px] font-[600] mb-[8px]">
                Add Achievement
              </h1>
              <ul className="flex justify-center items-center gap-[10px] text-neutral-500 text-[14px] font-[500]">
                <li>Reviews</li>
                <li>
                  <IoIosArrowForward />
                </li>
                <li>Add Achievement</li>
              </ul>
            </div>
          </div>
          {/* ------------------new category----------------- */}
          <section className="pt-[40px] pb-[20px] w-full  mt-[20px] rounded-[10px]">
            {/* -------------------form---------------------- */}
            <form onSubmit={handleSubmit}>
              <div className="relative w-[60%] lg:w-[50%] xl:w-[30%] h-[200px] mb-[30px]">
                <div className="w-full h-full rounded-[10px] overflow-hidden border-2 border-gray-300">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                      <span className="text-sm">Upload Image</span>
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profileImageInput"
                  className="absolute bottom-1 right-2 bg-blue-600 text-white p-3 rounded-[5px] cursor-pointer hover:bg-blue-700"
                >
                  <FaCamera className="w-4 h-4" />
                </label>
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Form Fields */}
              <div className="w-full flex gap-[10px] lg:gap-[30px] mb-[10px]">
                <div className="w-[100%]">
                  <label
                    htmlFor="title"
                    className="text-[15px] font-[500] text-gray-600"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => {
                      set_title(e.target.value);
                    }}
                    placeholder="Enter title"
                    className="w-full mt-[8px] rounded-[5px] placeholder-gray-500 outline-brand_color text-[14px] h-[45px] border-[1px] border-[#eee] p-[15px]"
                  />
                </div>
              </div>

      <div className="w-[100%] mt-[15px]">
        <label htmlFor="reviews" className="text-[15px] font-[500] text-gray-600">
         Description <span className="text-red-500">*</span>
        </label>
        <textarea  name="description"
          value={description}
            onChange={(e)=>{setdescription(e.target.value)}}
          placeholder="Description"
          className="w-full mt-[8px] rounded-[5px] placeholder-gray-500 outline-brand_color text-[14px] h-[200px] border-[1px] border-[#eee] p-[15px]"
        ></textarea>
      </div>

              <div className="w-[100%] mt-[15px]">
                <label
                  htmlFor="reviews"
                  className="text-[15px] font-[500] text-gray-600"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={description}
                  onChange={(e) => {
                    setdescription(e.target.value);
                  }}
                  placeholder="Description"
                  className="w-full mt-[8px] rounded-[5px] placeholder-gray-500 outline-brand_color text-[14px] h-[45px] border-[1px] border-[#eee] p-[15px]"
                />
              </div>

              <div className="flex justify-end items-center gap-[10px]">
                <button
                  type="submit"
                  className="px-[30px] w-full h-[50px] mt-[15px] text-white text-[14px] gap-[8px] bg-indigo-500 flex justify-center items-center rounded-[5px] cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
            {/* -------------------form---------------------- */}
          </section>
          {/* ------------------------new category-------------------- */}

          {/* --------------------category-table------------------ */}
        </section>
      </section>
    </section>
  );
};

export default Addacievement;
