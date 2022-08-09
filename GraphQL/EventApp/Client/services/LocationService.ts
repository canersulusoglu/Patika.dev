import { gql } from "@apollo/client";

class LocationService {
    public static GET_LOCATIONS = gql`
        query Locations {
            locations {
                id
                name
            }
        }
    `;
}

export default LocationService;