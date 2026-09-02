I want to build an interactive Office Workspace and Seating Management application.

## Project Goal

The application should display a real office floor plan digitally and allow authorized admins to manage employee seating and workspace/team allocation.

The physical office layout is FIXED.

This means:

- Desks cannot be moved.
- Chairs/seats as physical objects cannot be moved.
- Walls cannot be moved.
- Plants and other physical objects cannot be moved.
- Only employee assignments to seats can change.
- Admins should be able to move employees from one seat to another using drag and drop.
- The system should clearly show which office area is allocated to which team.
- Hovering over an occupied seat should display employee details.

The project should be designed cleanly so that the physical workspace layout is separated from dynamic employee assignment data.

---

# Technology Stack

Frontend:

- React
- TypeScript
- React-Konva
- Optional UI library: Ant Design
- React Query or equivalent for API state management

Backend:

- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- PostgreSQL

---

# Core Architecture

The architecture should follow this principle:

PHYSICAL OFFICE LAYOUT

↓

Fixed objects such as:

- Seats
- Desks
- Plants
- Walls
- Empty spaces

↓

DYNAMIC DATA LAYER

↓

- Employees
- Teams
- Seat assignments
- Area allocations
- Movement history

The physical office layout should NEVER change during normal employee operations.

Only employee-to-seat assignments should change.

---

# Current Layout Representation

I am currently manually mapping the office floor plan into a matrix.

Example:

```typescript
const officeLayout = [
  [0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 2, 0],
  [0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0]
];
```

Cell types:

```typescript
enum CellType {
  EMPTY = 0,
  SEAT = 1,
  PLANT = 2,
  DESK = 3,
  WALL = 4
}
```

This matrix represents ONLY the physical layout.

Do NOT store employee names or employee information directly inside the matrix.

The matrix should only answer:

"What physical object exists at this location?"

---

# Matrix Coordinate System

Each matrix cell should have a fixed visual size.

Example:

```typescript
const CELL_SIZE = 50;
```

For a cell:

```text
row = 2
column = 3
```

The React-Konva position should be:

```typescript
x = column * CELL_SIZE;
y = row * CELL_SIZE;
```

The matrix should therefore be converted into fixed coordinates for rendering.

---

# Seat Metadata

Seats need additional metadata separate from the matrix.

For example:

```typescript
const seatMetadata = {
  "1-1": {
    seatCode: "A1"
  },

  "1-2": {
    seatCode: "A2"
  },

  "2-1": {
    seatCode: "A3"
  }
};
```

The key format is:

```text
row-column
```

The matrix determines where the seat physically exists.

The metadata determines its business identity.

For example:

```text
Matrix Position

row = 1
column = 1

↓

Seat Code

A1
```

Please design this in a scalable and clean way rather than relying on hardcoded logic throughout the application.

---

# React-Konva Architecture

The floor plan should be rendered using React-Konva.

Suggested component structure:

```text
FloorPlanPage

├── FloorPlanStage
│
├── FloorLayer
│
├── AreaLayer
│
├── FurnitureLayer
│
├── SeatLayer
│
├── EmployeeLayer
│
└── TooltipLayer
```

Or equivalent clean component architecture.

The Konva Stage should support:

- Zoom in
- Zoom out
- Pan
- Reset zoom

The office floor plan can potentially be large, so it should be easy for the admin to navigate.

---

# Rendering Rules

## Empty Space

Matrix value:

```text
0
```

Nothing should be rendered.

---

## Seat

Matrix value:

```text
1
```

Render a fixed seat.

The seat itself should NOT be draggable.

The seat should contain:

- Seat code
- Employee information if occupied
- Visual indication of occupied or empty state

Example:

```text
┌──────────────┐
│ A1           │
│              │
│ 👤 Akash     │
└──────────────┘
```

---

## Plant

Matrix value:

```text
2
```

Render a plant or plant representation.

Plants should NOT be draggable.

---

## Desk

Matrix value:

```text
3
```

Render a fixed desk.

Desks should NOT be draggable.

---

## Wall

Matrix value:

```text
4
```

Render a fixed wall.

Walls should NOT be draggable.

---

# Employee Data

Employee data should be completely separate from the physical layout.

Example:

```typescript
interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
  teamId: number;
  teamName: string;
}
```

Seat assignment should look conceptually like:

```typescript
interface SeatAssignment {
  employeeId: number;
  seatId: number;
  assignedAt: string;
}
```

Example:

```text
Akash

Team → Engineering

Seat → A1
```

The physical seat A1 always exists in the same location.

Only the employee assigned to it can change.

---

# Hover Feature

When the user hovers over an occupied seat, display an employee tooltip.

Example:

```text
┌──────────────────────────┐
│ Akash Sharma             │
│                          │
│ Software Engineer        │
│ Team: Engineering        │
│ Seat: A1                 │
└──────────────────────────┘
```

Use React-Konva mouse events such as:

```text
onMouseEnter
onMouseLeave
```

Employee data should already be available in frontend state.

Do NOT make an API request every time the user hovers over a seat.

---

# Drag and Drop

This is one of the main features.

IMPORTANT:

Only the employee representation should be draggable.

The following must remain fixed:

- Seats
- Desks
- Walls
- Plants
- Other physical office objects

Example:

Before:

```text
Seat A1 → Akash

Seat B1 → Empty
```

Admin drags Akash from A1 to B1.

After:

```text
Seat A1 → Empty

Seat B1 → Akash
```

The physical office layout remains unchanged.

---

# Drag and Drop Workflow

When an employee is dragged:

```text
Employee

↓

Drag

↓

Detect target seat

↓

Validate target

↓

Update frontend state optimistically

↓

Call backend API

↓

Persist assignment
```

The system should validate:

- Target must be a valid seat.
- Target seat should not already be occupied unless seat swapping is explicitly supported.
- Employee cannot be dropped outside a valid seat.
- If the API fails, revert the optimistic UI change.

Initially, implement movement only to EMPTY seats.

Seat swapping can be added later.

---

# Backend API for Movement

Suggested endpoint:

```http
POST /api/seat-assignments/move
```

Example request:

```json
{
  "employeeId": 10,
  "targetSeatId": 205
}
```

The backend should:

1. Find the employee.
2. Find their current seat assignment.
3. Validate the target seat.
4. Check whether the target seat is available.
5. Remove/update the previous assignment.
6. Create the new assignment.
7. Save movement history.
8. Complete everything inside a database transaction.

---

# Team Areas

The floor plan should support visual areas.

Example:

```text
┌─────────────────────────────┐
│                             │
│ ENGINEERING AREA            │
│                             │
│ A1  A2  A3  A4              │
│ A5  A6  A7  A8              │
│                             │
└─────────────────────────────┘
```

Another example:

```text
┌─────────────────────────────┐
│ PRODUCT AREA                │
│                             │
│ B1  B2  B3  B4              │
└─────────────────────────────┘
```

Each area should support:

- Area name
- Team assignment
- Team color
- Position and dimensions

Areas should be rendered as a subtle/translucent background layer.

The layer order should ensure that areas never hide seats or employees.

---

# Team and Seat Relationship

Important architectural rule:

An employee's organizational team and their physical seating location should be independent.

Example:

```text
Employee: Akash

Organizational Team:
Engineering

Physical Seat:
B1
```

Therefore, moving an employee into another team's physical area should NOT automatically change their organizational team.

Team changes should be handled separately.

This avoids mixing organizational data with physical seating data.

---

# Database Design

Please design the backend using entities similar to the following.

## TEAM

```text
id
name
color
```

---

## EMPLOYEE

```text
id
name
email
designation
team_id
```

---

## WORKSPACE

```text
id
name
floor_plan_version
```

---

## AREA

```text
id
workspace_id
name
team_id
x
y
width
height
```

---

## SEAT

```text
id
workspace_id
area_id
seat_code
row
column
```

Seat coordinates should be derived from:

```text
row
column
CELL_SIZE
```

unless there is a strong reason to persist absolute coordinates.

---

## SEAT_ASSIGNMENT

```text
id
employee_id
seat_id
assigned_at
assigned_by
```

Only one active employee should occupy one seat.

Only one active seat should be assigned to one employee.

Please enforce appropriate database constraints.

---

## MOVEMENT_HISTORY

```text
id
employee_id
old_seat_id
new_seat_id
old_team_id
new_team_id
changed_by
changed_at
```

This should provide a complete audit trail.

---

# Required APIs

Please design clean REST APIs.

Suggested endpoints:

### Workspace

```text
GET /api/workspaces/{id}/floor-plan
```

This API should ideally return:

- Workspace details
- Areas
- Seats
- Current employee assignments

The frontend should be able to render the complete floor plan without making many API calls.

---

### Employees

```text
GET /api/employees

GET /api/employees/{id}
```

---

### Seats

```text
GET /api/workspaces/{workspaceId}/seats

GET /api/seats/{seatId}
```

---

### Assign Employee

```text
POST /api/seat-assignments
```

---

### Move Employee

```text
POST /api/seat-assignments/move
```

---

### Remove Assignment

```text
DELETE /api/seat-assignments/{employeeId}
```

---

### Movement History

```text
GET /api/movement-history
```

Support filters such as:

- Employee
- Date range
- Team

---

# Admin Authorization

There should be two main roles.

## USER

Can:

- View floor plan
- View seat occupancy
- Hover and view employee details

Cannot:

- Move employees
- Change assignments
- Modify team areas

---

## ADMIN

Can:

- View floor plan
- Assign employees
- Move employees
- Remove assignments
- Manage team areas
- View movement history

Use Spring Security for authorization.

---

# Bulk Employee Movement

This feature can be implemented after the single employee movement works correctly.

Admin should be able to select multiple employees.

Example:

```text
☑ Akash
☑ Rahul
☑ Amit
☐ Rohit
```

Admin selects a target area.

The system should:

1. Find available seats.
2. Validate sufficient capacity.
3. Assign employees to available seats.
4. Execute the operation transactionally.
5. Save history for each employee.

Example API:

```http
POST /api/seat-assignments/bulk-move
```

Example:

```json
{
  "employeeIds": [10, 11, 12],
  "targetAreaId": 5
}
```

---

# Recommended Implementation Phases

## Phase 1 — Static Layout

First focus only on:

```text
Matrix

↓

React-Konva

↓

Render fixed objects
```

Render:

- Empty spaces
- Seats
- Plants
- Desks
- Walls

At this stage, there should be NO backend dependency.

The goal is to visually reproduce the actual office layout accurately.

---

## Phase 2 — Seat Metadata

Add:

- Seat IDs
- Seat codes
- Row/column mapping

Example:

```text
Matrix Position

row = 5
column = 10

↓

Seat A1
```

---

## Phase 3 — Interactive Seats

Add:

- Click seat
- Hover seat
- Empty/occupied state

Use mock employee data initially.

---

## Phase 4 — Backend Integration

Create:

- Spring Boot project
- PostgreSQL schema
- Employee APIs
- Team APIs
- Workspace APIs
- Seat APIs
- Seat assignment APIs

Connect the React frontend to backend APIs.

---

## Phase 5 — Drag and Drop

Implement:

- Drag employee representation
- Detect valid target seat
- Drop validation
- Optimistic UI update
- Backend persistence
- Error rollback

Again:

ONLY employees should move.

Physical objects must remain fixed.

---

## Phase 6 — Team Areas

Implement:

- Area visualization
- Team colors
- Area labels
- Area-to-team mapping

Areas should be visually represented behind seats.

---

## Phase 7 — Advanced Features

Implement:

- Zoom
- Pan
- Reset viewport
- Bulk employee movement
- Movement history
- Admin authorization
- Filters by team
- Search employee and locate their seat

---

# Important UI Requirements

The UI should feel like a real interactive office map.

Admin should be able to:

```text
Zoom

↓

Pan

↓

Hover over seats

↓

See employee information

↓

Drag employee

↓

Drop employee on another empty seat

↓

Persist change
```

The application should clearly visually distinguish:

- Empty seat
- Occupied seat
- Team area
- Fixed physical objects

Do not allow accidental dragging of the office layout itself.

---

# Code Quality Requirements

Please:

- Use TypeScript properly.
- Avoid large monolithic components.
- Separate domain models from UI components.
- Create reusable components.
- Keep matrix/layout logic separate from employee assignment logic.
- Use clean naming conventions.
- Add comments only where necessary.
- Avoid unnecessary overengineering.
- Design APIs and entities using clean backend architecture.
- Use database transactions for movement operations.
- Enforce uniqueness constraints for active seat assignments.
- Make the frontend scalable for future layout changes.

---

# Initial Deliverable

Start by implementing ONLY the frontend static prototype.

The first milestone should be:

1. Read the office layout matrix.
2. Render it accurately using React-Konva.
3. Create reusable renderers for:
   - Seat
   - Plant
   - Desk
   - Wall
4. Support zoom and pan.
5. Add seat metadata.
6. Add mock employee assignments.
7. Display employee name on occupied seats.
8. Add hover tooltip.

Do NOT start backend integration until the static floor plan accurately matches the actual office layout.

After the frontend prototype is working, proceed incrementally to backend integration and drag-and-drop.

Before writing the implementation, first propose the recommended project folder structure and explain the data flow between:

Matrix Layout
→ Seat Metadata
→ React-Konva Components
→ Employee Assignments

Then implement the project step by step.