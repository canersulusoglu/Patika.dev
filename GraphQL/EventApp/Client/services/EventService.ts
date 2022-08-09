import { gql } from "@apollo/client";

class EventService {
    public static GET_ALL_EVENTS = gql`
        query Events {
            events {
                id
                title
                desc
                date
            }
        }
    `;

    public static GET_EVENTS_COUNT = gql`
        query EventsCount {
            eventCount
        }
    `;

    public static GET_EVENTS_PAGINATION = gql`
        query EventsPagination($pageNumber: Int!, $itemPerPage: Int!) {
            eventsPagination(pageNumber: $pageNumber, itemPerPage: $itemPerPage) {
                id
                title
                desc
                date
            }
        }
    `;

    public static GET_EVENT_DETAILS = gql`
        query EventDetail($eventId: ID!) {
            event(id: $eventId) {
                id
                title
                desc
                date
                from
                to
                user {
                    id
                    email
                    username
                }
                participants {
                    user {
                        id
                        email
                        username
                    }
                }
            }
        }
    `;

    public static CREATE_EVENT = gql`
        mutation CreateEvent($data: CreateEventInput!) {
            createEvent(data: $data) {
                id
                createdAt
            }
        }
    `;

    public static SUBSCRIPTION_EVENT_CREATED = gql`
        subscription EventCreated {
            eventCreated {
                id
                title
                desc
                date
            }
        }
    `;

    public static SUBSCRIPTION_EVENT_COUNT = gql`
        subscription EventCount {
            eventCount
        }
    `;
}

export default EventService;