## Installation:

1. Clone the GitHub repository:

   ```shell
   git clone git@github.com:asheshmandal2003/assignment.git
   ```

2. Navigate to the project directory:

   ```shell
   cd assignment

   ```

3. Navigate to the server directory:

   ```shell
   cd server
   ```

4. Install backend dependencies:

   ```shell
   yarn
   ```

5. Create a `.env` file using the `.example.env` file.(If you want to run the application using docker then no need to change anything just craete your own env file and paste everything.)

6. Run the backend development server:

   ```shell
   yarn dev

   ```

## Setup using Docker:

1. Navigate to the project directory:

   ```shell
   cd assignment/server
   ```

2. Run Dockerfile

   ```shell
   docker build -t myapp:1.0 .
   ```

3. docker run myapp:1.0

4. Now the server will listen on port 8080
