import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  responseType: "json",
});
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const apiRequest = async ({ url, token, method, data }) => {
  console.log("token", token);
  try {
    const result = await api(url, {
      method: method || "GET",
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result;
  } catch (error) {
    console.error(
      "API request error:",
      error.response ? error.response.data : error.message
    );
    return {
      status: error.response ? error.response.status : 500,
      message: error.response
        ? error.response.data.message
        : "An unknown error occurred",
    };
  }
};

export const fileConverter = async (fileItem) => {
  const file = fileItem[0].file;
  if (file) {
    const base64 = await fileToBase64(file);
    const checksum = await calculateChecksum(file);
    const payload = {
      base64,
      fileName: file.name,
      fileType: file.type,
      checksum,
    };
    return payload;
  }
};
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function calculateChecksum(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const updateURL = ({
  pageNum,
  query,
  cmpLoc,
  sort,
  navigate,
  location,
  jType,
  exp,
}) => {
  const searchParams = new URLSearchParams();
  if (pageNum && pageNum > 1) {
    searchParams.append("page", pageNum);
  }
  if (query) {
    searchParams.append("search", query);
  }
  if (cmpLoc) {
    searchParams.append("location", cmpLoc);
  }
  if (sort) {
    searchParams.append("sort", sort);
  }
  if (jType) {
    searchParams.append("jType", jType);
  }
  if (exp) {
    searchParams.append("exp", exp);
  }
  const newURL = `${location.pathname}?${searchParams.toString()}`;
  navigate(newURL, { replace: true });
  return newURL;
};
