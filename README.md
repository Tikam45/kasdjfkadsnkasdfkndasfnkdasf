# Application Architecture and Data Model Explanation Overview
This document explains the design and structure of our multi-tab query editor application. The
application allows users to create multiple tabs, where each tab holds its own query, query name,
result data, and sorting/pagination settings. In addition, the application shares global state for saved
queries across all tabs.

Architecture Diagram The application architecture is divided into the following major components:
SQLEditors (Parent Component):
Global State: Manages shared state variables like savedQueries and nameToQueries.
Tabs Array: Maintains an array of tab-specific state objects. Each tab contains its own query, query
name, result, sorting settings (sortColumn and sortOrder), and pagination details (currentPage and
rowsPerPage).


QueryEditor (Child Component): This component is rendered for the currently selected tab and
receives both global state (saved queries) and tab-specific state (query text, result, etc.) as props. It is
composed of the following subcomponents:

Editor: Handles query input and editing.

Queries: Manages saved queries and interacts with the global state.

Copilot: Provides AI assistance for query generation (if data analyst is dizzy 😒)

Result: A lazy-loaded component that fetches data (via PapaParse), and applies sorting, pagination,
and data export (CSV, Excel, PDF).

Result Component:
Data Fetching: Retrieves data from an external CSV URL using PapaParse.

Data Processing: Applies sorting (based on user selection) and pagination.

Data Export: Provides options to download the data as CSV, Excel, or PDF.

Data Model (ER Diagram)
The data model is designed to separate the shared and tab-specific states.
Entities TAB: Each tab represents a session or query editor instance with the following attributes:

id: Unique identifier for the tab.

query: The query text entered by the user.


queryName: The name associated with the query.

showResult: The result of executing the query.

sortColumn: The column used for sorting the result data.

sortOrder: The sorting order (asc or desc).

currentPage: The current page number in the paginated view.

rowsPerPage: The number of rows displayed per page.

SAVED_QUERY: This entity represents the saved queries, which are shared globally across all tabs:

queryName: The unique name for the saved query.

query: The saved query text.

Relationships

TAB Accesses SAVED_QUERY: Every tab has access to the same set of saved queries, allowing users to
quickly load a previously saved query into any tab.
There are also up to 20 previous queries saved for saving the data analyst from workload and let
him/her enjoy the work 😊

Explanation Global vs. Tab-Specific State: The application is designed to share certain state (e.g., saved
queries) across all tabs while isolating other state (e.g., query text, sorting, result) per tab. This allows
each tab to operate independently, ensuring that sorting or query modifications in one tab do not
affect others.

Lazy-Loaded Components: The Result component is lazy-loaded, which improves the initial load
performance. Data fetching and processing are done within this component, applying the current
tab’s sorting and pagination settings.

Interactivity: Users can toggle between tabs via a tab bar at the top of the screen. Each tab maintains
its state so that when a user switches back, the previous query, its result, and sorting remain intact.
Data Export: The application provides functionality to export the data in multiple formats (CSV, Excel,
PDF) by leveraging libraries like PapaParse, XLSX, and jsPDF.

Conclusion This document outlines the architecture and data model for the multi-tab query editor
application. The architecture ensures separation of concerns between global shared state and tabspecific state, allowing for flexible, independent management of query data across multiple tabs. The
ER diagram further clarifies the relationships between tabs and saved queries.

# Features

1. Drag and drop in queries
2. Searching in multiple queries
3. Dynamic no. of rows in result
4. Export result in csv, excel or pdf fromat
5. Up to 20 previous queries
6. AI assisted copilot
7. Sorting the data based on any column
8. Multiple tabs running queries at the same time independently
9. Edit, copy to editor or delete any saved queries
10. Pagination in table based on no. of rows

# Packages used 

hello-pangea/dnd": "^18.0.1",
"file-saver": "^2.0.5",
"jspdf": "^3.0.1",
"jspdf-autotable": "^5.0.2",
"lucide-react": "^0.485.0",
"next": "15.2.4",
"papaparse": "^5.5.2",
"react": "^19.1.0",
"react-dom": "^19.0.0",
"react-hot-toast": "^2.5.2",
"react-icons": "^5.5.0",
"react-window": "^1.8.11",
"xlsx": "^0.18.5"

# Page Load Time
This is the image showing the page load time: 
https://drive.google.com/file/d/1gief_qQCDI3NuwXf330wBREek5Ol09fM/view?usp=sharing

# Things did to decrease load Time
1. Used a Web Worker to parse the file in the background, preventing UI blocking.
2. Imported the Result lazily to imporove performance
3. Decreased the complexity of project by removing unncessary props transfer from parent to child