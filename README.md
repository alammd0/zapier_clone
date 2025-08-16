# Zapier Clone

This project is a full-stack clone of Zapier, an online automation tool that connects your favorite apps, such as Gmail, Slack, and more. This implementation allows users to create automated workflows ("Zaps") consisting of a trigger and a series of actions.

## Architecture

The application is built using a microservices architecture, with distinct services for the frontend, backend API, webhook handling, and asynchronous task processing.

-   **`frontend`**: A [Next.js](https://nextjs.org/) application that provides the user interface for creating, managing, and monitoring Zaps.

-   **`primary-backend`**: The core REST API built with [Express.js](https://expressjs.com/). It handles user authentication, CRUD operations for Zaps, and configuration of triggers and actions.

-   **`hooks`**: A dedicated [Express.js](https://expressjs.com/) service that listens for incoming webhooks. When a trigger event is received, it initiates a new workflow run by creating an entry in the database.

-   **`processor`**: A background service that polls the database for new workflow runs created by the `hooks` service. It then pushes these events into an [Apache Kafka](https://kafka.apache.org/) topic for reliable, asynchronous processing.

-   **`worker`**: A consumer service that listens to the Kafka topic. It executes the actions associated with a Zap run, such as sending emails or processing blockchain transactions. It handles multi-step Zaps by processing actions sequentially and pushing subsequent steps back into the queue.

### Data Flow

1.  A user creates a Zap in the **frontend**.
2.  The configuration is saved to the database via the **primary-backend**.
3.  An external service sends a webhook to the **hooks** service to trigger the Zap.
4.  The **hooks** service creates a `ZapRun` record in the database.
5.  The **processor** detects the new `ZapRun` and pushes a message to a Kafka topic.
6.  The **worker** consumes the message from Kafka and executes the first action of the Zap.
7.  If there are more actions, the **worker** pushes a new message to Kafka for the next stage.
8.  This continues until all actions in the Zap are completed.

## Tech Stack

-   **Frontend**: Next.js, React, TypeScript, Tailwind CSS
-   **Backend**: Node.js, Express.js, TypeScript
-   **Database**: PostgreSQL (via Prisma)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Messaging Queue**: [Apache Kafka](https://kafka.apache.org/)
-   **Authentication**: JWT (JSON Web Tokens)
-   **Validation**: Zod

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v20 or later recommended)
-   [npm](https://www.npmjs.com/)
-   [Docker](https://www.docker.com/) (for running PostgreSQL and Kafka)
-   A running PostgreSQL instance.
-   A running Kafka instance.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Zapier
    ```

2.  **Install dependencies for each service:**
    You need to run `npm install` in each of the service directories.
    ```bash
    cd frontend && npm install && cd ..
    cd primary-backend && npm install && cd ..
    cd hooks && npm install && cd ..
    cd processor && npm install && cd ..
    cd worker && npm install && cd ..
    ```

3.  **Set up environment variables:**
    Each service (`primary-backend`, `hooks`, `processor`, `worker`) contains a `.env` file. You will need to create and configure them based on your local setup (e.g., database connection strings, Kafka broker addresses). A typical `DATABASE_URL` for Prisma looks like this:
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```

4.  **Run database migrations:**
    Each service that uses Prisma has its own schema. Run migrations for each one to set up the necessary tables.
    ```bash
    cd primary-backend && npx prisma migrate dev --name init && cd ..
    cd hooks && npx prisma migrate dev --name init && cd ..
    cd processor && npx prisma migrate dev --name init && cd ..
    cd worker && npx prisma migrate dev --name init && cd ..
    ```

### Running the Application

To run the entire application, you must start each service in a separate terminal window.

1.  **Start the Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

2.  **Start the Primary Backend:**
    ```bash
    cd primary-backend
    npm run dev
    ```
    The API server will run on port `4000`.

3.  **Start the Hooks Service:**
    ```bash
    cd hooks
    npm run dev
    ```
    The hooks service will run on port `3001`.

4.  **Start the Processor Service:**
    ```bash
    cd processor
    npm run dev
    ```

5.  **Start the Worker Service:**
    ```bash
    cd worker
    npm run dev
    ```
