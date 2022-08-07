# GraphQL Assignment 3 - [Subscriptions]

- In this project added Subscriptions to GraphQL. Events:
  - USER_CREATED
  - EVENT_CREATED
  - PARTICIPANT_ADDED
  
- You can show fields about these types in [this file](./data.json).


## Example Operations

```graphql

subscription UserCreatedSub {
  userCreated {
    id
    username
    email
    createdDate
  }
}

mutation createUser{
  createUser(data: {
    email: "test_email"
    username: "test_username"
  }) {
    email
    username
    createdDate
  }
}

subscription EventCreatedSub{
  eventCreated {
    id
    title
    desc
    date
    user {
      email
      username
    }
  }
}

mutation createEvent{
  createEvent(data: {
    title: "Test Event"
    desc: "Test event desc"
    date: "07.08.2022"
    from: "12:42"
    to: "22:00"
    location_id: 1
    user_id: 1
  }) {
    title
    desc
    createdDate
  }
}


subscription ParticipantAddedSub{
  participantAdded {
    id
    user {
      email
      username
    }
    event {
      id
      title
      date
    }
    createdDate
  }
}

mutation addParticipant{
  createParticipant(data: {
    user_id: 1
    event_id: 1
  }) {
    user {
      email
      username
    }
    event {
      title
      desc
      date
    }
  }
}

```