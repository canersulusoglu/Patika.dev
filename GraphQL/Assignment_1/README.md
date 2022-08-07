# GraphQL Assignment 1 - [Queries]

## Requirements

- Basically, you must create User, Event, Location and Participant types. You can show fields about these types in [this file](./data.json).
- A User may has one or many Event.
- A Event must be relational with one User.
- A Event must be relational with one Location.
- A Event must be relational with many Participant.
- All types must have queries these are list all and list by id.

## Example Operations

```graphql

query getAllUsers {
  users {
    id
    username
    email
  }
}

query getSingleUserById{
  user(id: 1) {
    id
    username
    email
  }
}

query getAllUsersAndTheirEvents {
  users {
    id
    username
    email
    events {
      id
      title
      date
    }
  }
}

query getUserAndEvents {
  user(id: 1) {
    id
    username
    events {
      title
      date
    }
  }
}


query getAllEvents {
  events {
    id
    title
    date
  }
}

query getAllEventsWithUserInformation {
  events {
    id
    title
    date
    user {
      username
    }
  }
}

query getEventById {
  event(id: 1){
    title
    date
  }
}

query getEventByIdWithDetails {
  event(id: 1){
    title
    date
    location {
      name
      desc
      lat
      lng
    }
    user {
      email
      username
    }
    participants {
      user {
        username
        email
      }
    }
  }
}

query getLocations{
  locations {
    id
    name
    desc
    lat
    lng
  }
}

query getLocationById{
  location(id: 1){
    name
    desc
    lat
    lng
  }
}

query getParticipants{
  participants {
    id
    user {
      id
      username
      email
    }
    event {
      id
      title
      desc
      date
    }
  } 
}

query getParticipantById{
  participant(id: 1){
    id
    user {
      id
      username
      email
    }
    event {
      id
      title
      desc
      date
    }
  }
}

```