import { gql } from "@apollo/client";

class ParticipantService {
    public static SUBSCRIPTION_PARTICIPANT_ADDED = gql`
        subscription ParticipantAdded($eventId: Int!) {
            participantAdded(event_id: $eventId) {
                id
                user {
                    id
                    username
                    email
                }
            }
        }
    `;
}

export default ParticipantService;