# WiFi-Based Attendance Tracking

A university attendance tracking system that uses **WiFi connection logs** from Access Points (APs) and the **RADIUS server** to automatically determine student presence during lectures.
This project demonstrates how existing network infrastructure can be leveraged to automate attendance without manual input or additional hardware.

---

## 🚀 Overview

`wifi_based_attendance_tracking` is built with **Node.js**, **Express**, and **MySQL**.
It integrates data from WiFi access points and RADIUS authentication logs to infer attendance based on network activity during lecture times.

The system models a realistic university environment where backend logic and relational data design are applied to solve an everyday administrative problem efficiently and transparently.

---

## 🧠 Key Features

* **Automated Attendance Detection** – Marks attendance using WiFi session data.
* **Lecture-Time Mapping** – Matches WiFi session periods with scheduled class times.
* **RADIUS Integration** – Uses authentication data to verify student sessions.
* **Scalable Express Backend** – Clean modular routes for maintainability.
* **Relational Data Model** – Ensures consistency through foreign key relationships.

---

## 🗄️ Database Schema

The project’s database is designed to clearly represent the relationship between students, their groups, classes, access points, and attendance records.

Below is the entity-relationship diagram illustrating these connections.

### 🗺️ Database Diagram

[View Database ERD (PDF)](./database/database_erd_diagram.pdf)

---

### **Schema Overview**

| Table             | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| **Groups**        | Defines academic groups and educational years.                  |
| **Access_points** | Maps WiFi access points to physical locations.                  |
| **Classes**       | Represents lectures and sections, their schedule, and location. |
| **Students**      | Stores student info and group/class relationships.              |
| **Wifi_sessions** | Records every student WiFi connection session.                  |
| **Attendance**    | Tracks final attendance results based on WiFi activity.         |

### **Relationships**

* Each **Class** belongs to one **Group** and one **Access Point**.
* Each **Student** belongs to a **Group**, optionally linked to a **Class**.
* Each **WiFi Session** references both a **Student** and an **Access Point**.
* Each **Attendance** entry references a **Class**, **Student**, and **Group**.

---

## 💡 Example Flow

1. A student connects to the campus WiFi through an access point.
2. The RADIUS server logs the connection and records it in the `Wifi_sessions` table.
3. The backend processes session data and checks for overlaps with scheduled classes.
4. If the connection time aligns with the class’s duration and AP location, the student is marked as **attended** in the `Attendance` table.

---

## 🧰 Tech Stack

* **Backend:** Node.js, Express
* **Database:** MySQL
* **Other:** dotenv, CORS, MySQL2 (Promise API)

---

## 📜 License

This project is released under the Apache-2.0 License.
