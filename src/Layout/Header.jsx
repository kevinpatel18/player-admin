import logo from "../assets/Images/Logo.png";
import ProfileLogo from "../assets/Images/Profile-icon.png";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../hooks/MyContextProvider";
import { LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useBreakPoints from "../hooks/useBreakPoints";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLaptop, isTablet } = useBreakPoints();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarData, setSidebarData] = useState([]);

  useEffect(() => {
    let arr = [
      {
        id: "venue",
        link: "/venue-configruation",
        title: "Booking Overview",
        icon: (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.0733 6.98821L18.5027 5.99813C18.02 5.16037 16.9503 4.87136 16.1114 5.35206V5.35206C15.7121 5.5873 15.2356 5.65404 14.787 5.53756C14.3384 5.42108 13.9546 5.13096 13.7201 4.73116C13.5693 4.47703 13.4882 4.18759 13.4852 3.8921V3.8921C13.4988 3.41835 13.3201 2.95927 12.9897 2.61943C12.6593 2.27959 12.2055 2.08794 11.7316 2.08813H10.582C10.1177 2.08813 9.67254 2.27315 9.34501 2.60226C9.01747 2.93138 8.83459 3.37744 8.83682 3.84176V3.84176C8.82306 4.80041 8.04195 5.57031 7.08319 5.57021C6.7877 5.56714 6.49826 5.4861 6.24414 5.33527V5.33527C5.40523 4.85458 4.33553 5.14359 3.85284 5.98135L3.24033 6.98821C2.75822 7.82493 3.04329 8.89395 3.87801 9.37952V9.37952C4.42059 9.69277 4.75483 10.2717 4.75483 10.8982C4.75483 11.5247 4.42059 12.1036 3.87801 12.4169V12.4169C3.04435 12.8992 2.75897 13.9656 3.24033 14.7998V14.7998L3.81927 15.7983C4.04543 16.2064 4.42489 16.5075 4.87369 16.6351C5.32248 16.7626 5.80359 16.7061 6.21058 16.4779V16.4779C6.61067 16.2445 7.08743 16.1805 7.5349 16.3002C7.98238 16.42 8.36347 16.7135 8.59349 17.1156C8.74431 17.3697 8.82536 17.6592 8.82843 17.9546V17.9546C8.82843 18.9231 9.61355 19.7083 10.582 19.7083H11.7316C12.6968 19.7083 13.4806 18.9283 13.4852 17.963V17.963C13.4829 17.4973 13.667 17.0499 13.9963 16.7206C14.3257 16.3912 14.773 16.2072 15.2388 16.2094C15.5336 16.2173 15.8218 16.298 16.0779 16.4444V16.4444C16.9146 16.9265 17.9836 16.6414 18.4692 15.8067V15.8067L19.0733 14.7998C19.3071 14.3984 19.3713 13.9204 19.2516 13.4716C19.1319 13.0227 18.8382 12.6401 18.4356 12.4085V12.4085C18.033 12.1769 17.7393 11.7943 17.6196 11.3454C17.4999 10.8966 17.5641 10.4186 17.7979 10.0172C17.95 9.75171 18.1701 9.53158 18.4356 9.37952V9.37952C19.2653 8.89422 19.5497 7.83143 19.0733 6.9966V6.9966V6.98821Z"
              stroke={
                location?.pathname === "/venue-configruation" ||
                activeTab === "venue"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <ellipse
              cx="11.1606"
              cy="10.8982"
              rx="2.41648"
              ry="2.41648"
              stroke={
                location?.pathname === "/venue-configruation" ||
                activeTab === "venue"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ),
      },
      {
        id: "revenue",
        link: "/revenue-analysis",
        title: "Revenue Summary",
        icon: (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.834 2.01662C12.2416 1.89637 11.6285 1.83325 11.0007 1.83325C5.93804 1.83325 1.83398 5.93731 1.83398 10.9999C1.83398 16.0625 5.93804 20.1666 11.0007 20.1666C16.0633 20.1666 20.1673 16.0625 20.1673 10.9999C20.1673 10.3721 20.1042 9.75895 19.984 9.16659"
              stroke={
                location?.pathname === "/revenue-analysis" ||
                activeTab === "revenue"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
            />
            <path
              d="M11.0013 8.24992C9.98878 8.24992 9.16797 8.86553 9.16797 9.62492C9.16797 10.3843 9.98878 10.9999 11.0013 10.9999C12.0138 10.9999 12.8346 11.6155 12.8346 12.3749C12.8346 13.1343 12.0138 13.7499 11.0013 13.7499M11.0013 8.24992C11.7995 8.24992 12.4786 8.63254 12.7303 9.16659M11.0013 8.24992V7.33325M11.0013 13.7499C10.2031 13.7499 9.52397 13.3673 9.27229 12.8333M11.0013 13.7499V14.6666"
              stroke={
                location?.pathname === "/revenue-analysis" ||
                activeTab === "revenue"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
            />
            <path
              d="M15.5783 5.5392C15.3429 5.77242 15.3411 6.15232 15.5743 6.38772C15.8076 6.62312 16.1875 6.62488 16.4229 6.39166L15.5783 5.5392ZM20.5864 2.26662C20.8218 2.0334 20.8235 1.6535 20.5903 1.4181C20.3571 1.1827 19.9772 1.18094 19.7418 1.41416L20.5864 2.26662ZM16.4714 6.21562L16.5761 5.62481L16.5761 5.62481L16.4714 6.21562ZM15.789 5.53299L15.1982 5.63752L15.1982 5.63752L15.789 5.53299ZM19.6977 7.01987C20.029 7.0244 20.3013 6.75947 20.3058 6.42813C20.3104 6.09679 20.0454 5.82451 19.7141 5.81998L19.6977 7.01987ZM16.1847 2.29051C16.1801 1.95917 15.9078 1.69426 15.5765 1.69882C15.2452 1.70337 14.9802 1.97567 14.9848 2.30701L16.1847 2.29051ZM16.4229 6.39166L20.5864 2.26662L19.7418 1.41416L15.5783 5.5392L16.4229 6.39166ZM16.5761 5.62481C16.4655 5.60523 16.3994 5.53921 16.3798 5.42847L15.1982 5.63752C15.3055 6.24427 15.7599 6.69894 16.3668 6.80643L16.5761 5.62481ZM16.3668 6.80643C17.2886 6.96968 18.9288 7.00934 19.6977 7.01987L19.7141 5.81998C18.9206 5.80912 17.3837 5.76785 16.5761 5.62481L16.3668 6.80643ZM14.9848 2.30701C14.9954 3.07588 15.0351 4.71582 15.1982 5.63752L16.3798 5.42847C16.2369 4.62075 16.1956 3.08391 16.1847 2.29051L14.9848 2.30701Z"
              fill={
                location?.pathname === "/revenue-analysis" ||
                activeTab === "revenue"
                  ? "white"
                  : "black"
              }
            />
          </svg>
        ),
      },
      {
        id: "user",
        link: "/user",
        title: "Manage User",
        icon: (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.79136 13.9397C12.1729 13.9397 15.0632 14.4521 15.0632 16.499C15.0632 18.5459 12.1922 19.073 8.79136 19.073C5.40886 19.073 2.51953 18.5652 2.51953 16.5174C2.51953 14.4695 5.38961 13.9397 8.79136 13.9397Z"
              stroke={
                location?.pathname === "/user" || activeTab === "user"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.79198 11.0182C6.57182 11.0182 4.77148 9.21875 4.77148 6.99859C4.77148 4.77842 6.57182 2.979 8.79198 2.979C11.0112 2.979 12.8116 4.77842 12.8116 6.99859C12.8198 9.2105 11.0323 11.0099 8.8204 11.0182H8.79198Z"
              stroke={
                location?.pathname === "/user" || activeTab === "user"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.1094 9.97483C16.577 9.76858 17.7072 8.50908 17.71 6.98467C17.71 5.48225 16.6145 4.23558 15.1781 4"
              stroke={
                location?.pathname === "/user" || activeTab === "user"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17.0449 13.5046C18.4667 13.7164 19.4594 14.2151 19.4594 15.2417C19.4594 15.9485 18.9919 16.4068 18.2366 16.6937"
              stroke={
                location?.pathname === "/user" || activeTab === "user"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ),
      },
      {
        id: "rating",
        link: "/rating",
        title: "Rating",
        icon: (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.79136 13.9397C12.1729 13.9397 15.0632 14.4521 15.0632 16.499C15.0632 18.5459 12.1922 19.073 8.79136 19.073C5.40886 19.073 2.51953 18.5652 2.51953 16.5174C2.51953 14.4695 5.38961 13.9397 8.79136 13.9397Z"
              stroke={
                location?.pathname === "/rating" || activeTab === "rating"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.79198 11.0182C6.57182 11.0182 4.77148 9.21875 4.77148 6.99859C4.77148 4.77842 6.57182 2.979 8.79198 2.979C11.0112 2.979 12.8116 4.77842 12.8116 6.99859C12.8198 9.2105 11.0323 11.0099 8.8204 11.0182H8.79198Z"
              stroke={
                location?.pathname === "/rating" || activeTab === "rating"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.1094 9.97483C16.577 9.76858 17.7072 8.50908 17.71 6.98467C17.71 5.48225 16.6145 4.23558 15.1781 4"
              stroke={
                location?.pathname === "/rating" || activeTab === "rating"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17.0449 13.5046C18.4667 13.7164 19.4594 14.2151 19.4594 15.2417C19.4594 15.9485 18.9919 16.4068 18.2366 16.6937"
              stroke={
                location?.pathname === "/rating" || activeTab === "rating"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ),
      },
      // {
      //   id: "payment-management",
      //   link: "/payment-management",
      //   title: "Manage Payment",
      //   icon: (
      //     <svg
      //       width="20"
      //       height="20"
      //       viewBox="0 0 20 20"
      //       fill={
      //         location?.pathname === "/payment-management" ||
      //         activeTab === "payment-management"
      //           ? "black"
      //           : "white"
      //       }
      //       xmlns="http://www.w3.org/2000/svg"
      //     >
      //       <path
      //         d="M11.834 1.01662C11.2416 0.896374 10.6285 0.833252 10.0007 0.833252C4.93804 0.833252 0.833984 4.93731 0.833984 9.99992C0.833984 15.0625 4.93804 19.1666 10.0007 19.1666C15.0633 19.1666 19.1673 15.0625 19.1673 9.99992C19.1673 9.37206 19.1042 8.75895 18.984 8.16659"
      //         stroke={
      //           location?.pathname === "/payment-management" ||
      //           activeTab === "payment-management"
      //             ? "white"
      //             : "black"
      //         }
      //         stroke-width="1.2"
      //         stroke-linecap="round"
      //       />
      //       <path
      //         d="M10.0013 7.24992C8.98878 7.24992 8.16797 7.86553 8.16797 8.62492C8.16797 9.38431 8.98878 9.99992 10.0013 9.99992C11.0138 9.99992 11.8346 10.6155 11.8346 11.3749C11.8346 12.1343 11.0138 12.7499 10.0013 12.7499M10.0013 7.24992C10.7995 7.24992 11.4786 7.63254 11.7303 8.16659M10.0013 7.24992V6.33325M10.0013 12.7499C9.20306 12.7499 8.52397 12.3673 8.27229 11.8333M10.0013 12.7499V13.6666"
      //         stroke={
      //           location?.pathname === "/payment-management" ||
      //           activeTab === "payment-management"
      //             ? "white"
      //             : "black"
      //         }
      //         stroke-width="1.2"
      //         stroke-linecap="round"
      //       />
      //       <path
      //         d="M14.5783 4.5392C14.3429 4.77242 14.3411 5.15232 14.5743 5.38772C14.8076 5.62312 15.1875 5.62488 15.4229 5.39166L14.5783 4.5392ZM19.5864 1.26662C19.8218 1.0334 19.8235 0.653501 19.5903 0.418102C19.3571 0.182703 18.9772 0.18094 18.7418 0.414165L19.5864 1.26662ZM15.4714 5.21562L15.5761 4.62481L15.5761 4.62481L15.4714 5.21562ZM14.789 4.53299L14.1982 4.63752L14.1982 4.63752L14.789 4.53299ZM18.6977 6.01987C19.029 6.0244 19.3013 5.75947 19.3058 5.42813C19.3104 5.09679 19.0454 4.82451 18.7141 4.81998L18.6977 6.01987ZM15.1847 1.29051C15.1801 0.95917 14.9078 0.69426 14.5765 0.698817C14.2452 0.703374 13.9802 0.975672 13.9848 1.30701L15.1847 1.29051ZM15.4229 5.39166L19.5864 1.26662L18.7418 0.414165L14.5783 4.5392L15.4229 5.39166ZM15.5761 4.62481C15.4655 4.60523 15.3994 4.53921 15.3798 4.42847L14.1982 4.63752C14.3055 5.24427 14.7599 5.69894 15.3668 5.80643L15.5761 4.62481ZM15.3668 5.80643C16.2886 5.96968 17.9288 6.00934 18.6977 6.01987L18.7141 4.81998C17.9206 4.80912 16.3837 4.76785 15.5761 4.62481L15.3668 5.80643ZM13.9848 1.30701C13.9954 2.07588 14.0351 3.71582 14.1982 4.63752L15.3798 4.42847C15.2369 3.62075 15.1956 2.08391 15.1847 1.29051L13.9848 1.30701Z"
      //         fill={
      //           location?.pathname === "/payment-management" ||
      //           activeTab === "payment-management"
      //             ? "white"
      //             : "black"
      //         }
      //       />
      //     </svg>
      //   ),
      // },
    ];

    if (user?.role === "admin" && !arr?.find((er) => er?.id === "other")) {
      arr.push({
        id: "other",

        title: "Other",
        icon: (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.0733 6.98821L18.5027 5.99813C18.02 5.16037 16.9503 4.87136 16.1114 5.35206V5.35206C15.7121 5.5873 15.2356 5.65404 14.787 5.53756C14.3384 5.42108 13.9546 5.13096 13.7201 4.73116C13.5693 4.47703 13.4882 4.18759 13.4852 3.8921V3.8921C13.4988 3.41835 13.3201 2.95927 12.9897 2.61943C12.6593 2.27959 12.2055 2.08794 11.7316 2.08813H10.582C10.1177 2.08813 9.67254 2.27315 9.34501 2.60226C9.01747 2.93138 8.83459 3.37744 8.83682 3.84176V3.84176C8.82306 4.80041 8.04195 5.57031 7.08319 5.57021C6.7877 5.56714 6.49826 5.4861 6.24414 5.33527V5.33527C5.40523 4.85458 4.33553 5.14359 3.85284 5.98135L3.24033 6.98821C2.75822 7.82493 3.04329 8.89395 3.87801 9.37952V9.37952C4.42059 9.69277 4.75483 10.2717 4.75483 10.8982C4.75483 11.5247 4.42059 12.1036 3.87801 12.4169V12.4169C3.04435 12.8992 2.75897 13.9656 3.24033 14.7998V14.7998L3.81927 15.7983C4.04543 16.2064 4.42489 16.5075 4.87369 16.6351C5.32248 16.7626 5.80359 16.7061 6.21058 16.4779V16.4779C6.61067 16.2445 7.08743 16.1805 7.5349 16.3002C7.98238 16.42 8.36347 16.7135 8.59349 17.1156C8.74431 17.3697 8.82536 17.6592 8.82843 17.9546V17.9546C8.82843 18.9231 9.61355 19.7083 10.582 19.7083H11.7316C12.6968 19.7083 13.4806 18.9283 13.4852 17.963V17.963C13.4829 17.4973 13.667 17.0499 13.9963 16.7206C14.3257 16.3912 14.773 16.2072 15.2388 16.2094C15.5336 16.2173 15.8218 16.298 16.0779 16.4444V16.4444C16.9146 16.9265 17.9836 16.6414 18.4692 15.8067V15.8067L19.0733 14.7998C19.3071 14.3984 19.3713 13.9204 19.2516 13.4716C19.1319 13.0227 18.8382 12.6401 18.4356 12.4085V12.4085C18.033 12.1769 17.7393 11.7943 17.6196 11.3454C17.4999 10.8966 17.5641 10.4186 17.7979 10.0172C17.95 9.75171 18.1701 9.53158 18.4356 9.37952V9.37952C19.2653 8.89422 19.5497 7.83143 19.0733 6.9966V6.9966V6.98821Z"
              stroke={
                location?.pathname === "/venue-configruation" ||
                activeTab === "venue"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <ellipse
              cx="11.1606"
              cy="10.8982"
              rx="2.41648"
              ry="2.41648"
              stroke={
                location?.pathname === "/venue-configruation" ||
                activeTab === "venue"
                  ? "white"
                  : "black"
              }
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ),

        subMenu: [
          {
            id: "real-time-booking-list",
            link: "/real-time-booking-list",
            title: "Live Booking",
            icon: (
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.348 1.83325C17.3274 1.83325 16.5 4.29569 16.5 7.33325H18.348C19.2387 7.33325 19.684 7.33325 19.9596 7.02575C20.2353 6.71825 20.1873 6.3133 20.0913 5.50341C19.838 3.3654 19.1531 1.83325 18.348 1.83325Z"
                  stroke={
                    location?.pathname === "/real-time-booking-list" ||
                    activeTab === "real-time-booking-list"
                      ? "white"
                      : "black"
                  }
                  stroke-width="1.2"
                />
                <path
                  d="M16.5007 7.38299V17.0919C16.5007 18.4776 16.5007 19.1704 16.0772 19.4432C15.3852 19.8889 14.3154 18.9542 13.7773 18.6149C13.3328 18.3346 13.1105 18.1944 12.8638 18.1863C12.5972 18.1775 12.371 18.312 11.8906 18.6149L10.139 19.7196C9.66648 20.0176 9.43021 20.1666 9.16732 20.1666C8.90442 20.1666 8.66815 20.0176 8.19565 19.7196L6.44402 18.6149C5.99945 18.3346 5.77717 18.1944 5.53047 18.1863C5.26389 18.1775 5.03767 18.312 4.55729 18.6149C4.01927 18.9542 2.94945 19.8889 2.25744 19.4432C1.83398 19.1704 1.83398 18.4776 1.83398 17.0919V7.38299C1.83398 4.76682 1.83398 3.45873 2.63944 2.64599C3.4449 1.83325 4.74126 1.83325 7.33398 1.83325H18.334"
                  stroke={
                    location?.pathname === "/real-time-booking-list" ||
                    activeTab === "real-time-booking-list"
                      ? "white"
                      : "black"
                  }
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.16732 7.33317C8.1548 7.33317 7.33398 7.94878 7.33398 8.70817C7.33398 9.46756 8.1548 10.0832 9.16732 10.0832C10.1798 10.0832 11.0007 10.6988 11.0007 11.4582C11.0007 12.2176 10.1798 12.8332 9.16732 12.8332M9.16732 7.33317C9.96556 7.33317 10.6447 7.71579 10.8963 8.24984M9.16732 7.33317V6.4165M9.16732 12.8332C8.36907 12.8332 7.68998 12.4506 7.4383 11.9165M9.16732 12.8332V13.7498"
                  stroke={
                    location?.pathname === "/real-time-booking-list" ||
                    activeTab === "real-time-booking-list"
                      ? "white"
                      : "black"
                  }
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
            ),
          },
          {
            id: "payment-management",
            link: "/manage-venue",
            title: "Manage Venue",
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill={
                  location?.pathname === "/manage-venue" ||
                  activeTab === "manage-venue"
                    ? "black"
                    : "white"
                }
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.834 1.01662C11.2416 0.896374 10.6285 0.833252 10.0007 0.833252C4.93804 0.833252 0.833984 4.93731 0.833984 9.99992C0.833984 15.0625 4.93804 19.1666 10.0007 19.1666C15.0633 19.1666 19.1673 15.0625 19.1673 9.99992C19.1673 9.37206 19.1042 8.75895 18.984 8.16659"
                  stroke={
                    location?.pathname === "/manage-venue" ||
                    activeTab === "manage-venue"
                      ? "white"
                      : "black"
                  }
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <path
                  d="M10.0013 7.24992C8.98878 7.24992 8.16797 7.86553 8.16797 8.62492C8.16797 9.38431 8.98878 9.99992 10.0013 9.99992C11.0138 9.99992 11.8346 10.6155 11.8346 11.3749C11.8346 12.1343 11.0138 12.7499 10.0013 12.7499M10.0013 7.24992C10.7995 7.24992 11.4786 7.63254 11.7303 8.16659M10.0013 7.24992V6.33325M10.0013 12.7499C9.20306 12.7499 8.52397 12.3673 8.27229 11.8333M10.0013 12.7499V13.6666"
                  stroke={
                    location?.pathname === "/manage-venue" ||
                    activeTab === "manage-venue"
                      ? "white"
                      : "black"
                  }
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <path
                  d="M14.5783 4.5392C14.3429 4.77242 14.3411 5.15232 14.5743 5.38772C14.8076 5.62312 15.1875 5.62488 15.4229 5.39166L14.5783 4.5392ZM19.5864 1.26662C19.8218 1.0334 19.8235 0.653501 19.5903 0.418102C19.3571 0.182703 18.9772 0.18094 18.7418 0.414165L19.5864 1.26662ZM15.4714 5.21562L15.5761 4.62481L15.5761 4.62481L15.4714 5.21562ZM14.789 4.53299L14.1982 4.63752L14.1982 4.63752L14.789 4.53299ZM18.6977 6.01987C19.029 6.0244 19.3013 5.75947 19.3058 5.42813C19.3104 5.09679 19.0454 4.82451 18.7141 4.81998L18.6977 6.01987ZM15.1847 1.29051C15.1801 0.95917 14.9078 0.69426 14.5765 0.698817C14.2452 0.703374 13.9802 0.975672 13.9848 1.30701L15.1847 1.29051ZM15.4229 5.39166L19.5864 1.26662L18.7418 0.414165L14.5783 4.5392L15.4229 5.39166ZM15.5761 4.62481C15.4655 4.60523 15.3994 4.53921 15.3798 4.42847L14.1982 4.63752C14.3055 5.24427 14.7599 5.69894 15.3668 5.80643L15.5761 4.62481ZM15.3668 5.80643C16.2886 5.96968 17.9288 6.00934 18.6977 6.01987L18.7141 4.81998C17.9206 4.80912 16.3837 4.76785 15.5761 4.62481L15.3668 5.80643ZM13.9848 1.30701C13.9954 2.07588 14.0351 3.71582 14.1982 4.63752L15.3798 4.42847C15.2369 3.62075 15.1956 2.08391 15.1847 1.29051L13.9848 1.30701Z"
                  fill={
                    location?.pathname === "/manage-venue" ||
                    activeTab === "manage-venue"
                      ? "white"
                      : "black"
                  }
                />
              </svg>
            ),
          },
        ],
      });
    }

    // if (
    //   user?.role === "admin" &&
    //   !arr?.find((er) => er?.link === "/manage-venue")
    // ) {
    //   arr.push({
    //     id: "payment-management",
    //     link: "/manage-venue",
    //     title: "Manage Venue",
    //     icon: (
    //       <svg
    //         width="20"
    //         height="20"
    //         viewBox="0 0 20 20"
    //         fill={
    //           location?.pathname === "/manage-venue" ||
    //           activeTab === "manage-venue"
    //             ? "black"
    //             : "white"
    //         }
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           d="M11.834 1.01662C11.2416 0.896374 10.6285 0.833252 10.0007 0.833252C4.93804 0.833252 0.833984 4.93731 0.833984 9.99992C0.833984 15.0625 4.93804 19.1666 10.0007 19.1666C15.0633 19.1666 19.1673 15.0625 19.1673 9.99992C19.1673 9.37206 19.1042 8.75895 18.984 8.16659"
    //           stroke={
    //             location?.pathname === "/manage-venue" ||
    //             activeTab === "manage-venue"
    //               ? "white"
    //               : "black"
    //           }
    //           stroke-width="1.2"
    //           stroke-linecap="round"
    //         />
    //         <path
    //           d="M10.0013 7.24992C8.98878 7.24992 8.16797 7.86553 8.16797 8.62492C8.16797 9.38431 8.98878 9.99992 10.0013 9.99992C11.0138 9.99992 11.8346 10.6155 11.8346 11.3749C11.8346 12.1343 11.0138 12.7499 10.0013 12.7499M10.0013 7.24992C10.7995 7.24992 11.4786 7.63254 11.7303 8.16659M10.0013 7.24992V6.33325M10.0013 12.7499C9.20306 12.7499 8.52397 12.3673 8.27229 11.8333M10.0013 12.7499V13.6666"
    //           stroke={
    //             location?.pathname === "/manage-venue" ||
    //             activeTab === "manage-venue"
    //               ? "white"
    //               : "black"
    //           }
    //           stroke-width="1.2"
    //           stroke-linecap="round"
    //         />
    //         <path
    //           d="M14.5783 4.5392C14.3429 4.77242 14.3411 5.15232 14.5743 5.38772C14.8076 5.62312 15.1875 5.62488 15.4229 5.39166L14.5783 4.5392ZM19.5864 1.26662C19.8218 1.0334 19.8235 0.653501 19.5903 0.418102C19.3571 0.182703 18.9772 0.18094 18.7418 0.414165L19.5864 1.26662ZM15.4714 5.21562L15.5761 4.62481L15.5761 4.62481L15.4714 5.21562ZM14.789 4.53299L14.1982 4.63752L14.1982 4.63752L14.789 4.53299ZM18.6977 6.01987C19.029 6.0244 19.3013 5.75947 19.3058 5.42813C19.3104 5.09679 19.0454 4.82451 18.7141 4.81998L18.6977 6.01987ZM15.1847 1.29051C15.1801 0.95917 14.9078 0.69426 14.5765 0.698817C14.2452 0.703374 13.9802 0.975672 13.9848 1.30701L15.1847 1.29051ZM15.4229 5.39166L19.5864 1.26662L18.7418 0.414165L14.5783 4.5392L15.4229 5.39166ZM15.5761 4.62481C15.4655 4.60523 15.3994 4.53921 15.3798 4.42847L14.1982 4.63752C14.3055 5.24427 14.7599 5.69894 15.3668 5.80643L15.5761 4.62481ZM15.3668 5.80643C16.2886 5.96968 17.9288 6.00934 18.6977 6.01987L18.7141 4.81998C17.9206 4.80912 16.3837 4.76785 15.5761 4.62481L15.3668 5.80643ZM13.9848 1.30701C13.9954 2.07588 14.0351 3.71582 14.1982 4.63752L15.3798 4.42847C15.2369 3.62075 15.1956 2.08391 15.1847 1.29051L13.9848 1.30701Z"
    //           fill={
    //             location?.pathname === "/manage-venue" ||
    //             activeTab === "manage-venue"
    //               ? "white"
    //               : "black"
    //           }
    //         />
    //       </svg>
    //     ),
    //   });
    // }

    if (user?.role === "venueStaff") {
      setSidebarData([
        {
          id: "venue",
          link: "/venue-configruation",
          title: "Venue Configuration",
          icon: (
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.0733 6.98821L18.5027 5.99813C18.02 5.16037 16.9503 4.87136 16.1114 5.35206V5.35206C15.7121 5.5873 15.2356 5.65404 14.787 5.53756C14.3384 5.42108 13.9546 5.13096 13.7201 4.73116C13.5693 4.47703 13.4882 4.18759 13.4852 3.8921V3.8921C13.4988 3.41835 13.3201 2.95927 12.9897 2.61943C12.6593 2.27959 12.2055 2.08794 11.7316 2.08813H10.582C10.1177 2.08813 9.67254 2.27315 9.34501 2.60226C9.01747 2.93138 8.83459 3.37744 8.83682 3.84176V3.84176C8.82306 4.80041 8.04195 5.57031 7.08319 5.57021C6.7877 5.56714 6.49826 5.4861 6.24414 5.33527V5.33527C5.40523 4.85458 4.33553 5.14359 3.85284 5.98135L3.24033 6.98821C2.75822 7.82493 3.04329 8.89395 3.87801 9.37952V9.37952C4.42059 9.69277 4.75483 10.2717 4.75483 10.8982C4.75483 11.5247 4.42059 12.1036 3.87801 12.4169V12.4169C3.04435 12.8992 2.75897 13.9656 3.24033 14.7998V14.7998L3.81927 15.7983C4.04543 16.2064 4.42489 16.5075 4.87369 16.6351C5.32248 16.7626 5.80359 16.7061 6.21058 16.4779V16.4779C6.61067 16.2445 7.08743 16.1805 7.5349 16.3002C7.98238 16.42 8.36347 16.7135 8.59349 17.1156C8.74431 17.3697 8.82536 17.6592 8.82843 17.9546V17.9546C8.82843 18.9231 9.61355 19.7083 10.582 19.7083H11.7316C12.6968 19.7083 13.4806 18.9283 13.4852 17.963V17.963C13.4829 17.4973 13.667 17.0499 13.9963 16.7206C14.3257 16.3912 14.773 16.2072 15.2388 16.2094C15.5336 16.2173 15.8218 16.298 16.0779 16.4444V16.4444C16.9146 16.9265 17.9836 16.6414 18.4692 15.8067V15.8067L19.0733 14.7998C19.3071 14.3984 19.3713 13.9204 19.2516 13.4716C19.1319 13.0227 18.8382 12.6401 18.4356 12.4085V12.4085C18.033 12.1769 17.7393 11.7943 17.6196 11.3454C17.4999 10.8966 17.5641 10.4186 17.7979 10.0172C17.95 9.75171 18.1701 9.53158 18.4356 9.37952V9.37952C19.2653 8.89422 19.5497 7.83143 19.0733 6.9966V6.9966V6.98821Z"
                stroke={
                  location?.pathname === "/venue-configruation" ||
                  activeTab === "venue"
                    ? "white"
                    : "black"
                }
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <ellipse
                cx="11.1606"
                cy="10.8982"
                rx="2.41648"
                ry="2.41648"
                stroke={
                  location?.pathname === "/venue-configruation" ||
                  activeTab === "venue"
                    ? "white"
                    : "black"
                }
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ),
        },
      ]);
    } else {
      setSidebarData(arr);
    }
    // eslint-disable-next-line
  }, [activeTab, location?.pathname]);

  console.log("isLaptop: ", isLaptop);
  const { user } = useContext(MyContext);
  return (
    <div class="" style={{ background: "rgb(255 255 255 /1)" }}>
      <nav class="flex px-4  md:shadow-lg items-center relative">
        <div
          class={`text-lg font-bold py-0 py-4 flex items-center justify-between ${
            isTablet && "w-full"
          }`}
        >
          <img alt="player" src={logo} className="h-8 w-auto" />
          {isTablet && (
            <LogOut
              onClick={() => {
                localStorage.clear();
                navigate("/login");
                window.location.reload();
              }}
              size={24}
            />
          )}
        </div>

        <ul class=" desktop-navbar nav-header md:px-2 ml-auto md:flex md:space-x-2 absolute md:relative top-full left-0 right-0">
          {sidebarData.map((item) =>
            item?.subMenu?.length > 0 ? (
              <li class="relative parent">
                <Link
                  class={`flex md:inline-flex m-4 items-center ${
                    location?.pathname === item?.link
                      ? "active p-2 text-white"
                      : "p-1"
                  }`}
                >
                  {item?.icon}

                  <span className="px-2"> {item.title}</span>
                </Link>
                <ul
                  style={{ zIndex: 999999999 }}
                  class="child transition duration-300 md:absolute top-full right-0 md:w-48 bg-white md:shadow-lg md:rounded-b "
                >
                  {item?.subMenu?.map((subItem) => (
                    <li className="flex justify-center">
                      <Link
                        to={subItem?.link}
                        class={`flex md:inline-flex m-4 items-center ${
                          location?.pathname === subItem?.link
                            ? "active p-2 text-white"
                            : "p-1"
                        }`}
                      >
                        {subItem?.icon}

                        <span className="px-2"> {subItem.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li className={``}>
                <Link
                  to={item?.link}
                  class={`flex md:inline-flex m-4 items-center ${
                    location?.pathname === item?.link
                      ? "active p-2 text-white"
                      : "p-1"
                  }`}
                >
                  {item?.icon}

                  <span className="px-2"> {item.title}</span>
                </Link>
              </li>
            )
          )}

          <li class="relative parent">
            <a
              href="#"
              class="flex justify-between md:inline-flex p-4 items-center hover:bg-gray-50 space-x-2"
            >
              <div>
                <img
                  src={ProfileLogo}
                  height={24}
                  width={24}
                  alt="profile-img"
                />
              </div>
              <span> {user?.username}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 fill-current pt-1"
                viewBox="0 0 24 24"
              >
                <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
              </svg>
            </a>
            <ul class="child transition duration-300 md:absolute top-full right-0 md:w-48 bg-white md:shadow-lg md:rounded-b ">
              <li>
                <Link
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                    window.location.reload();
                  }}
                  class="flex px-4 py-3 hover:bg-gray-50"
                >
                  Log Out
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
