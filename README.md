# Application of Web Programming in Infrastructure Systems
The goal of this project is to develop a modern web application that allows users to take quizzes in various subjects, receive real-time results, and compare their knowledge with others through a global leaderboard. The application should be modular, extensible, and implemented according to contemporary frontend and backend development standards.

---

![Hero!](/screenshots/Hero.png)

## Built using 

- &nbsp; <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxo1QGx_G_1-2qBwh3RMPocLoKxD782w333Q&usqp=CAU" align="center" width="28" height="28"/> <a href="https://dotnet.microsoft.com/en-us/apps/aspnet"> ASP.NET 8 + Entity Framework 8 </a>
- &nbsp; <img src="https://cdn.worldvectorlogo.com/logos/react-2.svg" align="center" width="28" height="28"/> <a href="https://reactjs.org/">React 19 + Vite</a>
- &nbsp; <img src="https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" align="center" width="28" height="28"/> <a href="https://nodejs.org/">Node.js (for package management & tooling)</a>


## Installation:

1. **Install .NET SDK**:  
   Download and install the .NET SDK 8.0 for your operating system from [here](https://dotnet.microsoft.com/en-us/download/dotnet/8.0).

2. **Verify installation**:  
   Run the following command in your terminal to confirm:
   ```bash
   dotnet --list-sdks
   ```
3. **Install Node.js and npm**

   Download and install the **[Node.js LTS version](https://nodejs.org/en/download/)** — it comes with **npm** (Node Package Manager) preinstalled.

   Verify the installation by running the following commands in your terminal:

   ```bash
   node -v
   npm -v
   ```
   
 4. **Install Entity Framework Core CLI tools**

    Make sure you have the EF Core CLI tools installed globally so you can run database migrations:
    
    ```bash
    dotnet tool install --global dotnet-ef
    ```

    Verify the installation by running the following commands in your terminal:
    
    ```bash
    dotnet ef
    ```

## How to run:

1. **Clone the project**:
   ```bash
   git clone https://github.com/Acile067/Project_PUGS_Quiz_Hub.git
   cd Project_PUGS_Quiz_Hub
   ```

2. **Dotnet CLI API**:
   
    ```bash
   cd QuizHub-api/QuizHub.Infrastructure
   dotnet ef database update
   ```
    This applies all pending Entity Framework Core migrations to the database.
    Then, start the API:
    ```bash
    cd ../QuizHub.API
    dotnet run
    ```
    The application will run on port **7108**.

4. **Run UI**:
   
    ```bash
   cd quizhub-ui
   ```
   add `.env` exapmle: `VITE_BACKEND_API_URL=https://localhost:7108`

   ```bash
   npm i
   npm run dev
   ```
    
    The application will run on port **3000**.

## Use Case Diagram:

![UseCase!](/UML_Use_Case_Diagram.png)
