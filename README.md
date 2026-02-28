# Hotel Management System

Hotel Management System is a full-stack web application developed to support and streamline core hotel management operations. The platform enables hotel staff and guests to efficiently manage rooms, reservations, and user accounts through a modern web interface backed by a structured and scalable backend system.

The application is implemented using **Spring Boot** for the backend and **React** for the frontend, following a modular architecture that clearly separates the presentation layer, business logic, and data access components. This architectural approach improves maintainability, facilitates testing, and supports future system scalability.

Beyond the core management functionality, the system integrates an **AI-based support assistant** designed to enhance the user experience by providing quick assistance related to reservations, room availability, and general hotel services.

A key objective of the project was to emphasize software quality and reliability. For this reason, automated unit tests were implemented to validate the correctness of the business logic and ensure that the application behaves consistently across different scenarios.

# Technologies Used

## Backend

* Java
* Spring Boot
* Spring Data JPA
* Maven
* REST API
* MySQL

## Frontend

* React
* JavaScript
* HTML
* CSS

## Testing

* JUnit 5
* Mockito
* Automated Unit Testing

## Development Tools

* IntelliJ IDEA
* Git
* GitHub

---

# System Architecture

The application follows a **layered architecture**, which separates the system into several logical layers in order to ensure maintainability and scalability.

The backend is organized into the following main components:

Controller Layer
Handles HTTP requests and exposes REST endpoints used by the frontend application.

Service Layer
Contains the core business logic of the system and coordinates the interaction between controllers and repositories.

Repository Layer
Responsible for database operations and communication with the persistence layer using Spring Data JPA.

Model Layer
Defines the core entities used in the system such as users, rooms and reservations.

This architecture ensures a clear separation of responsibilities and makes the system easier to maintain and test.

---

# Application Features

The application provides multiple functionalities designed to support hotel management operations.

Main features include:

User registration and authentication
Guests and employees can create accounts and log into the system.

Room management
Rooms can be added, updated, viewed or removed from the system.

Reservation management
Guests can create reservations for available rooms while employees can manage and monitor existing bookings.

Guest management
The system stores information about guests and allows employees to manage guest-related data.

Room assignment
Guests can be assigned to specific rooms based on reservation information.

Reservation monitoring
Employees can view and manage all reservations within the system.

AI Support Assistant
An integrated AI assistant provides support to users by answering questions related to reservations, hotel services or general system usage.

---

# AI Support Assistant

The application integrates an AI-based assistant designed to improve the user experience.

The assistant can provide information related to:

* room availability
* reservation procedures
* hotel services
* general system usage

By integrating AI support directly into the interface, guests can quickly obtain assistance without needing direct interaction with hotel staff.

---

# Automated Testing

Software testing plays an important role in ensuring that the application functions correctly and reliably.

For this project, **automated unit tests** were implemented to verify the behavior of the system’s business logic.

Automated tests allow developers to validate functionality repeatedly without manual intervention, ensuring that modifications to the code do not introduce unexpected errors.

The tests focus mainly on the **service layer**, where most of the business logic is implemented.

---

# Testing Technologies

JUnit 5
JUnit is a popular Java testing framework used for writing and executing automated unit tests.

Mockito
Mockito is a testing library that allows the creation of **mock objects**, enabling the isolation of components during testing.

Mock objects simulate the behavior of dependencies such as repositories, allowing tests to verify only the service layer logic without interacting with a real database.

---

# Implemented Test Scenarios

The automated tests validate multiple scenarios such as:

* successful user registration
* login validation
* creating valid reservations
* preventing invalid reservations
* updating room information
* searching rooms by price range
* preventing deletion of rooms with active reservations

All tests were executed successfully, confirming the correctness of the application logic.

---

# Running the Application

## Backend

Navigate to the backend directory and start the Spring Boot application:

cd hotel_app
mvn spring-boot:run

The backend server will start on:

http://localhost:8080

---

## Frontend

Navigate to the frontend directory and start the React application:

cd hotel-frontend
npm install
npm start

The frontend interface will be available at:

http://localhost:3000

---

# Running Automated Tests

Automated tests can be executed using the following command:

mvn test

Tests can also be executed directly from **IntelliJ IDEA**.

---

# Author

Alexandra-Maria Bîrlea  
MSc Student – Applied Computer Science  
Faculty of Automation and Computer Science  
Technical University of Cluj-Napoca  

