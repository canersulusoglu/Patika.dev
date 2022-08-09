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
        query EventDetail($eventId: Int!) {
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
}

export default EventService;