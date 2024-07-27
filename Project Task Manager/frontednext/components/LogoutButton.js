"use client";

import { useTasks } from "../context/TaskContext";
import logoutIcon from "../public/image/logout.png";
import Image from "next/image";
import styles from "../app/style/style.module.css";

const LogoutButton = () => {
  const { logout } = useTasks();

  const handleLogout = () => {
    logout();
  };

  return (
    <Image
      className={styles.logoutButton}
      src={logoutIcon}
      alt="Logout"
      width={44}
      height={44}
      onClick={handleLogout}
    />
  );
};

export default LogoutButton;
