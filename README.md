Short overview:
===============




What is this?
-------------

Very simple book catalog web application I created for the purpose of exercise. 
One backend and two different frontend technologies of the same app (Book Catalog app).

- ASP.NET Web API
- React client
- Angular client

![screenshot](doc/reactAppScreenshot.png "app screenshot")




What is utilized?
-------------------

* .NET 8 Web API
* MS SQL 2019
* Entity framework 5
* ASP.NET Identity
* Two front-end versions of the same application: Angular 14 and React 18
* Few backend unit tests using SQLite in-memory db as a DbContext mock
* Using docker compose to run project in three different containers: WebAPI, SQL server and React web frontend
* Server-side paging, sorting and searching using SQLite in-memory db
* Twitter-bootstrap 
* Serilog
* Xunit
* Http interceptors
* Angular material
* @tanstack/react-query
* @mui/material
* material-react-table



How to run?
-----------

* Clone or download code

* To run using docker (Web Api backend and React frontend):
  - Open BookCatalog.sln in VS
  - Run "docker-compose" from top menu
  - Wait until the "web" container logs "...Compiled successfully!..." appears and follow the URL provided in the logs
    
  - ![screenshot](doc/dockersScreenshots.png "running dockers screenshot")
  - Username and password for the app:
    - username: "octopus@yahoo.com"
    - password: "2xSNzSa$"

* To run the React app (without docker):
  - Open BookCatalog.sln in VS
  - Run just single project "BookCatalog.API" from top menu
  - When app starts, database is created (migration is executed) with few tables and sone testing data is seeded also
  - Go to the folder "Bookcatalog.WebReact" using cmder or powershell 
  - Run "npm install" to install the packages
    - <strong>If "unable to resolve dependency tree" error arise, then run "npm install --force"</strong>
  - Run "npm start" to run the React app
  - Username and password for the app:
    - username: "octopus@yahoo.com"
    - password: "2xSNzSa$"
      

* To run the Angular app (without docker):
  - Open BookCatalog.sln in VS
  - Run just single project "BookCatalog.API" from top menu
  - When app starts, database is created (migration is executed) with few tables and sone testing data is seeded also
  - Go to the folder "BookCatalog.WebAng" using cmder or powershell 
  - run "npm install" to install the packages
    - <strong>if "unable to resolve dependency tree" error arise, then run "npm install --force"</strong>
  - run "ng serve -o" to run the Angular app
    - <strong>if "...digital envelope routines::unsupported" error arise, then run "set NODE_OPTIONS=--openssl-legacy-provider"</strong>
  - Username and password for the app:
    - username: "octopus@yahoo.com"
    - password: "2xSNzSa$"
