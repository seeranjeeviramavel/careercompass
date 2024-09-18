import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { CustomButton, Loading, TextInput } from "../components";
import { NoProfile } from "../assets";
import {
  apiRequest,
  fileConverter,
  handleFileUpload,
  handleFileUploadResume,
} from "../utils/apiUtils";
import { Login } from "../redux/userSlice";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

const UserForm = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState("");
  const [uploadCv, setUploadCv] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);
    // const uri = profileImage
    //   ? await handleFileUpload(profileImage)
    //   : data.profileUrl;
    // const resumeUrl = uploadCv
    //   ? await handleFileUpload(uploadCv)
    //   : data.resumeUrl;
    // const newdata = { ...data, profileUrl: uri, resumeUrl };
    try {
      const res = await apiRequest({
        url: "/user/update-user",
        token: user?.token,
        data,
        method: "POST",
      });
      setIsLoading(false);
      console.log("Successfully updated profile", res);
      if (res.status === "failed") {
        d;
        setErrMsg(res.data.message);
      } else {
        const userData = { token: res.data.token, ...res.data.user };
        dispatch(Login(userData));
        localStorage.setItem("userInfo", JSON.stringify(userData));
        // window.location.reload();
        setOpen(false);
      }
    } catch (err) {
      setErrMsg(err.message);
      setIsLoading(false);
      console.log(err);
    }
  };

  const closeModal = () => setOpen(false);

  const handleProcessProfile = async(fileItem) => {
    const file = await fileConverter(fileItem);
    setValue("profileMetaData", file);

    
  };
  const handleProcessResume = async(fileItem) => {
    const file = await fileConverter(fileItem);
    setValue("resumeMetaData", file);
  };
  return (
    <>
      <Transition appear show={open ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Edit Profile
                  </Dialog.Title>
                  <form
                    className="w-full mt-2 flex flex-col gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="w-full flex gap-2">
                      <div className="w-1/2">
                        <TextInput
                          name="firstName"
                          label="First Name"
                          placeholder="James"
                          type="text"
                          register={register("firstName", {
                            required: "First Name is required",
                          })}
                          error={
                            errors.firstName ? errors.firstName?.message : ""
                          }
                        />
                      </div>
                      <div className="w-1/2">
                        <TextInput
                          name="lastName"
                          label="Last Name"
                          placeholder="Wagonner"
                          type="text"
                          register={register("lastName", {
                            required: "Last Name is required",
                          })}
                          error={
                            errors.lastName ? errors.lastName?.message : ""
                          }
                        />
                      </div>
                    </div>

                    <div className="w-full flex gap-2">
                      <div className="w-1/2">
                        <TextInput
                          name="contact"
                          label="Contact"
                          placeholder="Phone Number"
                          type="text"
                          register={register("contact", {
                            required: "Coontact is required!",
                          })}
                          error={errors.contact ? errors.contact?.message : ""}
                        />
                      </div>

                      <div className="w-1/2">
                        <TextInput
                          name="location"
                          label="Location"
                          placeholder="Location"
                          type="text"
                          register={register("location", {
                            required: "Location is required",
                          })}
                          error={
                            errors.location ? errors.location?.message : ""
                          }
                        />
                      </div>
                    </div>

                    <TextInput
                      name="jobTitle"
                      label="Job Title"
                      placeholder="Software Engineer"
                      type="text"
                      register={register("jobTitle", {
                        required: "Job Title is required",
                      })}
                      error={errors.jobTitle ? errors.jobTitle?.message : ""}
                    />

                        <label className="text-gray-600 text-sm mb-1">
                          Profile Picture
                        </label>
                        <FilePond
                          onupdatefiles={(file) => handleProcessProfile(file)}
                          acceptedFileTypes={["image/*"]}
                          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        />

                        <label className="text-gray-600 text-sm mb-1">
                          Resume
                        </label>
                        <FilePond
                          onupdatefiles={handleProcessResume}
                          acceptedFileTypes={["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
                          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        />
    

                    <div className="flex flex-col">
                      <label className="text-gray-600 text-sm mb-1">
                        About
                      </label>
                      <textarea
                        className="ounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                        rows={4}
                        cols={6}
                        {...register("about", {
                          required:
                            "Write a little bit about yourself and your projects",
                        })}
                        aria-invalid={errors.about ? "true" : "false"}
                      ></textarea>
                      {errors.about && (
                        <span
                          role="alert"
                          className="text-xs text-red-500 mt-0.5"
                        >
                          {errors.about?.message}
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <CustomButton
                          type="submit"
                          containerStyles="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none "
                          title={"Submit"}
                        />
                      )}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const userInfo = user;

  return (
    <div className="container mx-auto flex items-center justify-center py-10">
      <div className="w-full md:w-2/3 2xl:w-2/4 bg-white shadow-lg p-10 pb-20 rounded-lg">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profileUrl || NoProfile}
            alt="user profile"
            className="w-20 h-20 rounded-full object-cover mx-4"
          />
          <div className="flex flex-col items-start">
            <p className="text-lg font-semibold">
              {user?.firstName + " " + user?.lastName}
            </p>
            <span className="text-lg text-blue-600">
              {user?.jobTitle ?? user?.email}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mb-4">
          <h5
            className="text-blue-700 text-base font-bold cursor-pointer mt-4"
            onClick={() => setOpen(true)}
          >
            {userInfo?.jobTitle || "Add Job Title"}
          </h5>
          <div className="w-full flex flex-wrap lg:flex-row justify-between mt-5 text-sm">
            <p className="flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full">
              <HiLocationMarker /> {userInfo?.location ?? "No Location"}
            </p>
            <a
              className="flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full"
              href={`mailto:${userInfo?.email}`}
            >
              <AiOutlineMail /> {userInfo?.email ?? "No Email"}
            </a>
            <a
              className="flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full"
              href={`tel:${userInfo?.contact}`}
            >
              <FiPhoneCall /> {userInfo?.contact ?? "No Contact"}
            </a>
          </div>
        </div>

        <hr />

        <div className="w-full py-10">
          <p className="text-[#0536e7]  font-semibold text-2xl">ABOUT</p>
          <span className="text-base text-justify leading-7">
            {userInfo?.about ?? "No About Found"}
          </span>
        </div>
        <button
          className="w-full  bg-blue-600 text-white mt-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          Edit Profile
        </button>
      </div>

      <UserForm open={open} setOpen={setOpen} />
    </div>
  );
};

export default UserProfile;
