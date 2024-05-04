## Get Started

To get started with the `reest` framework, follow these steps:

1. Install `reest` using npm:

    ```shell
    npm install reest
    ```

2. Create a new file called `index.ts` and add the following code:

    ```javascript
    import { App, Controllers, PORT, Swagger } from "reest";
    import { CatsController } from "./controllers/cats.controller";

    @PORT(8080)
    @Swagger("/docs")
    @Controllers(CatsController)
    class MyRestApi extends App {}

    new MyRestApi();
    ```

    In this code, we import the necessary modules from `reest` and define our main application class `MyRestApi`. We set the port to `8080` using the `@PORT` decorator, enable Swagger documentation at the `/docs` endpoint using the `@Swagger` decorator.

3. Run the application:

    ```shell
    nodemon index.ts
    ```

    This will start the server and listen for incoming requests on port `8080`.

4. Open your browser and navigate to `http://localhost:8080/docs` to access the Swagger documentation for your API.

That's it! You have successfully created a basic REST API using the `reest` framework. Feel free to explore more features and customize your API according to your needs.