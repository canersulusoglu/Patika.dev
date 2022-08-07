# GraphQL Assignment 2 - [Mutations]

- There are 4  types. User, Event, Location and Participant. Each have 4 mutations:
  - create
  - update
  - delete
  - deleteAll
  
- You can show fields about these types in [this file](./data.json).


## Example Operations

```graphql

query getAllUsers{
  users {
    id
    email
    username
    updatedDate
    createdDate
  }
}

mutation deleteAllUsers{
  deleteAllUsers
}

mutation createUser{
  createUser(data: { 
    email: "test@gmail.com",
    username: "canersulusoglu"
  }){
    id
  }
}

mutation updateUser{
  updateUser(
    id: 26, 
    data: {
      username: "Ahmet"
    }
  ) {
    id
    username
    updatedDate
    createdDate
  }
}

mutation deleteUser{
  deleteUser(id: 25) {
    id
    email
    username
    createdDate
    updatedDate
  }
}

query getAllEvents{
  events {
    id
    title
    from
    to
    location_id
  }
}

mutation deleteAllEvents{
  deleteAllEvents
}

mutation createEvent{
  createEvent(data: {
    title: "Event Test Name",
    desc: "",
    date: "06.08.2022",
    from: "06:02",
    to: "12:18",
    location_id: 7
    user_id: 1
  }) {
    title
    desc
    createdDate
    date
    from
    to
    location_id
    user {
      email
      username
    }
  }
}

mutation updateEvent{
  updateEvent(
    id: 26, 
    data: {
      title: "Updated Event Test Name"
    }
  ) {
    id
    title
    updatedDate
    user {
      email
      username
    }
  }
}

mutation deleteEvent{
  deleteEvent(id: 26) {
    id
    title
    desc
    createdDate
    updatedDate
    user {
      email
      username
    }
  }
}


query getAllLocations{
  locations {
    id
    name
    lat
    lng
  }
}

mutation deleteAllLocations{
  deleteAllLocations
}

mutation createLocation{
  createLocation(
    data: {
      name: "Turkey",
      desc: "Location of Turkey"
      lat: 39.1667,
      lng: 35.6667
    }
  ) {
    id
    name
    lat
    lng
    createdDate
  }
}

mutation updateLocation{
  updateLocation(
    id: 1, 
    data: {
      name: "Turkey",
      desc: "Location of Turkey",
      lat: 39.1667
      lng: 35.6667
    }
  ) {
    name
    desc
    lat
    lng
    createdDate
    updatedDate
  }
}

mutation deleteLocation{
  deleteLocation(id: 1){
    id
    name
    desc
    lat
    lng
    createdDate
    updatedDate
  }
}


query getAllParticipants{
  participants {
    id
    user {
      username
    }
  }
}

mutation deleteAllParticipants{
  deleteAllParticipants
}

mutation createParticipant{
  createParticipant(data: {
    user_id: 1,
    event_id: 2
  }) {
    user {
      email
      username
    }
    event {
      title
      date
    }
  }
}

mutation updateParticipant{
  updateParticipant(
    id: 1, 
    data: {
      user_id: 2
    }
  ) {
    user {
      username
    }
    updatedDate
  }
}

mutation deleteParticipant{
  deleteParticipant(id:1) {
    user {
      username
    }
    createdDate
    updatedDate
  }
}

```