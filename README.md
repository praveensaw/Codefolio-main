<!--
Hey, thanks for using the awesome-readme-template template.  
If you have any enhancements, then fork this project and create a pull request 
or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">

  <img src="https://res.cloudinary.com/dtobcdrww/image/upload/v1740804824/Screenshot_2025-03-01_095641_he7yoo.png" alt="logo" width="auto" height="auto" />
  <h1></h1>
  <p>
CodeFolio is a unified platform that consolidates coding profiles and performance metrics from multiple popular competitive programming and developer platforms.  </p>
<p>By aggregating data from CodeChef, CodeForces, LeetCode, GeeksforGeeks, and GitHub, CodeFolio provides recruiters and interviewers with a comprehensive dashboard to evaluate a candidate's coding skills and project contributions.</p>
<p> The platform normalizes diverse data—such as contest ratings, problems solved, and projects contributions—and presents it through intuitive analytics and real-time updates, streamlining the candidate evaluation process and enabling data-driven hiring decisions.
</p>
   
</div>

<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  * [Screenshots](#camera-screenshots)
  * [Tech Stack](#space_invader-tech-stack)
  * [Features](#dart-features)
- [Getting Started](#toolbox-getting-started)
  * [Prerequisites](#bangbang-prerequisites)
  * [Run Locally](#running-run-locally)
- [Roadmap](#compass-roadmap)
- [FAQ](#grey_question-faq)
- [Acknowledgements](#gem-acknowledgements)

  

<!-- About the Project -->
## :star2: About the Project


<!-- Screenshots -->
### :camera: Screenshots

<div align="center"> 
  <img src="https://res.cloudinary.com/dtobcdrww/image/upload/v1740805521/Screenshot_2025-03-01_101415_vafcux.png" alt="screenshot" />
</div>
<div align="center"> 
  <img src="https://res.cloudinary.com/dtobcdrww/image/upload/v1740805521/Screenshot_2025-03-01_101439_hgfxam.png" alt="screenshot" />
</div>
<div align="center"> 
  <img src="https://res.cloudinary.com/dtobcdrww/image/upload/v1740805522/Screenshot_2025-03-01_101515_gnxkdb.png" alt="screenshot" />
</div>


<!-- TechStack -->
### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://reactrouter.com/">React Router</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://nodejs.org/">Node.js</a></li>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://www.npmjs.com/package/bcryptjs">bcrypt.js</a></li>
    <li><a href="https://www.npmjs.com/package/jsonwebtoken">jsonwebtoken</a></li>
    <li><a href="https://www.npmjs.com/package/puppeteers">Puppeteers</a></li>
     <li><a href="https://www.npmjs.com/package/jsdom">JSDom</a></li>
    <li><a href="https://www.npmjs.com/package/graphql">Graphql</a></li>
  </ul>
</details>

<details>
  <summary>Database</summary>
  <ul>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
  </ul>
</details>


<!-- Features -->
### :dart: Features

<details>
  <summary>🎯 Features</summary>
  <ul>
    <li>📌 Unified Profile Aggregation: Consolidates coding profiles from CodeChef, CodeForces, LeetCode, GeeksforGeeks, and GitHub into a single dashboard.</li>
    <li>⚡ Comprehensive Analytics: Displays performance metrics such as contest ratings, problems solved, and contribution statistics.</li>
    <li>📊 Real-time Data Updates: Synchronizes data dynamically to provide up-to-date insights on candidate performance.</li>
    <li>🔍 Advanced Search & Filtering: Allows recruiters to quickly locate candidates based on specific skills and performance metrics.</li>
    <li>💡 Data Normalization: Harmonizes diverse metrics from different platforms for accurate and fair comparisons.</li>
    <li>🚀 Interactive Dashboard: Features customizable visualizations and reports for detailed candidate evaluation.</li>
    <li>🔄 Seamless Integration: Utilizes API integrations and web scraping for continuous, automated data collection.</li>
    <li>🛠️ Recruiter Tools: Provides actionable insights and tracking tools to support data-driven hiring decisions.</li>
  </ul>
</details>






<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses npm as package manager

```bash
 npm install 
```

<!-- Run Locally -->
### :running: Run Locally


Clone the project

```bash
  git clone https://github.com/omkumavat/Codefolio.git
```
### :computer: Client

Go to the project directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the Client

```bash
  npm start
```

### :computer: Server

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the Server

```bash
  nodemon index.js
```

<!-- Roadmap -->
## 🧭 Roadmap

* [x] Set up project structure and initial configurations  
* [x] Implement user authentication and authorization (JWT-based)  
* [x] Integrate CodeChef, CodeForces, LeetCode, GeeksforGeeks, and GitHub profiles  
* [x] Develop backend logic for fetching and aggregating coding statistics  
* [x] Implement data normalization for consistent performance metrics  
* [x] Design an interactive dashboard for profile visualization  
* [x] Enable search and filtering of candidates based on skills and coding activity  
* [x] Implement API-based real-time data updates  
* [x] Develop recruiter tools for tracking and evaluating candidates  
* [ ] Enhance UI/UX for a seamless user experience (React, Tailwind CSS)  
* [ ] Optimize API performance and reduce data retrieval latency  
* [ ] Implement multilingual support for a global audience  
* [ ] Develop a mobile-responsive interface for on-the-go access  

<!-- FAQ -->
## :grey_question: FAQ

- **How do I set up the project?**

  + Clone the repository using `git clone https://github.com/omkumavat/Codefolio.git`, navigate to the project folder, and run `npm install` to install the dependencies. After that, you can start the server using `npm start`.

- **How do I add environment variables?**

  + Create a `.env` file in the root of your project and add the necessary environment variables like `API_KEY`, `MONGODB_URL`, `JWT_SECRET`, and others, as described in the setup section of the README.

- **Can I contribute to the project?**

  + Yes, you can contribute! Please fork the repository, make changes, and create a pull request. Ensure that your code follows the project's style guide and includes necessary tests.

- **What should I do if I face issues with deployment?**

  + If you encounter deployment issues, ensure that all environment variables are set correctly, check the logs for any errors, and make sure the server is configured properly. You can also check the troubleshooting section in the README or contact the maintainer.

- **What are the system requirements?**

  + The project requires Node.js (version 14 or later), npm, and an active MongoDB instance. It also requires certain environment variables like `MONGODB_URL` for database access.

- **How can I run tests for this project?**

  + To run tests, execute `npm start` after installing dependencies. Ensure that you have configured all required environment variables before running the tests.


<!-- Acknowledgments -->
## :gem: Acknowledgements

Use this section to mention useful resources and libraries that you have used in your projects.

- [Readme Template](https://github.com/othneildrew/Best-README-Template) - A great README template to follow for structuring my documentation.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - For cloud-based MongoDB database hosting.
- [Node.js](https://nodejs.org/en/) - The runtime environment for building the server-side of the project.
- [Express.js](https://expressjs.com/) - Framework used for building the server and API.
- [React.js](https://reactjs.org/) - For building the frontend of the project.
- [Axios](https://axios-http.com/) - For making API requests on the frontend.

