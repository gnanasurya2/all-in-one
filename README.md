# All in One App

## Overview
All in One App is a comprehensive solution designed to offer a seamless user experience by integrating various functionalities into a single platform. The front end is built using React Native to ensure a smooth, responsive, and native-like experience across both iOS and Android devices. The back end is developed with Rust, leveraging its performance and safety features to deliver a robust and scalable server-side application.


## Features
- Cross-platform mobile application with React Native
- High-performance and memory-safe back end with Rust
- User authentication and authorization
- Modular and extensible architecture


### Front End
- **Technology:** React Native
- **Key Libraries:** React Query, React Navigation, Axios
- **Purpose:** Provide a responsive and dynamic user interface

### Back End
- **Technology:** Rust
- **Key Libraries:** Axum, Sea-orm, Serde
- **Purpose:** Handle business logic, data processing, and API endpoints

## Installation

### Prerequisites
- **Node.js** and **npm** (or **yarn**) for front-end development
- **Rust** and **Cargo** for back-end development
- **MySQL**

### Front End Setup
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/all-in-one-app.git
    cd all-in-one-app/frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

3. Run the development server:
    ```sh
    npm start
    # or
    yarn start
    ```

### Back End Setup
1. Navigate to the backend directory:
    ```sh
    cd ../backend
    ```

2. Install Rust dependencies:
    ```sh
    cargo build
    ```

3. Set up the database:
    ```sh
    diesel setup
    ```

4. Run the server:
    ```sh
    cargo run
    ```

## Usage
1. Ensure the back-end server is running.
2. Start the front-end development server.
3. Use a mobile emulator or a physical device to run the React Native application.
4. Access the app and explore its features.
