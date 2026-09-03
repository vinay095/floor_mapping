# floor_mapping

## phase 1: visualization(mvp)

floor map(image) -> matrix -> render the ui(seats(1), passage(0), anything else(2))

0 -> passage area
1 -> seats
2 -> else(office, meeting room, cafe, etc.)

no db initially, only mock data.

## phase 2: admin functionality

- add the seats which will have employee, availability, type(desk, cabin, etc.)
- drag and drop the employees in the seats
- get employee data

## final phase

- make some rendering tool so that the image can be converted to matrix directly, which can be fed to konva or some other ui tool
- seating arrangement optimization
- integration with teams or zoho people(optimistic)

## techstack

### frontend

- react, tailwind, konva , etc

### backend

- springboot, etc

### db

- postgresql
