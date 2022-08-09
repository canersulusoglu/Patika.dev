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
  Stack
} from '@mui/material';
import {
  LocalizationProvider,
  DatePicker
} from '@mui/x-date-pickers';
import {
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material'
import {
  AdapterMoment
} from '@mui/x-date-pickers/AdapterMoment';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  useLazyQuery,
  useQuery
} from '@apollo/client'
import EventService from 'services/EventService';
import {
  EventCard
} from "components";

const itemPerPage = 3;

const Home: Page = () => {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(false);

  const accordionHandleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setAccordionExpanded(isExpanded ? panel : false);
  };
  
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      eventDate: null
    },
    validationSchema: yup.object({
      title: yup.string().required("Title is required."),
      eventDate: yup.date().typeError("Invalid date.").required("Event date is required."),
    }),
    onSubmit: ({title, description, eventDate}) => {
      var eventDateString = eventDate.toLocaleDateString();
    },
  });

  const [events, setEvents] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, data } = useQuery(EventService.GET_EVENTS_COUNT);
  const [getEvents] = useLazyQuery(EventService.GET_EVENTS_PAGINATION);

  useEffect(() => {
    getEvents({
      variables: {
        pageNumber: 1,
        itemPerPage: itemPerPage
      }
    })
    .then(res => {
      if(!res.error){
        var newEvents = res.data.eventsPagination;
        setEvents(newEvents);
      }
    })
  }, [])
  
  const pageChanged = (_e, pageNumber) => {
    setPageNumber(pageNumber);
    getEvents({
      variables: {
        pageNumber: pageNumber,
        itemPerPage: itemPerPage
      }
    })
    .then(res => {
      if(!res.error){
        var newEvents = res.data.eventsPagination;
        setEvents(newEvents);
      }
    })
  }

  if (loading || !data) return <p>Loading ...</p>;
  if (error) return `Error! ${error}`;

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
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
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
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant='contained' fullWidth>Add Event</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </AccordionDetails>
      </Accordion>

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
          count={Math.ceil(data.eventCount / itemPerPage) - 1} 
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
