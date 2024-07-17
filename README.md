# Quizzy Plus

## Introduction
Quizy Plus is an educational web application designed to assist students in preparing for exams through interactive quizzes and a 24/7 chat assistant. Instead of merely studying from notes or PDFs, students can convert their study material into engaging quizzes. The application offers:

- Document-based question and answer generation.
- A chat assistant that serves as a study buddy.
- Detailed analytics and personalized recommendations based on quiz performance.

<img src="archi.png"/>

## Design Decisions
- Microservices Architecture: The application is divided into several microservices to ensure scalability and maintainability.
- Containerization: All services are containerized using Docker, which simplifies deployment and orchestration.
- Kubernetes: Used for service discovery, registration, and load balancing.
- RabbitMQ: Used as a message broker to handle long-running tasks and maintain the responsiveness of the system.

## Microservices
### Implementation Methods
We used Kubernetes for microservices orchestration, ensuring each service is independently scalable and manageable. Kubernetes handles the deployment, scaling, and operation of application containers across clusters of hosts.

### Core Services
#### Chat Service
Functionality: Allows students to upload PDF documents and interact with the chat assistant to clarify doubts.
Endpoints:
- `POST chat/upload`: Upload a PDF document.
- `POST chat/upload`POST chat/query: Chat with assistant.
- `POST chat/upload`DELETE chat/clear-chat: Clear the chat history.
- `POST chat/upload`DELETE chat/clear-doc: Clear the uploaded documents.


Inter-service Interactions: Communicates with the vector storage and GPT-3.5 model for query processing.

#### Quiz Service
Functionality: Generates multiple-choice and true/false questions from uploaded PDFs.
Endpoints:
- `POST quiz/gen-qa`: Upload a PDF document to generate Q&A.
- `GET quiz/get-qa`: Retrieve the generated quiz.
- `DELETE quiz/delete-quiz`: Delete a specified quiz.
- `POST quiz/store-results`: store specified quiz results.


Inter-service Interactions: Interacts with the analytics service to store quiz results.

#### Analytics Service
Functionality: Provides insights into quiz performance and personalized recommendations.
Endpoints:
- `GET analytics/analyze`: Get the insights from results.
- `GET analytics/analyze-by-quiz`: Get the insights from specific quiz.
- `GET analytics/get-score`: Get all the results
- `GET analytics/get-score-by-quiz`: Get the results for a specific quiz.


Inter-service Interactions: Consumes data from the quiz service to generate analytics.

### Utility Services
#### Discovery Server
- Handles the registration and monitoring of services using Kubernetes.

#### API Gateway
- Implemented with Flask, utilizes Kubernetes ingress support to route requests to the relevant services.

#### Authentication Service
- Uses Firebase authentication for user management and authorization.

#### Notification Service
- Sends email notifications to users when quiz generation is complete.

## User Interface
### Implementation Details
- Front-end: Built using React, Vite, and Tailwind CSS for a responsive and dynamic user interface.
- Back-end: Developed using Python and Flask, containerized with Docker, and orchestrated with Kubernetes.

### API Testing Tools
- Postman was used extensively to test all API endpoints and ensure their functionality and reliability.
