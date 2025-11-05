# 🎨 AI-Powered Event Management System – Frontend

## 🧾 Description
This repository contains the **frontend** of the AI-Powered Event Management System.  
The system leverages AI to assist organizers in managing events, distributing missions, and assigning staff efficiently.  
It provides a user-friendly interface with dashboards for Admins, Organizers, Managers, and Staff, allowing smooth collaboration throughout the event lifecycle.

---

## 🧠 Workflow Overview
- **Admin** creates users (Organizer, Manager, Staff) and can change their roles.  
- **Organizer** creates events, requests AI suggestions for mission distribution, and assigns staff.  
- **Manager** reviews and approves or edits task distributions splitted by AI.  
- **Staff** views tasks and updates progress status.  

---

## 🧩 User Stories

### 👑 As an Admin
- **US-01:** As an Admin, I want to create and edit user accounts (Organizer, Manager, Staff) to ensure full control over the system.  
- **US-02:** As an Admin, I want to delete inactive companies to protect data.  

### 🎯 As an Organizer
- **US-03:** As an Organizer, I want to add a new company to organize my events.  
- **US-04:** As an Organizer, I want to create a new event with details to plan the occasion.  
- **US-05:** As an Organizer, I want to add a mission for each event and assign them to a manager with a team to ensure execution.  
- **US-06:** As an Organizer, I want to request AI suggestions for the missions.  
- **US-07:** As an Organizer, I want to create teams to distribute staff based on the event type.  

### 🧑‍💼 As a Manager
- **US-08:** As a Manager, I want to view the events ,teams and missions assigned to me.  
- **US-09:** As a Manager, I want to aporve the task distribution suggested by the AI.   
- **US-10:** As a Manager, I want to request additional AI suggestions to enhance task distribution.  

### 👩‍🔧 As a Staff
- **US-11:** As a Staff, I want to view a list of my assigned tasks to know my responsibilities.  
- **US-12:** As a Staff, I want to update my task status (e.g., from "In Progress" to "Completed") to track progress.  
- **US-13:** As a Staff, I want to delete unnecessary tasks with manager approval.  

---

## 🧰 Tech Stack
- **React.js (Vite)**  
- **Tailwind CSS**  
- **React Router DOM**  
- **Axios**  
- **Docker (optional)**  

---

## 🔗 Backend Repository
[Backend Repository Link](https://github.com/YOUR_USERNAME/backend-repo)

---

## 🌐 Live Frontend Link
[Deployed Frontend Link](https://YOUR_DEPLOYED_FRONTEND_URL)

---

## ⚙️ Installation Instructions

### 🐳 Using Docker
```bash
docker compose up --build
