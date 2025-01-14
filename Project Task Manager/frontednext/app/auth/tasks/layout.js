import { AuthProvider } from '../../../context/AuthContext';
import { Toaster } from "react-hot-toast";
import styles from "../../style/style.module.css"
import {Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
title: 'Create Next App',
description: 'Generated by create next app',
};

export default function RootLayout({ children, initialTasks }) {
return (
   
      <AuthProvider>
        <div className={styles.boxStyle}>

          <div className={styles.header}>
            <h6 className={styles.titleTasks}>Tasks</h6>
            <h5 className={styles.titleMyTasks}>Mis tareas</h5>
            <hr />
            {children}

          </div>

        </div>
      </AuthProvider>
    
);
}