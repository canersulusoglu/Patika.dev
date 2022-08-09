import { gql } from "@apollo/client";

class UserService {
    public static GET_USERS = gql`
        query Users {
            users {
                id
                username
            }
        }
    `;
}

export default UserService;