import type { Page } from 'types/Page';
import styles from 'styles/pages/index.module.css'
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel
} from '@mui/material';
import {
  LocalizationProvider,
  DatePicker,
  TimePicker
} from '@mui/x-date-pickers';
import {
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material'
import {
  AdapterMoment
} from '@mui/x-date-pickers/AdapterMoment';
import {
  EventCard
} from "components";
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  useLazyQuery,
  useQuery,
  useSubscription,
  useMutation
} from '@apollo/client'
import EventService from 'services/EventService';
import LocationService from 'services/LocationService';
import UserService from 'services/UserService';

const itemPerPage = 3;

const Home: Page = () => {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(false);

  const accordionHandleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setAccordionExpanded(isExpanded ? panel : false);
  };

  const [pageNumber, setPageNumber] = useState(1);
  // Gets Event counts
  const { loading : eventsCountLoading, error : eventsCountError, data : eventsCountData } = useQuery(EventService.GET_EVENTS_COUNT);
  // Get Events according to pageNumber and Subscribe for creating new event
  const [getEvents, { subscribeToMore, fetchMore, error: eventsError, loading: eventsLoading, data: { eventsPagination : events = []} = {} }] = useLazyQuery(EventService.GET_EVENTS_PAGINATION);
  // Subscribe for counting event
  const { loading: eventCountSubsriptionLoading, data: eventCountSubsriptionData} = useSubscription(EventService.SUBSCRIPTION_EVENT_COUNT);
  // Gets all Locations (id and name only)
  const { loading : locationsLoading, error : locationsError, data : locationsData} = useQuery(LocationService.GET_LOCATIONS);
  // Gets all Users (id and username only)
  const { loading : usersLoading, error : usersError, data : usersData} = useQuery(UserService.GET_USERS);
  // Mutation for creating new event
  const [createEvent, { loading : createEventLoading, error : createEventError, data : createEventData}] = useMutation(EventService.CREATE_EVENT);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      eventDate: null,
      eventFrom: null,
      eventTo: null,
      locationId: '',
      userId: ''
    },
    validationSchema: yup.object({
      title: yup.string().required("Title is required."),
      eventDate: yup.date().typeError("Invalid date.").required("Event date is required."),
      eventFrom: yup.date().typeError("Invalid time.").required("Event from is required."),
      eventTo: yup.date().typeError("Invalid time.").required("Event to is required."),
      locationId: yup.string().required("Location is required."),
      userId: yup.string().required("User is required."),
    }),
    onSubmit: ({title, description, eventDate, eventFrom, eventTo, locationId, userId} : any) => {
      const eventDateString = eventDate.getFullYear() + "-" + (eventDate.getMonth() + 1) + "-" + eventDate.getDate();
      const eventFromString = ("0" + eventFrom.getHours(2)).slice(-2) + ':' + ("0" + eventFrom.getMinutes(2)).slice(-2);
      const eventToString = ("0" + eventTo.getHours(2)).slice(-2) + ':' + ("0" + eventTo.getMinutes(2)).slice(-2);

      createEvent({
        variables: {
          data: {
            title: title,
            desc: description,
            date: eventDateString,
            from: eventFromString,
            to: eventToString,
            location_id: Number(locationId),
            user_id: Number(userId)
          }
        }
      })
    },
  });

  useEffect(() => {
    getEvents({
      variables: {
        pageNumber: 1,
        itemPerPage: itemPerPage
      }
    });

    subscribeToMore({
      document: EventService.SUBSCRIPTION_EVENT_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newEvent = subscriptionData.data.eventCreated;
        const slicedEvents = prev.eventsPagination.slice(0, prev.eventsPagination.length - 1);
        return {
          eventsPagination: [newEvent, ...slicedEvents]
        };
      }
    })
  }, [])
  
  const pageChanged = (_e, pageNumber) => {
    setPageNumber(pageNumber);
    fetchMore({
      variables: {
        pageNumber: pageNumber,
        itemPerPage: itemPerPage
      },
      updateQuery:(prev, { fetchMoreResult }) => {
        return fetchMoreResult;
      }
    })
  }

  if (eventsCountLoading || eventsLoading || locationsLoading || usersLoading) return <p>Loading ...</p>;
  if (eventsCountError || eventsError || locationsError || usersError) return 'Error!';

  return (
    <div className={styles.container}>
      <Accordion expanded={accordionExpanded === 'add-event-panel'} onChange={accordionHandleChange('add-event-panel')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
        >
          <Typography variant='h5' sx={{ width: '33%', flexShrink: 0 }}> Add Event</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ my: 2 }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Title" 
                    variant="outlined" 
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    rows={2}
                    multiline
                    fullWidth
                    name="description"
                    label="Description" 
                    variant="outlined" 
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
                <Grid container item xs={12} spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Grid item xs={12}>
                      <DatePicker
                        label="Event Date"
                        value={formik.values.eventDate}
                        onChange={(value) => formik.setFieldValue("eventDate", value ? value.toDate() : null, true)}
                        inputFormat="DD/MM/YYYY"
                        disableMaskedInput
                        renderInput={({ error, ...rest}) => 
                          <TextField
                            fullWidth
                            name="eventDate"
                            variant="outlined"
                            error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                            helperText={formik.touched.eventDate && formik.errors.eventDate}
                            {...rest} 
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TimePicker
                        label="Event From"
                        value={formik.values.eventFrom}
                        onChange={(value) => formik.setFieldValue("eventFrom", value ? value.toDate() : null, true)}
                        ampm={false}
                        renderInput={({ error, ...rest}) => 
                          <TextField
                            fullWidth
                            name="eventFrom"
                            variant="outlined"
                            error={formik.touched.eventFrom && Boolean(formik.errors.eventFrom)}
                            helperText={formik.touched.eventFrom && formik.errors.eventFrom}
                            {...rest} 
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TimePicker
                        label="Event To"
                        value={formik.values.eventTo}
                        onChange={(value) => formik.setFieldValue("eventTo", value ? value.toDate() : null, true)}
                        ampm={false}
                        renderInput={({ error, ...rest}) => 
                          <TextField
                            fullWidth
                            name="eventTo"
                            variant="outlined"
                            error={formik.touched.eventTo && Boolean(formik.errors.eventTo)}
                            helperText={formik.touched.eventTo && formik.errors.eventTo}
                            {...rest} 
                          />
                        }
                      />
                    </Grid>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <FormControl 
                    fullWidth
                    error={formik.touched.locationId && Boolean(formik.errors.locationId)}
                  >
                    <InputLabel id="location-select-label">Location</InputLabel>
                    <Select
                        name="locationId"
                        labelId="location-select-label"
                        label="Location"
                        value={formik.values.locationId}
                        onChange={formik.handleChange}
                    >
                      {
                        locationsData.locations.map((location, index) => {
                          return(
                            <MenuItem key={index} value={location.id}>{location.name}</MenuItem>
                          );
                        })
                      }
                    </Select>
                    <FormHelperText>{formik.touched.locationId && formik.errors.locationId}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl 
                    fullWidth
                    error={formik.touched.userId && Boolean(formik.errors.userId)}
                  >
                    <InputLabel id="user-select-label">User</InputLabel>
                    <Select
                        name="userId"
                        labelId="user-select-label"
                        label="User"
                        value={formik.values.userId}
                        onChange={formik.handleChange}
                    >
                      {
                        usersData.users.map((user, index) => {
                          return(
                            <MenuItem key={index} value={user.id}>{user.username}</MenuItem>
                          );
                        })
                      }
                    </Select>
                    <FormHelperText>{formik.touched.userId && formik.errors.userId}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant='contained' fullWidth>Add Event</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Typography variant='h6' display="flex" justifyContent="end" style={{margin: '1rem'}}>
          {
            !eventCountSubsriptionLoading ? 
              eventCountSubsriptionData.eventCount
            : 
              eventsCountData.eventCount
          } 
          &nbsp;events
      </Typography>

      {
        events.map((event, index) => {
          return(
            <EventCard 
              key={index} 
              id={event.id}
              title={event.title} 
              desc={event.desc} 
              date={event.date}
            />
          );
        })
      }

      <div className={styles.pagination}>
        <Pagination 
          onChange={pageChanged} 
          page={pageNumber} 
          count={eventCountSubsriptionLoading ? (Math.ceil(eventsCountData.eventCount / itemPerPage) - 1) : (Math.ceil(eventCountSubsriptionData.eventCount / itemPerPage) - 1)} 
          showFirstButton 
          showLastButton 
          variant="outlined" 
          color="primary"
        /> 
      </div>
      
    </div>
  )
}

Home.Title = "Events"

export default Home
